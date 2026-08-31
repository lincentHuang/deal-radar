import 'server-only';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { chromium } from 'playwright';
import { isCurrentMonthOrRecent, parseDealsWithGemini, RawCrawledPost } from './gemini-parser.service';
import { upsertCrawledDeals } from './deals-dal';
import { crawlAllOfficialWebTargets } from './official-web-crawler.service';

export interface CrawlTarget {
  id: string;
  name: string;
  url: string;
  logo: string;
  defaultCategory: 'food' | 'grocery';
}

export const CRAWL_TARGETS: CrawlTarget[] = [
  // 超商與超市通路
  {
    id: '7eleven',
    name: '7-ELEVEN',
    url: 'https://www.facebook.com/711open',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg',
    defaultCategory: 'food',
  },
  {
    id: 'familymart',
    name: '全家 FamilyMart',
    url: 'https://www.facebook.com/FamilyMart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'famiport',
    name: '全家 FamiPort',
    url: 'https://www.facebook.com/FamiPortTW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'hilife',
    name: '萊爾富 Hi-Life',
    url: 'https://www.facebook.com/hihilife',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'okmart',
    name: 'OK超商 OKmart',
    url: 'https://www.facebook.com/okmart.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'pxmart',
    name: '全聯福利中心',
    url: 'https://www.facebook.com/pxmartchannel',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'simplemart',
    name: '美廉社 Simple Mart',
    url: 'https://www.facebook.com/simplemart1',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png',
    defaultCategory: 'grocery',
  },
  // 美式量販賣場
  {
    id: 'costco',
    name: 'Costco 好市多特價情報',
    url: 'https://www.facebook.com/DAYBUY.TW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Costco_Wholesale_logo_2010-10-26.svg/1200px-Costco_Wholesale_logo_2010-10-26.svg.png',
    defaultCategory: 'grocery',
  },
  // 連鎖咖啡與速食餐飲
  {
    id: 'starbucks',
    name: '星巴克 Starbucks',
    url: 'https://www.facebook.com/starbuckstaiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'mcdonalds',
    name: '麥當勞 McDonald\'s',
    url: 'https://www.facebook.com/mcdonalds.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'kfc',
    name: '肯德基 KFC',
    url: 'https://www.facebook.com/kfctaiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png',
    defaultCategory: 'food',
  },
  // 人氣連鎖手搖飲
  {
    id: 'milksha',
    name: '迷客夏 Milksha',
    url: 'https://www.facebook.com/MilkshaTW',
    logo: 'https://www.milksha.com/front/img/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'macu',
    name: '麻古茶坊 MACU',
    url: 'https://www.facebook.com/macu2008.tw',
    logo: 'https://macutea.com.tw/wp-content/themes/macu/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'kebuke',
    name: '可不可熟成紅茶 KEBUKE',
    url: 'https://www.facebook.com/kebuke2008',
    logo: 'https://www.kebuke.com/wp-content/themes/kebuke/images/logo.png',
    defaultCategory: 'food',
  },
];

/**
 * 執行即時目標爬蟲（支援 Facebook 粉專與官方活動網頁，整合 Gemini AI 多模態解析）
 */
export async function crawlLiveTargets(targetsToCrawl?: CrawlTarget[]): Promise<SmartDeal[]> {
  const targets = (targetsToCrawl && targetsToCrawl.length > 0) ? targetsToCrawl : CRAWL_TARGETS;
  const extractedDeals: SmartDeal[] = [];
  let browser;

  try {
    console.log(`[Live-Crawler] Launching Playwright Chromium for ${targets.length} live target(s)...`);
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 900 },
      locale: 'zh-TW',
    });

    const page = await context.newPage();

    for (const target of targets) {
      try {
        console.log(`[Live-Crawler] Scraping live target: ${target.name} (${target.url})...`);

        // Case 1: Facebook 官方粉絲專頁
        if (target.url.includes('facebook.com')) {
          await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
          await page.waitForTimeout(2500);

          // 關閉登入彈窗
          try {
            const closeBtn = await page.$(
              'div[aria-label="關閉"], div[aria-label="Close"], [role="button"]:has-text("稍後再說"), [role="button"]:has-text("Not Now"), div[aria-label="隱藏"]'
            );
            if (closeBtn) {
              await closeBtn.click();
              await page.waitForTimeout(800);
            }
          } catch {}

          // 展開「查看更多」按鈕
          try {
            const seeMoreBtns = await page.$$(
              'div[role="button"]:has-text("查看更多"), span:has-text("查看更多")'
            );
            for (const btn of seeMoreBtns.slice(0, 5)) {
              await btn.click().catch(() => {});
            }
            await page.waitForTimeout(800);
          } catch {}

          // 微滾動加載更多內容
          await page.evaluate(() => window.scrollBy(0, 800));
          await page.waitForTimeout(1500);

          // 提取 DOM
          const rawPosts = await page.evaluate((targetInfo) => {
            const results: Array<{ text: string; images: string[]; link: string }> = [];
            const articles = document.querySelectorAll('div[role="article"]');

            articles.forEach((art, idx) => {
              if (idx >= 6) return;
              const text = (art as HTMLElement).innerText || art.textContent || '';
              if (text.length < 15) return;

              const images = Array.from(art.querySelectorAll('img'))
                .map((img) => img.src)
                .filter(
                  (src) =>
                    src &&
                    !src.includes('rsrc.php') &&
                    !src.includes('emoji') &&
                    !src.includes('data:image')
                );

              const links = Array.from(art.querySelectorAll('a'))
                .map((a) => a.href)
                .filter(
                  (href) =>
                    href &&
                    (href.includes('/posts/') ||
                      href.includes('story.php') ||
                      href.includes('fbid=') ||
                      href.includes('/photo'))
                );

              const cleanedText = text
                .replace(/所有心情：[\s\S]*$/g, '')
                .replace(/讚\s*留言\s*分享[\s\S]*/g, '')
                .replace(/查看更多/g, '')
                .trim();

              results.push({
                text: cleanedText,
                images: Array.from(new Set(images)),
                link: links[0] || targetInfo.url,
              });
            });

            return results;
          }, target);

          console.log(`[Live-Crawler] Found ${rawPosts.length} real posts from ${target.name}.`);

          for (const raw of rawPosts) {
            const rawPostInput: RawCrawledPost = {
              merchantId: target.id,
              merchantName: target.name,
              merchantLogo: target.logo,
              text: raw.text,
              images: raw.images,
              link: raw.link,
            };

            const structuredDeals = await parseDealsWithGemini(rawPostInput);
            if (structuredDeals && structuredDeals.length > 0) {
              extractedDeals.push(...structuredDeals);
            }
          }
        } 
        // Case 2: 官方主題活動網頁 (如全家 Let's Cafe, 7-11 專題等)
        else {
          await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
          await page.waitForTimeout(2000);

          const webItems = await page.evaluate((baseUrl) => {
            const results: Array<{ title: string; desc: string; imgUrl: string; link: string }> = [];

            // 1. 全家專題
            const famiCards = document.querySelectorAll('.news .news__inner, .event-card, .activity-item, .card');
            if (famiCards.length > 0) {
              famiCards.forEach((card) => {
                const title = card.querySelector('.news__title, h2, h3, h4, .title')?.textContent?.trim() || '';
                const desc = card.querySelector('.news__desc, p, .desc')?.textContent?.trim() || '';
                const imgEl = card.querySelector('img') as HTMLImageElement | null;
                let imgUrl = imgEl?.src || '';
                if (imgUrl && !imgUrl.startsWith('http')) {
                  imgUrl = new URL(imgUrl, baseUrl).href;
                }
                if (title || desc) {
                  results.push({ title, desc, imgUrl, link: baseUrl });
                }
              });
            } else {
              // 通用活動頁擷取
              const links = document.querySelectorAll('a');
              links.forEach((a) => {
                const img = a.querySelector('img');
                const text = a.innerText?.trim() || '';
                if (img && img.src && text.length > 5) {
                  results.push({
                    title: text.split('\n')[0],
                    desc: text.replace(/\n+/g, ' '),
                    imgUrl: img.src,
                    link: a.href || baseUrl,
                  });
                }
              });
            }

            return results;
          }, target.url);

          console.log(`[Live-Crawler] Scraped ${webItems.length} items from official webpage: ${target.name}`);

          for (const item of webItems.slice(0, 6)) {
            const rawPostInput: RawCrawledPost = {
              merchantId: target.id,
              merchantName: target.name,
              merchantLogo: target.logo,
              text: `${item.title}\n${item.desc}`,
              images: item.imgUrl ? [item.imgUrl] : [],
              link: item.link || target.url,
            };

            const structuredDeals = await parseDealsWithGemini(rawPostInput);
            if (structuredDeals && structuredDeals.length > 0) {
              extractedDeals.push(...structuredDeals);
            }
          }
        }
      } catch (targetErr) {
        console.error(`[Live-Crawler] Error scraping target ${target.name}:`, (targetErr as Error).message);
      }
    }
  } catch (err) {
    console.error('[Live-Crawler] Playwright browser error:', (err as Error).message);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  return extractedDeals;
}

/**
 * 相容舊介面
 */
export async function crawlFacebookDeals(): Promise<SmartDeal[]> {
  return crawlLiveTargets();
}

/**
 * 異步執行爬蟲並直接更新資料庫 (不阻塞呼叫者)
 */
export function triggerAsyncCrawlerJob(): void {
  console.log('[Crawler] Asynchronously triggering crawler in background...');
  
  setImmediate(async () => {
    try {
      const deals = await crawlLiveTargets();
      if (deals.length > 0) {
        const result = await upsertCrawledDeals(deals);
        console.log(`[Crawler Background Worker] Finished! Ingested ${result.insertedCount} real deals, total database: ${result.totalCount}`);
      }
    } catch (err) {
      console.error('[Crawler Background Worker] Async job error:', (err as Error).message);
    }
  });
}
