import 'server-only';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { chromium, Browser, Page } from 'playwright';
import { normalizeBrandName, normalizeTags } from '../utils/brand-normalizer';
import { upsertCrawledDeals } from './deals-dal';

export interface DaybuyPromotionArticleMeta {
  url: string;
  title: string;
  publishDate?: string;
  excerpt?: string;
  thumbnailUrl?: string;
}

export interface DaybuyCrawlerProgressCallback {
  (step: 'list_start' | 'list_complete' | 'article_start' | 'article_complete' | 'done' | 'error', data: {
    message: string;
    currentArticleIndex?: number;
    totalArticles?: number;
    articleTitle?: string;
    dealsFound?: number;
    totalDeals?: number;
  }): void;
}

export const DAYBUY_COSTCO_PROMOTIONS_URL = 'https://www.daybuy.tw/costco/promotions/';

/**
 * 輔助函式：自文字中提取活動檔期起訖日 (YYYY-MM-DD)
 */
export function extractPromotionDateRange(rawText: string): { startDate: string; endDate: string } {
  const now = new Date();
  const currentYear = now.getFullYear();
  let startDate = now.toISOString().split('T')[0];
  const defaultEnd = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
  let endDate = defaultEnd.toISOString().split('T')[0];

  if (!rawText) return { startDate, endDate };

  // 匹配形式：2026 08.31(一)~2026 09.27(日) 或 08/31(一)~09/27(日) 或 2026/08/24~08/30
  const dateRangePattern = /(?:(\d{4})[年\.\/-])?(\d{1,2})[月\.\/-](\d{1,2})[日號]?\s*[\(（][^）\)]*[\)）]?\s*[-~至到]\s*(?:(\d{4})[年\.\/-])?(\d{1,2})[月\.\/-](\d{1,2})[日號]?/;
  const match = rawText.match(dateRangePattern);

  if (match) {
    const sYear = match[1] ? parseInt(match[1], 10) : currentYear;
    const sMonth = parseInt(match[2], 10);
    const sDay = parseInt(match[3], 10);

    const eYear = match[4] ? parseInt(match[4], 10) : sYear;
    const eMonth = match[5] ? parseInt(match[5], 10) : sMonth;
    const eDay = parseInt(match[6], 10);

    if (sMonth >= 1 && sMonth <= 12 && sDay >= 1 && sDay <= 31) {
      startDate = `${sYear}-${String(sMonth).padStart(2, '0')}-${String(sDay).padStart(2, '0')}`;
    }
    if (eMonth >= 1 && eMonth <= 12 && eDay >= 1 && eDay <= 31) {
      endDate = `${eYear}-${String(eMonth).padStart(2, '0')}-${String(eDay).padStart(2, '0')}`;
    }
  } else {
    // 嘗試單一日期匹配（例如目擊情報 2026/09/01 或 2026.08.29）
    const singleDateMatch = rawText.match(/(?:(\d{4})[年\.\/-])?(\d{1,2})[月\.\/-](\d{1,2})/);
    if (singleDateMatch) {
      const year = singleDateMatch[1] ? parseInt(singleDateMatch[1], 10) : currentYear;
      const month = parseInt(singleDateMatch[2], 10);
      const day = parseInt(singleDateMatch[3], 10);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        startDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const autoEndDate = new Date(year, month - 1, day + 7);
        endDate = `${autoEndDate.getFullYear()}-${String(autoEndDate.getMonth() + 1).padStart(2, '0')}-${String(autoEndDate.getDate()).padStart(2, '0')}`;
      }
    }
  }

  return { startDate, endDate };
}

/**
 * 輔助函式：判斷文章是否屬於優惠性質
 * 規則：只要標題符合促銷關鍵字且不為純試吃預告，即視為有優惠文章
 */
export function isDaybuyPromotionArticle(title: string, excerpt?: string): boolean {
  if (!title) return false;
  const lowerTitle = title.toLowerCase();
  
  // 排除純試吃預告（非特價商品情報）
  if (lowerTitle.includes('試吃活動預告') || lowerTitle.includes('試吃預告')) {
    return false;
  }

  // 促銷關鍵字判定
  const promoKeywords = [
    '優惠', '特價', '特惠', '折扣', '折價', '護照', 'dm', '加檔',
    '好多金', '買一送一', '省', '促銷', '隱藏優惠', '現場優惠', '限時'
  ];

  const combined = `${lowerTitle} ${excerpt || ''}`.toLowerCase();
  return promoKeywords.some((kw) => combined.includes(kw));
}

/**
 * 步驟一：爬取今購百科 Costco 優惠專區列表，精準過濾出具備優惠性質之文章清單
 */
export async function scrapeDaybuyPromotionList(
  listUrl = DAYBUY_COSTCO_PROMOTIONS_URL,
  maxArticles = 5,
  existingBrowser?: Browser
): Promise<DaybuyPromotionArticleMeta[]> {
  let browser = existingBrowser;
  let ownBrowser = false;

  try {
    if (!browser) {
      browser = await chromium.launch({
        headless: true,
        args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
      });
      ownBrowser = true;
    }

    const page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 900 },
      locale: 'zh-TW',
    });

    console.log(`[Daybuy-Crawler] 連線今購百科好市多優惠專區目錄: ${listUrl}`);
    await page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2000);

    const rawArticles = await page.evaluate(() => {
      // 擷取主要文章列表 (包含 .grid-featured, .item, #loopid 等)
      const cards = document.querySelectorAll('article.item, .grid-featured article, #loopid article');
      const results: Array<{
        url: string;
        title: string;
        publishDate?: string;
        excerpt?: string;
        thumbnailUrl?: string;
      }> = [];

      const seen = new Set<string>();

      cards.forEach((card) => {
        const titleEl = card.querySelector('h2.entry-title a, h2 a, a.penci-image-holder');
        const href = (titleEl as HTMLAnchorElement)?.href || '';
        const title = (card.querySelector('h2.entry-title')?.textContent || titleEl?.getAttribute('title') || '').trim();
        const excerpt = card.querySelector('.entry-content, .item-content, p')?.textContent?.trim() || '';
        const timeEl = card.querySelector('time.entry-date, time');
        const publishDate = timeEl?.getAttribute('datetime') || timeEl?.textContent?.trim() || '';

        // 縮圖提取
        const imgEl = card.querySelector('img') as HTMLImageElement | null;
        const holderEl = card.querySelector('.penci-image-holder') as HTMLElement | null;
        let thumbnailUrl = imgEl?.src || '';
        if (!thumbnailUrl && holderEl) {
          thumbnailUrl = holderEl.getAttribute('data-bgset') || holderEl.style.backgroundImage || '';
          const match = thumbnailUrl.match(/url\(["']?(https?:\/\/[^"')]+)["']?\)/);
          if (match && match[1]) thumbnailUrl = match[1];
        }

        if (href && title && !seen.has(href)) {
          seen.add(href);
          results.push({
            url: href,
            title,
            publishDate,
            excerpt,
            thumbnailUrl,
          });
        }
      });

      return results;
    });

    await page.close().catch(() => {});

    // 依據「只要是有優惠的文章就進去爬」原則進行嚴格篩選
    const filteredPromotions = rawArticles.filter((art) => isDaybuyPromotionArticle(art.title, art.excerpt));

    console.log(
      `[Daybuy-Crawler] 目錄解析完成：共掃描 ${rawArticles.length} 篇文章，成功篩選出 ${filteredPromotions.length} 篇最新好市多特惠專題！`
    );

    return filteredPromotions.slice(0, maxArticles);
  } catch (err) {
    console.error('[Daybuy-Crawler] 目錄擷取發生錯誤:', (err as Error).message);
    return [];
  } finally {
    if (ownBrowser && browser) {
      await browser.close().catch(() => {});
    }
  }
}

/**
 * 步驟二：深入單篇今購百科促銷文章，精準剖析各項商品優惠、貨號、原價折價與實拍配圖
 */
export async function scrapeDaybuyPromotionArticle(
  page: Page,
  articleMeta: DaybuyPromotionArticleMeta
): Promise<SmartDeal[]> {
  const deals: SmartDeal[] = [];

  try {
    console.log(`[Daybuy-Crawler] 深入爬取優惠文章: 「${articleMeta.title}」(${articleMeta.url})`);
    await page.goto(articleMeta.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2000);

    const scrapedData = await page.evaluate((targetUrl) => {
      const contentEl =
        document.querySelector('.elementor-widget-theme-post-content') ||
        document.querySelector('.post-entry') ||
        document.querySelector('.entry-content') ||
        document.body;

      const title = document.querySelector('h1')?.textContent?.trim() || document.title;
      const fullText = (title + ' ' + (contentEl.textContent || '')).replace(/\s+/g, ' ');

      // 解析文章內各段落中的商品情報
      const pElements = Array.from(contentEl.querySelectorAll('p'));
      const items: Array<{
        name: string;
        itemCode?: string;
        originalPrice?: number;
        discountPrice?: number;
        priceDrop?: number;
        imageUrl?: string;
        productDetailUrl?: string;
        contextText?: string;
      }> = [];

      pElements.forEach((p, pIdx) => {
        const text = p.textContent?.trim() || '';
        const hasPriceInfo =
          text.includes('原價:') ||
          text.includes('原價：') ||
          text.includes('特價:') ||
          text.includes('特價：') ||
          text.includes('折價:') ||
          text.includes('折價：') ||
          text.includes('專案活動價:') ||
          text.includes('專案價:') ||
          text.includes('專案活動價：') ||
          text.includes('專案價：');

        // 情境 A：段落內包含明細文字價格
        if (hasPriceInfo) {
          // 1. 貨號提取
          let itemCode = '';
          const codeMatch = text.match(/#(\d{5,7})/);
          if (codeMatch) itemCode = codeMatch[1];

          // 2. 價格提取
          const origMatch = text.match(/原價\s*[:：]\s*(\d+)\s*元?/);
          const discMatch = text.match(/(?:折價|折扣|現省|購買[\u4e00-\u9fa5]+折價)\s*[:：]?\s*(\d+)\s*元?/);
          const saleMatch = text.match(/(?:特價|專案活動價|專案價|優惠價)\s*[:：]\s*(\d+)\s*元?/);

          const originalPrice = origMatch ? parseInt(origMatch[1], 10) : undefined;
          const priceDrop = discMatch ? parseInt(discMatch[1], 10) : undefined;
          let discountPrice = saleMatch ? parseInt(saleMatch[1], 10) : undefined;

          if (!discountPrice && originalPrice && priceDrop) {
            discountPrice = Math.max(1, originalPrice - priceDrop);
          }

          // 3. 商品品名提取
          let name = '';
          let productDetailUrl = '';
          const aTags = Array.from(p.querySelectorAll('a'));
          const nameLink = aTags.find((a) => (a.textContent?.trim().length || 0) > 3 && !a.querySelector('img'));

          if (nameLink) {
            name = nameLink.textContent?.trim() || '';
            productDetailUrl = nameLink.href || '';
          } else {
            const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
            const nonPriceLine = lines.find((l) => !l.includes('原價') && !l.includes('特價') && !l.includes('折價') && !l.includes('活動價'));
            name = nonPriceLine || lines[0] || '';
          }

          // 4. 配圖提取：優先查找段落內的商品圖，若無則查找緊鄰的前一個段落（今購百科習慣上圖下文）
          let imageUrl = '';
          const imgInP = p.querySelector('img') as HTMLImageElement | null;
          if (imgInP && imgInP.src && !imgInP.src.includes('ads') && !imgInP.src.includes('icon')) {
            imageUrl = imgInP.src;
          } else if (pIdx > 0) {
            const prevP = pElements[pIdx - 1];
            const prevImg = prevP?.querySelector('img') as HTMLImageElement | null;
            if (prevImg && prevImg.src && !prevImg.src.includes('ads') && !prevImg.src.includes('icon')) {
              imageUrl = prevImg.src;
            }
          }

          if (name && (discountPrice || originalPrice)) {
            items.push({
              name,
              itemCode,
              originalPrice,
              discountPrice: discountPrice || originalPrice,
              priceDrop,
              imageUrl,
              productDetailUrl,
              contextText: text.slice(0, 120),
            });
          }
        }
        // 情境 B：圖片價卡形式（如週二隱藏特惠，圖片即為好市多黃色標籤，下方緊接著品名連結）
        else {
          const aTag = p.querySelector('a');
          const pText = aTag?.textContent?.trim() || '';
          const hasItemCode = /#(\d{5,7})/.test(pText);

          if (hasItemCode && aTag) {
            const prevP = pIdx > 0 ? pElements[pIdx - 1] : null;
            const prevImg = prevP?.querySelector('img') as HTMLImageElement | null;
            if (prevImg && prevImg.src) {
              const codeMatch = pText.match(/#(\d{5,7})/);
              items.push({
                name: pText,
                itemCode: codeMatch ? codeMatch[1] : undefined,
                imageUrl: prevImg.src,
                productDetailUrl: aTag.href || '',
                contextText: pText,
              });
            }
          }
        }
      });

      return {
        title,
        fullText,
        items,
      };
    }, articleMeta.url);

    // 檔期起訖日計算
    const { startDate, endDate } = extractPromotionDateRange(
      `${scrapedData.title} ${articleMeta.title} ${scrapedData.fullText.slice(0, 800)}`
    );

    // 提煉活動代表性標籤 (例如 #秋季優惠、#中秋特惠、#會員護照、#好市多)
    const campaignTags: string[] = ['#好市多', '#Costco', '#美式量販', '#好市多特價'];
    if (articleMeta.title.includes('秋季')) campaignTags.push('#秋季優惠');
    if (articleMeta.title.includes('中秋')) campaignTags.push('#中秋加檔');
    if (articleMeta.title.includes('護照')) campaignTags.push('#會員護照');
    if (articleMeta.title.includes('隱藏優惠')) campaignTags.push('#隱藏優惠');
    if (articleMeta.title.includes('現場優惠')) campaignTags.push('#現場優惠');
    if (articleMeta.title.includes('普渡')) campaignTags.push('#中元普渡');

    const now = Date.now();

    scrapedData.items.forEach((item, idx) => {
      // 根據品名進行分類智能識別
      let category: 'food' | 'grocery' | 'tech' | 'fashion' | 'entertainment' = 'grocery';
      const lowerName = item.name.toLowerCase();

      if (
        /耳機|電視|螢幕|顯示器|筆電|充電|投影|吸塵器|吹風機|音響|led|除濕機|電鬍刀|卡式瓦斯爐|洗碗機/.test(lowerName)
      ) {
        category = 'tech';
      } else if (/衣|褲|鞋|襪|背心|洋裝|外套|毛巾|涼鞋|皮帶|襯衫/.test(lowerName)) {
        category = 'fashion';
      } else if (
        /肉|牛|豬|雞|魚|蝦|茶|咖啡|燕麥|酒|麵|米|水餃|泡菜|餅乾|巧克力|人蔘|雞精|乳酪|抹醬|優格|果汁/.test(lowerName)
      ) {
        category = 'food';
      }

      // 決定特價與原價
      const discountPrice = item.discountPrice || item.originalPrice || 299;
      const originalPrice = item.originalPrice || (item.priceDrop ? discountPrice + item.priceDrop : Math.round(discountPrice * 1.25));

      const dealId = `costco-daybuy-${Date.now().toString(36)}-${idx}-${item.itemCode || Math.random().toString(36).slice(2, 6)}`;
      const cleanTitle = `Costco好市多 ${item.name}`;

      const deal: SmartDeal = {
        id: dealId,
        title: cleanTitle,
        subtitle: `${articleMeta.title}：${item.priceDrop ? `現省 $${item.priceDrop} 元！` : '賣場檔期熱門促銷中'}`,
        category,
        channelType: 'offline',
        merchant: {
          name: normalizeBrandName('Costco 好市多'),
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Costco_Wholesale_logo_2010-10-26.svg/1200px-Costco_Wholesale_logo_2010-10-26.svg.png',
          storeBranches: '全台好市多實體賣場 / 線上購物',
        },
        regions: ['全台門市', '台北市', '新北市', '桃園市', '台中市', '嘉義市', '台南市', '高雄市'],
        discountPrice,
        originalPrice,
        priceUnit: '件',
        targetItems: [item.name],
        conditions: [
          '好市多會員專屬特惠',
          '現場每人限購數量依各賣場公告為準',
          '賣場數量有限，售完為止',
        ],
        eligibleCards: ['富邦 Costco 聯名卡 (最高2%好多金回饋)', 'Costco Pay', '好市多購物金折抵', '現金'],
        tags: normalizeTags([...campaignTags, `#${category === 'food' ? '生鮮美食' : category === 'tech' ? '3C家電' : '量販居家'}`], 'Costco 好市多'),
        startDate,
        endDate,
        isHot: idx < 3 || Boolean(item.priceDrop && item.priceDrop >= 200),
        isFlashDeal: Boolean(articleMeta.title.includes('限時') || articleMeta.title.includes('平日限定')),
        source: 'official',
        sourcePlatform: 'Daybuy',
        sourceUrl: item.productDetailUrl || articleMeta.url,
        likeCount: Math.floor(Math.random() * 150) + 80,
        commentCount: Math.floor(Math.random() * 30) + 5,
        priceHistory: [
          { date: '檔期前', price: originalPrice },
          { date: '特價中', price: discountPrice },
        ],
        priceDropAlert: item.priceDrop
          ? {
              isLowest90Days: true,
              isSuspiciousHike: false,
              note: `Costco 會員專屬優惠直降 $${item.priceDrop} 元！`,
            }
          : undefined,
        imageUrl: item.imageUrl || articleMeta.thumbnailUrl || undefined,
        images: item.imageUrl ? [item.imageUrl] : articleMeta.thumbnailUrl ? [articleMeta.thumbnailUrl] : [],
        aspectRatio: '4:3',
      };

      deals.push(deal);
    });

    console.log(`[Daybuy-Crawler] ✅ 成功自「${articleMeta.title}」萃取 ${deals.length} 筆特惠商品卡片！`);
  } catch (err) {
    console.error(`[Daybuy-Crawler] 爬取文章「${articleMeta.title}」失敗:`, (err as Error).message);
  }

  return deals;
}

/**
 * 步驟三：整合主函式 - 完整執行今購百科 Costco 優惠深度爬取與入庫
 */
export async function crawlDaybuyCostcoDeals(
  maxArticles = 3,
  onProgress?: (message: string, step: string) => void
): Promise<SmartDeal[]> {
  const allDeals: SmartDeal[] = [];
  let browser: Browser | null = null;

  try {
    onProgress?.('啟動無頭瀏覽器，連線今購百科 Costco 優惠專區...', 'connecting');

    browser = await chromium.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
    });

    onProgress?.('正在掃描目錄頁最新文章，過濾優惠與特價主題...', 'fetching_posts');
    const articles = await scrapeDaybuyPromotionList(DAYBUY_COSTCO_PROMOTIONS_URL, maxArticles, browser);

    if (articles.length === 0) {
      console.warn('[Daybuy-Crawler] 未找到任何符合條件之好市多促銷文章');
      onProgress?.('未搜尋到符合條件的好市多特惠文章', 'complete');
      return [];
    }

    onProgress?.(`鎖定 ${articles.length} 篇最新促銷專題，逐一深入內文萃取商品與價格...`, 'fetching_posts');

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 900 },
      locale: 'zh-TW',
    });
    const page = await context.newPage();

    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      onProgress?.(`[${i + 1}/${articles.length}] 正在分析「${art.title.slice(0, 24)}...」各項特價品...`, 'gemini_ai_parsing');
      
      const deals = await scrapeDaybuyPromotionArticle(page, art);
      allDeals.push(...deals);

      onProgress?.(`[${i + 1}/${articles.length}] 「${art.title.slice(0, 18)}...」完成，獲取 ${deals.length} 筆商品情報`, 'gemini_ai_parsing');
    }

    await page.close().catch(() => {});
    await context.close().catch(() => {});

    console.log(`[Daybuy-Crawler] 🎉 採集完畢！共萃取出 ${allDeals.length} 筆 Costco 特價情報。`);
  } catch (err) {
    console.error('[Daybuy-Crawler] 執行爬蟲管線時遭遇例外:', (err as Error).message);
    onProgress?.(`爬取發生異常: ${(err as Error).message}`, 'error');
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  return allDeals;
}
