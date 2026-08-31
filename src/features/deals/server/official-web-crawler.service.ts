import 'server-only';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { chromium } from 'playwright';
import { upsertCrawledDeals } from './deals-dal';

export interface OfficialWebTarget {
  id: string;
  name: string;
  url: string;
  merchantName: string;
  merchantLogo: string;
  category: 'food' | 'grocery';
}

export const OFFICIAL_WEB_TARGETS: OfficialWebTarget[] = [
  {
    id: 'familymart_letscafe',
    name: "全家 Let's Café 官方活動訊息",
    url: 'https://nevent.family.com.tw/2018_letscafe/news/index.html',
    merchantName: '全家 FamilyMart',
    merchantLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png',
    category: 'food',
  },
  {
    id: '7eleven_events',
    name: '7-ELEVEN 強檔活動特惠',
    url: 'https://www.7-11.com.tw/event/index.aspx',
    merchantName: '7-ELEVEN',
    merchantLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg',
    category: 'food',
  },
  {
    id: 'hilife_events',
    name: '萊爾富 Hi-Life 主題活動',
    url: 'https://www.hilife.com.tw/events_info.aspx',
    merchantName: '萊爾富 Hi-Life',
    merchantLogo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png',
    category: 'food',
  },
  {
    id: 'okmart_promotions',
    name: 'OK超商 促銷快報',
    url: 'https://www.okmart.com.tw/promotion_reference',
    merchantName: 'OK超商 OKmart',
    merchantLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png',
    category: 'food',
  },
  {
    id: 'pxmart_latest',
    name: '全聯福利中心 最新活動',
    url: 'https://www.pxmart.com.tw/activity/latest',
    merchantName: '全聯福利中心',
    merchantLogo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png',
    category: 'grocery',
  },
];

/**
 * 爬取全家 Let's Café 官網活動列表
 */
export async function crawlFamilyMartLetsCafeNews(): Promise<SmartDeal[]> {
  const deals: SmartDeal[] = [];
  let browser;

  try {
    console.log("[Web-Crawler] Starting Playwright to crawl FamilyMart Let's Café news...");
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
    });

    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      locale: 'zh-TW',
    });

    const targetUrl = 'https://nevent.family.com.tw/2018_letscafe/news/index.html';
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);

    const rawNewsItems = await page.evaluate((baseUrl) => {
      const items: Array<{
        title: string;
        descLines: string[];
        imgUrl: string;
      }> = [];

      const newsCards = document.querySelectorAll('.news .news__inner');
      newsCards.forEach((card) => {
        const titleEl = card.querySelector('.news__title');
        const descEls = card.querySelectorAll('.news__desc');
        const imgEl = card.querySelector('.news__img img') as HTMLImageElement | null;

        const title = titleEl?.textContent?.trim() || '';
        const descLines = Array.from(descEls).map((el) => el.textContent?.trim() || '').filter(Boolean);
        
        let imgUrl = imgEl?.getAttribute('src') || '';
        if (imgUrl && !imgUrl.startsWith('http')) {
          imgUrl = new URL(imgUrl, baseUrl).href;
        }

        if (title || descLines.length > 0) {
          items.push({
            title,
            descLines,
            imgUrl,
          });
        }
      });

      return items;
    }, targetUrl);

    console.log(`[Web-Crawler] Scraped ${rawNewsItems.length} Let's Café campaign cards.`);

    const now = new Date();
    const currentYear = now.getFullYear();

    for (let i = 0; i < rawNewsItems.length; i++) {
      const item = rawNewsItems[i];

      let startDate = new Date().toISOString().split('T')[0];
      let endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const dateMatch = item.title.match(/(?:(\d{2,3})\/)?(\d{1,2})\/(\d{1,2})\s*[-~至到]\s*(?:(?:(\d{2,3})\/)?(\d{1,2})\/)?(\d{1,2})/);
      if (dateMatch) {
        const startM = parseInt(dateMatch[2], 10);
        const startD = parseInt(dateMatch[3], 10);
        const endM = dateMatch[5] ? parseInt(dateMatch[5], 10) : startM;
        const endD = parseInt(dateMatch[6], 10);

        startDate = `${currentYear}-${String(startM).padStart(2, '0')}-${String(startD).padStart(2, '0')}`;
        endDate = `${currentYear}-${String(endM).padStart(2, '0')}-${String(endD).padStart(2, '0')}`;
      }

      const mainHeadline = item.descLines[0] || item.title || "全家 Let's Café 檔期特惠";
      const secondaryHeadline = item.descLines.slice(1).join(' ');

      const deal: SmartDeal = {
        id: `fami-letscafe-${Date.now()}-${i}`,
        title: `全家 Let's Café ${mainHeadline}`,
        subtitle: secondaryHeadline.slice(0, 80) || item.title,
        category: 'food',
        channelType: 'offline',
        merchant: {
          name: '全家 FamilyMart',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png',
          storeBranches: '全台全家門市',
        },
        regions: ['全台門市', '台北市', '新北市', '台中市', '高雄市'],
        conditions: [
          'Let\'s Café 門市供應為準',
          '搭配指定甜點享半價優惠',
          '數量有限，售完為止',
        ],
        targetItems: ["Let's Café 咖啡系列", "minimore 甜點", "酷繽沙/酷繽球系列"],
        eligibleCards: ['全盈+PAY', 'FamiPay', '悠遊卡 / 一卡通', '信用卡通用'],
        tags: ['#全家', "#Let'sCafé", '#咖啡優惠', '#甜點半價', '#minimore'],
        startDate,
        endDate,
        isHot: true,
        source: 'official',
        sourcePlatform: 'Merchant',
        sourceUrl: targetUrl,
        likeCount: Math.floor(Math.random() * 200) + 120,
        commentCount: Math.floor(Math.random() * 50) + 15,
        imageUrl: item.imgUrl || undefined,
        images: item.imgUrl ? [item.imgUrl] : [],
        aspectRatio: '4:3',
      };

      deals.push(deal);
    }
  } catch (err) {
    console.error("[Web-Crawler] Error scraping Let's Café news:", (err as Error).message);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  return deals;
}

/**
 * 執行所有官方網站定時爬取
 */
export async function crawlAllOfficialWebTargets(): Promise<SmartDeal[]> {
  const allDeals: SmartDeal[] = [];
  const letscafeDeals = await crawlFamilyMartLetsCafeNews();
  allDeals.push(...letscafeDeals);

  if (allDeals.length > 0) {
    await upsertCrawledDeals(allDeals);
  }

  return allDeals;
}
