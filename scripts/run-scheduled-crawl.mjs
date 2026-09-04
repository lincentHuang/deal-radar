import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import { runPurgeExpiredJob } from './purge-expired-deals.mjs';

// 優先載入環境變數
const prisma = new PrismaClient();

let geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  if (fs.existsSync('.env.local')) {
    const env = fs.readFileSync('.env.local', 'utf-8');
    const m = env.match(/GEMINI_API_KEY=["']?([^"'\s\n]+)["']?/);
    if (m) geminiApiKey = m[1];
  }
}
if (!geminiApiKey && fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf-8');
  const m = env.match(/GEMINI_API_KEY=["']?([^"'\s\n]+)["']?/);
  if (m) geminiApiKey = m[1];
}

const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// 預設高優先級官方目標清單 (超商、量販、手搖、餐飲)
const DEFAULT_TARGETS = [
  {
    id: '7eleven',
    name: '7-ELEVEN',
    url: 'https://www.facebook.com/711open',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg',
    defaultCategory: 'food',
    defaultTags: ['#7-ELEVEN', '#超商特價', '#咖啡優惠']
  },
  {
    id: 'familymart',
    name: 'FamilyMart 全家',
    url: 'https://www.facebook.com/FamilyMart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png',
    defaultCategory: 'food',
    defaultTags: ['#全家', '#超商特價', '#Let\'sCafé', '#買一送一']
  },
  {
    id: 'pxmart',
    name: '全聯福利中心',
    url: 'https://www.facebook.com/pxmartchannel',
    logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png',
    defaultCategory: 'grocery',
    defaultTags: ['#全聯', '#PXMart', '#生鮮特賣', '#買一送一']
  },
  {
    id: 'carrefour',
    name: '家樂福 Carrefour Taiwan',
    url: 'https://www.facebook.com/carrefour.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Carrefour_logo.svg/1024px-Carrefour_logo.svg.png',
    defaultCategory: 'grocery',
    defaultTags: ['#家樂福', '#量販特惠', '#特賣']
  },
  {
    id: 'costco',
    name: 'Costco 好市多特價情報',
    url: 'https://www.facebook.com/DAYBUY.TW',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Costco_Wholesale_logo_2010-10-26.svg/1200px-Costco_Wholesale_logo_2010-10-26.svg.png',
    defaultCategory: 'grocery',
    defaultTags: ['#好市多', '#Costco', '#量販特價']
  },
  {
    id: 'starbucks',
    name: '星巴克 Starbucks',
    url: 'https://www.facebook.com/starbuckstaiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
    defaultCategory: 'food',
    defaultTags: ['#星巴克', '#Starbucks', '#買一送一', '#咖啡優惠']
  },
  {
    id: 'mcdonalds',
    name: '麥當勞 McDonald\'s',
    url: 'https://www.facebook.com/mcdonalds.tw',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png',
    defaultCategory: 'food',
    defaultTags: ['#麥當勞', '#速食優惠', '#大薯買一送一']
  },
  {
    id: 'watsons',
    name: '屈臣氏 Watsons',
    url: 'https://www.facebook.com/WatsonsTaiwan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/A.S._Watson_Group_Logo.svg/1200px-A.S._Watson_Group_Logo.svg.png',
    defaultCategory: 'grocery',
    defaultTags: ['#屈臣氏', '#Watsons', '#藥妝特惠', '#加1元多1件']
  }
];

/**
 * 格式化與清洗文字
 */
function cleanText(raw) {
  if (!raw) return '';
  return raw
    .replace(/所有心情：.*$/gs, '')
    .replace(/讚\s*留言\s*分享.*/gs, '')
    .replace(/查看更多/g, '')
    .trim();
}

/**
 * 使用 Gemini AI 分析抓取到的特惠貼文
 */
async function parsePostWithGemini(merchantName, text, imageUrls) {
  if (!ai || !text || text.length < 15) return null;

  try {
    const prompt = `你是一個專業的台灣特價情報解析助手。請分析以下來自「${merchantName}」的促銷貼文內容，提煉出明確的特惠情報。

【貼文內容】：
${text}

【規則】：
1. 若非具體促銷或無折扣優惠，請輸出 JSON: { "isDeal": false }
2. 若是優惠，請精確提煉出商品、特價價格、原價與活動起訖日 (YYYY-MM-DD)。若無年份，請以 2026 年為主。
3. 嚴格輸出純 JSON (不要任何 markdown 標記):
{
  "isDeal": true,
  "title": "簡短吸睛標題 (25字內，包含品牌與核心優惠，例如：全家 大杯經典美式 買1送1)",
  "subtitle": "核心副標題 (40字內)",
  "category": "food" | "grocery" | "tech" | "fashion",
  "originalPrice": 數值或 null,
  "discountPrice": 數值或 null,
  "priceUnit": "杯" | "件" | "組" | "份" | "盒",
  "targetItems": ["商品1"],
  "conditions": ["活動限制或指定條件"],
  "tags": ["#標籤1", "#標籤2"],
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "isHot": true 或 false,
  "isFlashDeal": true 或 false
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const outputText = response.text ? response.text.replace(/```json/g, '').replace(/```/g, '').trim() : '';
    const parsed = JSON.parse(outputText);
    if (!parsed || !parsed.isDeal || !parsed.title) return null;
    return parsed;
  } catch (err) {
    console.warn(`[Gemini Parse Warning] 貼文解析略過: ${err.message}`);
    return null;
  }
}

/**
 * 主執行任務
 */
async function runScheduledCrawl() {
  const startTime = new Date();
  console.log('================================================================');
  console.log(`🕒 [Scheduled Automated Crawler] Started at ${startTime.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`);
  console.log(`🤖 Gemini AI Engine: ${ai ? 'ENABLED (Gemini 2.5 Flash)' : 'DISABLED (Regex Mode)'}`);
  console.log('================================================================');

  let crawledDealsCount = 0;
  let insertedDealsCount = 0;
  let updatedDealsCount = 0;
  const targetIdsRan = [];

  // 1. 自動過期情報清理
  console.log('\n[Step 1] 🧹 執行過期特惠情報自動清理巡檢...');
  try {
    await runPurgeExpiredJob();
  } catch (purgeErr) {
    console.warn('⚠️ 過期清理發生警示 (略過續行):', purgeErr.message);
  }

  // 2. 取得目標站點清單
  console.log('\n[Step 2] 📋 讀取資料庫啟用之目標站點...');
  let targets = [];
  try {
    const dbTargets = await prisma.crawlerTarget.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: 'asc' }
    });
    if (dbTargets.length > 0) {
      targets = dbTargets;
      console.log(`✅ 自資料庫成功讀取 ${targets.length} 個已啟用目標站點`);
    } else {
      targets = DEFAULT_TARGETS;
      console.log(`ℹ️ 資料庫無自訂目標，使用預設 ${targets.length} 個知名品牌站點`);
    }
  } catch (dbErr) {
    console.warn('⚠️ 讀取資料庫目標失敗，使用預設目標:', dbErr.message);
    targets = DEFAULT_TARGETS;
  }

  // 3. 啟動無頭瀏覽器
  console.log('\n[Step 3] 🚀 啟動 Playwright Headless Chromium 引擎...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'zh-TW',
  });

  const page = await context.newPage();

  try {
    for (const target of targets.slice(0, 10)) {
      console.log(`\n------------------------------------------------------------`);
      console.log(`🔍 正在採集站點: ${target.name} (${target.url})`);
      targetIdsRan.push(target.id);

      try {
        await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
        await page.waitForTimeout(2500);

        // 關閉 Facebook 登入對話框
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('div[role="button"], [aria-label], span'));
          for (const b of btns) {
            const label = b.getAttribute('aria-label') || b.innerText || '';
            if (label.includes('關閉') || label.includes('Close') || label.includes('稍後再說') || label.includes('Not Now')) {
              b.click();
              break;
            }
          }
        });

        // 展開「查看更多」與向下滾動
        await page.evaluate(() => {
          window.scrollBy(0, 800);
          const moreBtns = Array.from(document.querySelectorAll('div[role="button"], span'));
          for (const btn of moreBtns) {
            if (btn.innerText && btn.innerText.includes('查看更多')) {
              btn.click();
            }
          }
        });
        await page.waitForTimeout(1500);

        // 提取文章區塊
        const posts = await page.evaluate((tInfo) => {
          const items = [];
          const articles = document.querySelectorAll('div[role="article"]');
          articles.forEach((art, idx) => {
            if (idx >= 4) return; // 每個站點前 4 則最新貼文
            const rawText = art.innerText || '';
            if (rawText.length < 25) return;

            const images = Array.from(art.querySelectorAll('img'))
              .map(img => img.src)
              .filter(src => src && !src.includes('rsrc.php') && !src.includes('emoji') && !src.includes('data:image'));

            const links = Array.from(art.querySelectorAll('a'))
              .map(a => a.href)
              .filter(href => href && (href.includes('/posts/') || href.includes('story.php') || href.includes('fbid=')));

            items.push({
              text: rawText,
              images: Array.from(new Set(images)),
              link: links[0] || tInfo.url,
            });
          });
          return items;
        }, target);

        console.log(`📝 擷取到 ${posts.length} 則最新社群公開動態`);

        for (const post of posts) {
          crawledDealsCount++;
          const cleaned = cleanText(post.text);
          let dealData = null;

          // 優先以 Gemini AI 提煉結構化特惠
          if (ai) {
            dealData = await parsePostWithGemini(target.name, cleaned, post.images);
          }

          // 若 Gemini 無判斷或未開啟，則使用關鍵字比對 fallback
          if (!dealData) {
            const hasDealKeywords = /(買一送一|買1送1|特價|第二件半價|折扣|折價|下殺|限量|現折|優惠)/i.test(cleaned);
            if (hasDealKeywords) {
              const firstLine = cleaned.split('\n')[0].replace(/[【】]/g, '').slice(0, 30);
              const nowStr = new Date().toISOString().split('T')[0];
              const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

              dealData = {
                title: `${target.name} ${firstLine}`,
                subtitle: cleaned.slice(0, 50),
                category: target.defaultCategory || 'food',
                originalPrice: null,
                discountPrice: null,
                priceUnit: '件',
                targetItems: [target.name],
                conditions: ['官方社群最新情報'],
                tags: target.defaultTags || [`#${target.name}`, '#特惠情報'],
                startDate: nowStr,
                endDate: nextWeek,
                isHot: false,
                isFlashDeal: cleaned.includes('買一送一') || cleaned.includes('買1送1'),
              };
            }
          }

          if (dealData) {
            const dealId = `crawled-${target.id}-${Buffer.from(dealData.title).toString('hex').slice(0, 16)}`;
            const imageUrl = post.images[0] || target.logo || '';

            const res = await prisma.deal.upsert({
              where: { id: dealId },
              update: {
                title: dealData.title,
                subtitle: dealData.subtitle,
                discountPrice: dealData.discountPrice ? Number(dealData.discountPrice) : undefined,
                originalPrice: dealData.originalPrice ? Number(dealData.originalPrice) : undefined,
                startDate: dealData.startDate,
                endDate: dealData.endDate,
                imageUrl: imageUrl || undefined,
                tags: dealData.tags || target.defaultTags,
                updatedAt: new Date()
              },
              create: {
                id: dealId,
                title: dealData.title,
                subtitle: dealData.subtitle,
                category: dealData.category || 'food',
                channelType: 'offline',
                merchantName: target.name,
                merchantLogo: target.logo,
                regions: ['全台門市'],
                discountPrice: dealData.discountPrice ? Number(dealData.discountPrice) : undefined,
                originalPrice: dealData.originalPrice ? Number(dealData.originalPrice) : undefined,
                priceUnit: dealData.priceUnit || '件',
                targetItems: dealData.targetItems || [target.name],
                conditions: dealData.conditions || ['活動詳情依門市現場公告為準'],
                tags: dealData.tags || target.defaultTags,
                startDate: dealData.startDate,
                endDate: dealData.endDate,
                isHot: !!dealData.isHot,
                isFlashDeal: !!dealData.isFlashDeal,
                source: 'social_listening',
                sourcePlatform: 'Facebook',
                sourceUrl: post.link || target.url,
                imageUrl: imageUrl,
                images: post.images.length > 0 ? post.images : (imageUrl ? [imageUrl] : [])
              }
            });

            if (res.createdAt.getTime() === res.updatedAt.getTime()) {
              insertedDealsCount++;
              console.log(`   ✨ [新特惠入庫] ${dealData.title}`);
            } else {
              updatedDealsCount++;
              console.log(`   🔄 [特惠更新] ${dealData.title}`);
            }
          }
        }

        // 更新目標站點最後爬取狀態
        await prisma.crawlerTarget.updateMany({
          where: { id: target.id },
          data: {
            lastCrawledAt: new Date(),
            lastStatus: 'success',
            crawledCount: { increment: 1 }
          }
        }).catch(() => {});

      } catch (targetErr) {
        console.error(`❌ 站點 ${target.name} 採集異常:`, targetErr.message);
      }
    }

    const totalDealsInDb = await prisma.deal.count();
    const successMsg = `定時自動爬蟲任務圓滿完成：成功掃描 ${targetIdsRan.length} 個站點，採集 ${crawledDealsCount} 則情報，新增入庫 ${insertedDealsCount} 筆新特惠，更新 ${updatedDealsCount} 筆（目前全站資料庫共有 ${totalDealsInDb} 筆有效優惠）`;

    console.log(`\n============================================================`);
    console.log(`🎉 ${successMsg}`);
    console.log(`============================================================`);

    // 寫入真實資料庫日誌
    await prisma.crawlerLog.create({
      data: {
        targetName: `${targetIdsRan.length} 個官方定時站點`,
        type: 'scheduled',
        status: 'success',
        crawledCount: crawledDealsCount,
        insertedCount: insertedDealsCount,
        message: successMsg,
        details: {
          targetIds: targetIdsRan,
          updatedCount: updatedDealsCount,
          totalDealsInDb,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (fatalErr) {
    console.error('❌ 排程執行失敗:', fatalErr);
    await prisma.crawlerLog.create({
      data: {
        targetName: '定時排程系統',
        type: 'scheduled',
        status: 'failed',
        crawledCount: crawledDealsCount,
        insertedCount: insertedDealsCount,
        message: `定時排程執行異常: ${fatalErr.message}`,
      }
    }).catch(() => {});
    throw fatalErr;
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

runScheduledCrawl()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Fatal exit:', e);
    process.exit(1);
  });
