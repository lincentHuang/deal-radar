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
 * 執行 FB 官方粉絲專頁爬蟲並整合 Gemini AI 解析
 */
export async function crawlFacebookDeals(): Promise<SmartDeal[]> {
  const extractedDeals: SmartDeal[] = [];
  let browser;

  try {
    console.log('[FB-Crawler] Starting Playwright Chromium for FB crawl...');
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

    for (const target of CRAWL_TARGETS) {
      try {
        console.log(`[FB-Crawler] Scraping: ${target.name} (${target.url})...`);
        await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
        await page.waitForTimeout(3000);

        // 關閉登入彈窗
        try {
          const closeBtn = await page.$(
            'div[aria-label="關閉"], div[aria-label="Close"], [role="button"]:has-text("稍後再說"), [role="button"]:has-text("Not Now"), div[aria-label="隱藏"]'
          );
          if (closeBtn) {
            await closeBtn.click();
            await page.waitForTimeout(1000);
          }
        } catch {}

        // 展開「查看更多」按鈕
        try {
          const seeMoreBtns = await page.$$(
            'div[role="button"]:has-text("查看更多"), span:has-text("查看更多")'
          );
          for (const btn of seeMoreBtns.slice(0, 8)) {
            await btn.click().catch(() => {});
          }
          await page.waitForTimeout(1200);
        } catch {}

        // 微滾動加載更多內容
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(2000);

        // 提取 DOM
        const rawPosts = await page.evaluate((targetInfo) => {
          const results: Array<{ text: string; images: string[]; link: string }> = [];
          const articles = document.querySelectorAll('div[role="article"]');

          articles.forEach((art, idx) => {
            if (idx >= 8) return;
            const text = (art as HTMLElement).innerText || art.textContent || '';
            if (text.length < 25) return;

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
                    href.includes('fbid='))
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

        console.log(`[FB-Crawler] Found ${rawPosts.length} posts from ${target.name}. Filtering current month and running Gemini AI parser...`);

        // 僅保留「當月份 / 最新」之文章，並使用 Gemini AI 萃取
        for (const raw of rawPosts) {
          if (!isCurrentMonthOrRecent(raw.text)) {
            console.log(`[FB-Crawler] Skipping older/out-of-month post: ${raw.text.slice(0, 30)}...`);
            continue;
          }

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

      } catch (targetErr) {
        console.error(`[FB-Crawler] Error crawling ${target.name}:`, (targetErr as Error).message);
      }
    }
  } catch (err) {
    console.error('[FB-Crawler] Critical browser error:', (err as Error).message);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  return extractedDeals;
}

/**
 * 異步執行爬蟲並直接更新資料庫 (不阻塞呼叫者)
 */
export function triggerAsyncCrawlerJob(): void {
  console.log('[Crawler] Asynchronously triggering crawler in background...');
  
  // 非同步執行
  setImmediate(async () => {
    try {
      // 1. FB 粉專爬取 (7-11, 全家, FamiPort)
      const deals = await crawlFacebookDeals();
      if (deals.length > 0) {
        const result = await upsertCrawledDeals(deals);
        console.log(`[FB-Crawler Background Worker] Finished! Ingested ${result.insertedCount} new deals, total database: ${result.totalCount}`);
      }

      // 2. 官方網站專題活動爬取 (Let's Café 官方專題頁)
      const webDeals = await crawlAllOfficialWebTargets();
      console.log(`[Official-Web-Crawler] Ingested ${webDeals.length} official web deals.`);
    } catch (err) {
      console.error('[Crawler Background Worker] Async job error:', (err as Error).message);
    }
  });
}
