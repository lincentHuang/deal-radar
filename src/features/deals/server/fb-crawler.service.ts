import 'server-only';
import fs from 'fs';
import path from 'path';
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
  defaultCategory: 'food' | 'grocery' | 'tech' | 'fashion' | 'entertainment' | 'travel';
}

export const CRAWL_TARGETS: CrawlTarget[] = [
  // 1. 超商通路
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
  // 2. 超市與量販賣場
  {
    id: 'pxmart',
    name: '全聯福利中心',
    url: 'https://www.facebook.com/pxmartchannel',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'carrefour',
    name: '家樂福 Carrefour Taiwan',
    url: 'https://www.facebook.com/carrefour.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Carrefour_logo.svg/1024px-Carrefour_logo.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'costco',
    name: 'Costco 好市多特價情報',
    url: 'https://www.facebook.com/DAYBUY.TW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Costco_Wholesale_logo_2010-10-26.svg/1200px-Costco_Wholesale_logo_2010-10-26.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'rtmart',
    name: '大潤發 RT-MART',
    url: 'https://www.facebook.com/rtmart.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/d/d3/RT-Mart_logo.svg/1200px-RT-Mart_logo.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'amart',
    name: '愛買 a.mart',
    url: 'https://www.facebook.com/amart.tw',
    logo: 'https://www.fe-amart.com.tw/images/logo.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'simplemart',
    name: '美廉社 Simple Mart',
    url: 'https://www.facebook.com/simplemart1',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png',
    defaultCategory: 'grocery',
  },
  // 3. 藥妝與生活百貨
  {
    id: 'watsons',
    name: '屈臣氏 Watsons',
    url: 'https://www.facebook.com/WatsonsTaiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Watsons_logo.svg/1200px-Watsons_logo.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'cosmed',
    name: '康是美 COSMED',
    url: 'https://www.facebook.com/cosmedtw',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/3/3b/COSMED_logo.svg/1200px-COSMED_logo.svg.png',
    defaultCategory: 'grocery',
  },
  {
    id: 'poya',
    name: '寶雅 POYA',
    url: 'https://www.facebook.com/poyatw',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/9/91/POYA_logo.svg/1200px-POYA_logo.svg.png',
    defaultCategory: 'fashion',
  },
  {
    id: 'muji',
    name: '無印良品 MUJI Taiwan',
    url: 'https://www.facebook.com/MUJI.view.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Muji_logo.svg/1200px-Muji_logo.svg.png',
    defaultCategory: 'fashion',
  },
  {
    id: 'showba',
    name: '小北百貨 SHOWBA',
    url: 'https://www.facebook.com/showba',
    logo: 'https://www.showba.com.tw/images/logo.png',
    defaultCategory: 'grocery',
  },
  // 4. 連鎖速食與披薩
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
  {
    id: 'mosburger',
    name: '摩斯漢堡 MOS Burger',
    url: 'https://www.facebook.com/mosburger.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/MOS_Burger_logo.svg/1200px-MOS_Burger_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'burgerking',
    name: '漢堡王 Burger King',
    url: 'https://www.facebook.com/BurgerKingTW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/1024px-Burger_King_logo_%281999%29.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'pizzahut',
    name: '必勝客 Pizza Hut',
    url: 'https://www.facebook.com/PizzaHut.TW',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Pizza_Hut_logo_%282014%29.svg/1200px-Pizza_Hut_logo_%282014%29.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'dominos',
    name: '達美樂 Domino\'s Pizza',
    url: 'https://www.facebook.com/Dominos.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dominos_pizza_logo.svg/1200px-Dominos_pizza_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'napoli',
    name: '拿坡里披薩·炸雞 Napoli',
    url: 'https://www.facebook.com/0800076666.tw',
    logo: 'https://www.0800076666.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'tkk',
    name: '頂呱呱 TKK Taiwan',
    url: 'https://www.facebook.com/tkkfans',
    logo: 'https://www.tkkinc.com.tw/upload/system/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'subway',
    name: 'Subway Taiwan',
    url: 'https://www.facebook.com/subwaytw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subway_2016_logo.svg/1200px-Subway_2016_logo.svg.png',
    defaultCategory: 'food',
  },
  // 5. 知名連鎖餐飲與鍋物壽司
  {
    id: 'sushiexpress',
    name: '爭鮮迴轉壽司',
    url: 'https://www.facebook.com/sushiexpress.tw',
    logo: 'https://www.sushiexpress.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'sushiro',
    name: '壽司郎 Sushiro Taiwan',
    url: 'https://www.facebook.com/Sushiro.TW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Akindo_Sushiro_logo.svg/1200px-Akindo_Sushiro_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'kurasushi',
    name: '藏壽司 Kura Sushi',
    url: 'https://www.facebook.com/kurasushi.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Kura_Sushi_logo.svg/1200px-Kura_Sushi_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'wanggroup',
    name: '王品集團 / 王品瘋美食',
    url: 'https://www.facebook.com/wanggroup.brand',
    logo: 'https://www.wowprime.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'thaitown',
    name: '瓦城泰國料理 Thai Town',
    url: 'https://www.facebook.com/thaitowncuisine',
    logo: 'https://www.thaitown.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'bafang',
    name: '八方雲集',
    url: 'https://www.facebook.com/bafangyunji.tw',
    logo: 'https://www.8way.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'liangshehan',
    name: '梁社漢排骨',
    url: 'https://www.facebook.com/liangshehan',
    logo: 'https://www.liangshehan.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: '3sfans',
    name: '三商巧福 3Sfans',
    url: 'https://www.facebook.com/3sfans',
    logo: 'https://www.3375.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  // 6. 連鎖咖啡與人氣手搖茶飲
  {
    id: 'starbucks',
    name: '星巴克 Starbucks',
    url: 'https://www.facebook.com/starbuckstaiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'louisa',
    name: '路易莎咖啡 Louisa Coffee',
    url: 'https://www.facebook.com/louisacoffeeofficial',
    logo: 'https://www.louisacoffee.co/upload/header_logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'cama',
    name: 'cama café',
    url: 'https://www.facebook.com/camacafe.tw',
    logo: 'https://www.camacafe.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: '85cafe',
    name: '85度C',
    url: 'https://www.facebook.com/85cafe',
    logo: 'https://www.85cafe.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: '50lan',
    name: '50嵐',
    url: 'https://www.facebook.com/50lan.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/50_Lan_tea_shop_logo.svg/1200px-50_Lan_tea_shop_logo.svg.png',
    defaultCategory: 'food',
  },
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
  {
    id: 'chingshin',
    name: '清心福全',
    url: 'https://www.facebook.com/chingshin1987',
    logo: 'https://www.chingshin.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'wootea',
    name: '五桐號 WooTEA',
    url: 'https://www.facebook.com/WooTeaTW',
    logo: 'https://www.wootea.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'dejeng',
    name: '得正 Oolong Tea',
    url: 'https://www.facebook.com/dejeng.oolongtea',
    logo: 'https://dejeng.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'wanpo',
    name: '萬波島嶼紅茶 Wanpo',
    url: 'https://www.facebook.com/wanpotea.tw',
    logo: 'https://wanpotea.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'truedan',
    name: '珍煮丹 TRUEDAN',
    url: 'https://www.facebook.com/truedantw',
    logo: 'https://www.truedan.com.tw/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'dayungs',
    name: '大苑子 DaYungs',
    url: 'https://www.facebook.com/dayungs.tw',
    logo: 'https://www.dayungs.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'guiji',
    name: '龜記茗品 Guiji',
    url: 'https://www.facebook.com/guijitea',
    logo: 'https://guiji-group.com/images/logo.png',
    defaultCategory: 'food',
  },
  {
    id: 'taotaotea',
    name: '先喝道 TaoTaoTea',
    url: 'https://www.facebook.com/taotaotea',
    logo: 'https://www.taotaotea.com/images/logo.png',
    defaultCategory: 'food',
  },
  // 7. 甜點與冰品
  {
    id: 'misterdonut',
    name: 'Mister Donut 統一多拿滋',
    url: 'https://www.facebook.com/Japan.misterdonut',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mister_Donut_logo.svg/1200px-Mister_Donut_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'coldstone',
    name: 'COLD STONE 酷聖石冰淇淋',
    url: 'https://www.facebook.com/ColdStone.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Cold_Stone_Creamery_logo.svg/1200px-Cold_Stone_Creamery_logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'haagendazs',
    name: 'Häagen-Dazs 哈根達斯',
    url: 'https://www.facebook.com/haagen.dazs.taiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Haagen-Dazs-Logo.svg/1200px-Haagen-Dazs-Logo.svg.png',
    defaultCategory: 'food',
  },
  {
    id: 'imei',
    name: '義美食品 I-MEI',
    url: 'https://www.facebook.com/imeifoods',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/4b/I-Mei_Foods_Logo.svg/1200px-I-Mei_Foods_Logo.svg.png',
    defaultCategory: 'food',
  },
  // 8. 服飾生活與 3C 數位
  {
    id: 'uniqlo',
    name: 'UNIQLO Taiwan',
    url: 'https://www.facebook.com/uniqlo.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1024px-UNIQLO_logo.svg.png',
    defaultCategory: 'fashion',
  },
  {
    id: 'gu',
    name: 'GU Taiwan',
    url: 'https://www.facebook.com/gu.taiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GU_logo.svg/1024px-GU_logo.svg.png',
    defaultCategory: 'fashion',
  },
  {
    id: 'tkec',
    name: '燦坤 3C',
    url: 'https://www.facebook.com/TKEC.tw',
    logo: 'https://www.tk3c.com/images/logo.png',
    defaultCategory: 'tech',
  },
  {
    id: 'elifemall',
    name: '全國電子',
    url: 'https://www.facebook.com/Elifemall.com.tw',
    logo: 'https://web.elifemall.com.tw/zh/images/logo.png',
    defaultCategory: 'tech',
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

    // 預先查詢資料庫中已存在的來源網址 (sourceUrl)，實現「先比對來源是否之前抓過，全新來源才調用 AI 解析」
    let existingSourceUrls = new Set<string>();
    try {
      const { prisma } = await import('@/shared/lib/prisma');
      const existingDeals = await prisma.deal.findMany({
        where: { sourceUrl: { not: null } },
        select: { sourceUrl: true },
      });
      existingSourceUrls = new Set(existingDeals.map((d) => d.sourceUrl!).filter(Boolean));
      console.log(`[Live-Crawler] 🗄️ Loaded ${existingSourceUrls.size} existing source URLs from database for pre-deduplication.`);
    } catch (e) {
      console.warn('[Live-Crawler] Could not pre-fetch sourceUrls from database, will proceed without cache pre-filter.');
    }

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

          // 多次滾動加載並點擊展開「查看更多」，確保抓到 24-48 小時內所有品牌主貼文
          for (let scrollIdx = 0; scrollIdx < 4; scrollIdx++) {
            try {
              const seeMoreBtns = await page.$$(
                'div[role="button"]:has-text("查看更多"), span:has-text("查看更多")'
              );
              for (const btn of seeMoreBtns.slice(0, 8)) {
                await btn.click().catch(() => {});
              }
            } catch {}

            await page.evaluate(() => window.scrollBy(0, 1200));
            await page.waitForTimeout(1500);
          }

          // 提取 DOM 主貼文（排除留言與無關元件）
          const rawPosts = await page.evaluate((targetInfo) => {
            const results: Array<{ 
              idx: number;
              text: string; 
              images: string[]; 
              hasVideo: boolean;
              videoPoster?: string;
              link: string;
            }> = [];
            const allArticles = Array.from(document.querySelectorAll('div[role="article"]'));

            // 僅保留頂層文章（排除巢狀在其他 article 內的留言區塊）
            const topLevelArticles = allArticles.filter((art) => {
              const parentArticle = art.parentElement?.closest('div[role="article"]');
              return !parentArticle;
            });

            topLevelArticles.forEach((art, idx) => {
              if (idx >= 15) return;
              
              // 標記自訂屬性以便後續 Playwright Node.js 精準抓取元素截圖
              art.setAttribute('data-deal-crawler-idx', String(idx));

              const text = (art as HTMLElement).innerText || art.textContent || '';
              if (text.length < 20) return;

              // 排除留言特徵
              if (text.match(/^[a-zA-Z0-9\u4e00-\u9fa5\s]+\s+\d+\s*(?:小時|分鐘|秒|天|hrs|mins|days)/) && text.length < 50) {
                return;
              }

              // 1. 提取一般圖片
              const images = Array.from(art.querySelectorAll('img'))
                .map((img) => img.src)
                .filter(
                  (src) =>
                    src &&
                    !src.includes('rsrc.php') &&
                    !src.includes('emoji') &&
                    !src.includes('data:image') &&
                    !src.includes('16x16') &&
                    !src.includes('32x32')
                );

              // 2. 偵測影片元素與 Poster 封面
              const videoEl = art.querySelector('video') as HTMLVideoElement | null;
              const hasVideo = !!videoEl || !!art.querySelector('div[data-pagelet*="Video"], [aria-label*="影片"], [aria-label*="video"], div[aria-label*="Reels"]');
              
              let videoPoster = '';
              if (videoEl) {
                videoPoster = videoEl.poster || videoEl.getAttribute('poster') || '';
              }
              if (!videoPoster) {
                // 嘗試從 background-image 尋找影片縮圖
                const bgEls = Array.from(art.querySelectorAll('[style*="background-image"]'));
                for (const el of bgEls) {
                  const bgStyle = (el as HTMLElement).style.backgroundImage;
                  const match = bgStyle.match(/url\(["']?(https?:\/\/[^"')]+)["']?\)/);
                  if (match && match[1] && !match[1].includes('rsrc.php') && !match[1].includes('data:image')) {
                    videoPoster = match[1];
                    break;
                  }
                }
              }

              const links = Array.from(art.querySelectorAll('a'))
                .map((a) => a.href)
                .filter(
                  (href) =>
                    href &&
                    !href.includes('comment_id=') &&
                    (href.includes('/posts/') ||
                      href.includes('story.php') ||
                      href.includes('fbid=') ||
                      href.includes('/photo') ||
                      href.includes('/reel/') ||
                      href.includes('/watch/'))
                );

              const cleanedText = text
                .replace(/所有心情：[\s\S]*$/g, '')
                .replace(/讚\s*留言\s*分享[\s\S]*/g, '')
                .replace(/查看更多/g, '')
                .trim();

              if (cleanedText.length < 15) return;

              results.push({
                idx,
                text: cleanedText,
                images: Array.from(new Set(images)),
                hasVideo,
                videoPoster,
                link: links[0] || '',
              });
            });

            return results;
          }, target);

          console.log(`[Live-Crawler] Found ${rawPosts.length} top-level posts from ${target.name}.`);

          for (const raw of rawPosts) {
            const rawLink = raw.link?.trim();

            // 1. 前置比對：若具有獨立 permalink 且已在資料庫中，則略過以節省 AI Token
            if (rawLink && rawLink !== target.url && existingSourceUrls.has(rawLink)) {
              console.log(`[Live-Crawler] ⏭️ 來源連結先前已抓過 (${rawLink})，略過 AI 解析以節省資源與防重複。`);
              continue;
            }

            let postImages = [...raw.images];
            const isVideo = raw.hasVideo;

            // 2. 若為影片貼文且無一般附圖，執行【影片封面提取】或【Playwright 影片畫面即時截圖】
            if (postImages.length === 0 && raw.hasVideo) {
              if (raw.videoPoster && raw.videoPoster.startsWith('http')) {
                console.log(`[Live-Crawler] 🎥 偵測到影片貼文，已提取官方 Poster 封面: ${raw.videoPoster.slice(0, 60)}...`);
                postImages.push(raw.videoPoster);
              } else {
                try {
                  console.log(`[Live-Crawler] 🎥 偵測到影片貼文，正在截取影片畫面 (Video Frame Snapshot)...`);
                  const artHandle = await page.$(`[data-deal-crawler-idx="${raw.idx}"]`);
                  if (artHandle) {
                    const videoTarget = await artHandle.$('video, div[data-pagelet*="Video"], [aria-label*="影片"], [aria-label*="video"], div[style*="background-image"]');
                    if (videoTarget) {
                      await videoTarget.scrollIntoViewIfNeeded().catch(() => {});
                      await page.waitForTimeout(500);

                      const cropsDir = path.join(process.cwd(), 'public', 'crops');
                      if (!fs.existsSync(cropsDir)) {
                        fs.mkdirSync(cropsDir, { recursive: true });
                      }
                      const snapFileName = `video_snap_${target.id}_${Date.now()}_${raw.idx}.jpg`;
                      const snapFilePath = path.join(cropsDir, snapFileName);

                      await videoTarget.screenshot({ path: snapFilePath, type: 'jpeg', quality: 85 });
                      console.log(`[Live-Crawler] 📸 成功擷取影片關鍵畫面: /crops/${snapFileName}`);
                      postImages.push(`/crops/${snapFileName}`);
                    }
                  }
                } catch (snapErr) {
                  console.warn(`[Live-Crawler] 影片截圖失敗:`, (snapErr as Error).message);
                }
              }
            }

            // 3. 調用 Gemini AI 解析成不同獨立特價卡片 (1-to-N)
            console.log(`[Live-Crawler] 🤖 發現全新貼文，調用 Gemini AI 結構化拆解成不同特價卡片...`);
            const rawPostInput: RawCrawledPost = {
              merchantId: target.id,
              merchantName: target.name,
              merchantLogo: target.logo,
              text: raw.text,
              images: postImages,
              link: rawLink || target.url,
              isVideo,
            };

            const structuredDeals = await parseDealsWithGemini(rawPostInput);
            if (structuredDeals && structuredDeals.length > 0) {
              console.log(`[Live-Crawler] ✨ Gemini AI 成功自該來源拆解出 ${structuredDeals.length} 筆獨立卡片！`);
              extractedDeals.push(...structuredDeals);
              if (rawLink && rawLink !== target.url) existingSourceUrls.add(rawLink);
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
            const itemLink = (item.link || target.url)?.trim();

            if (itemLink && existingSourceUrls.has(itemLink)) {
              console.log(`[Live-Crawler] ⏭️ 官方活動連結已存在 (${itemLink})，略過 AI 解析。`);
              continue;
            }

            const rawPostInput: RawCrawledPost = {
              merchantId: target.id,
              merchantName: target.name,
              merchantLogo: target.logo,
              text: `${item.title}\n${item.desc}`,
              images: item.imgUrl ? [item.imgUrl] : [],
              link: itemLink,
            };

            const structuredDeals = await parseDealsWithGemini(rawPostInput);
            if (structuredDeals && structuredDeals.length > 0) {
              console.log(`[Live-Crawler] ✨ Gemini AI 成功自官方活動頁解析出 ${structuredDeals.length} 筆獨立卡片！`);
              extractedDeals.push(...structuredDeals);
              if (itemLink) existingSourceUrls.add(itemLink);
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
