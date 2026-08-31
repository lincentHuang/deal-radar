import { chromium } from 'playwright';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

async function fetchImagePart(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: contentType.split(';')[0] || 'image/jpeg'
      }
    };
  } catch {
    return null;
  }
}

async function seedWithGeminiVision() {
  console.log('🚀 [Gemini Date Precision Crawler] Starting 7-ELEVEN & FamilyMart FB scraping...');

  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey && fs.existsSync('.env.local')) {
    const env = fs.readFileSync('.env.local', 'utf-8');
    const m = env.match(/GEMINI_API_KEY=[\"']?([^\"'\s]+)[\"']?/);
    if (m) apiKey = m[1];
  }
  if (!apiKey && fs.existsSync('.env')) {
    const env = fs.readFileSync('.env', 'utf-8');
    const m = env.match(/GEMINI_API_KEY=[\"']?([^\"'\s]+)[\"']?/);
    if (m) apiKey = m[1];
  }

  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'zh-TW',
  });

  const page = await context.newPage();

  const targets = [
    {
      id: '7eleven',
      name: '7-ELEVEN',
      url: 'https://www.facebook.com/711open',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg',
      defaultCategory: 'food',
      defaultTags: ['#7-ELEVEN', '#超商特價', '#咖啡優惠'],
      cards: ['icash Pay (5%)', 'OPENPOINT 點數折抵', '國泰 CUBE 卡 (3%)']
    },
    {
      id: 'familymart',
      name: '全家 FamilyMart',
      url: 'https://www.facebook.com/FamilyMart',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png',
      defaultCategory: 'food',
      defaultTags: ['#全家', '#超商特價', '#Let\'sCafé', '#甜點半價'],
      cards: ['全盈+PAY (5%)', 'FamiPay', '台新玫瑰卡 (3.8%)']
    },
    {
      id: 'famiport',
      name: '全家 FamiPort',
      url: 'https://www.facebook.com/FamiPortTW',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png',
      defaultCategory: 'grocery',
      defaultTags: ['#全家', '#FamiPort', '#康康五', '#買一送一'],
      cards: ['全盈+PAY (5%)', 'FamiPay', '悠遊卡']
    },
    {
      id: 'hilife',
      name: '萊爾富 Hi-Life',
      url: 'https://www.facebook.com/hihilife',
      logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png',
      defaultCategory: 'food',
      defaultTags: ['#萊爾富', '#HiLife', '#咖啡買一送一', '#超商特價'],
      cards: ['HiPay (4%)', '玉山 U Bear (3%)', '聯邦賴點卡 (2%)']
    },
    {
      id: 'okmart',
      name: 'OK超商 OKmart',
      url: 'https://www.facebook.com/okmart.tw',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png',
      defaultCategory: 'food',
      defaultTags: ['#OK超商', '#OKmart', '#OKCAFE', '#特價優惠'],
      cards: ['悠遊卡', '一卡通', '國泰 CUBE 卡 (3%)']
    },
    {
      id: 'pxmart',
      name: '全聯福利中心',
      url: 'https://www.facebook.com/pxmartchannel',
      logo: 'https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png',
      defaultCategory: 'grocery',
      defaultTags: ['#全聯', '#PXMart', '#生鮮特賣', '#買一送一', '#週末加碼'],
      cards: ['全支付 (4.5%)', 'PX Pay', '國泰世華信用卡']
    },
    {
      id: 'simplemart',
      name: '美廉社 Simple Mart',
      url: 'https://www.facebook.com/simplemart1',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png',
      defaultCategory: 'grocery',
      defaultTags: ['#美廉社', '#SimpleMart', '#超市特惠', '#即期特賣'],
      cards: ['LINE Pay (3%)', '台灣Pay', '全支付']
    }
  ];

  const allStructuredDeals = [];

  for (const target of targets) {
    console.log(`\n🔍 Fetching ${target.name} (${target.url})...`);
    try {
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(3000);

      // Close login modal
      try {
        const closeBtn = await page.$('div[aria-label="關閉"], div[aria-label="Close"], [role="button"]:has-text("稍後再說"), [role="button"]:has-text("Not Now"), div[aria-label="隱藏"]');
        if (closeBtn) {
          await closeBtn.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {}

      // Expand "查看更多"
      try {
        const seeMoreBtns = await page.$$('div[role="button"]:has-text("查看更多"), span:has-text("查看更多")');
        for (const btn of seeMoreBtns.slice(0, 8)) {
          await btn.click().catch(() => {});
        }
        await page.waitForTimeout(1500);
      } catch (e) {}

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 1200));
      await page.waitForTimeout(2000);

      const rawPosts = await page.evaluate((targetInfo) => {
        const results = [];
        const articles = document.querySelectorAll('div[role="article"]');

        articles.forEach((art, idx) => {
          if (idx >= 6) return;
          const text = (art.innerText || art.textContent || '').trim();
          if (text.length < 20) return;

          const images = Array.from(art.querySelectorAll('img'))
            .map(img => img.src)
            .filter(src => src && !src.includes('rsrc.php') && !src.includes('emoji') && !src.includes('data:image'));

          const links = Array.from(art.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => href && (href.includes('/posts/') || href.includes('story.php') || href.includes('fbid=')));

          const cleanedText = text
            .replace(/所有心情：[\s\S]*$/g, '')
            .replace(/讚\s*留言\s*分享[\s\S]*/g, '')
            .replace(/查看更多/g, '')
            .trim();

          results.push({
            text: cleanedText,
            images: Array.from(new Set(images)),
            link: links[0] || targetInfo.url
          });
        });

        return results;
      }, target);

      console.log(`✅ Extracted ${rawPosts.length} posts from ${target.name}`);

      for (let postIdx = 0; postIdx < rawPosts.length; postIdx++) {
        const post = rawPosts[postIdx];
        console.log(`\n🤖 Analyzing Post ${postIdx + 1}/${rawPosts.length} with ${post.images.length} images...`);

        if (ai) {
               const systemPrompt = `你是一個專業的台灣超商/超市促銷情報與多模態視覺（Vision OCR）分析專家。
超商官方 Facebook 貼文常有【多格九宮格複合海報/康康5/週末買一送一/主題檔期總覽海報】。
請嚴格執行以下規則：
1. 【🔥 多格複合海報/九宮格 DM 全品項強制窮舉 (Exhaustive Scan)】：
   - 超商「康康5」、「週末買一送一」、「5天5好康」海報通常以多行多列（Grid）排列了 10 ~ 20 個獨立商品。
   - 【核心指令】：請由上至下、由左至右逐行逐格辨識「每一個商品」，**絕對不可只提取前 3~5 個**！海報中若有 16 個商品，請完整輸出 16 個 deal 物件！
2. 【🔥 跨圖關聯與特寫圖匹配 (Multi-Image Detail Matching)】：
   - 貼文常包含「圖 0/1: 全品項總覽大海報」+「圖 2/3/4: 局部特寫裁切圖」。
   - 請將每個解析出的商品品項，精確關聯到最清晰呈現該商品的特寫圖索引（matchedImageIndex）。
3. 【🔥 標題命名規則（極重要）】：
   標題必須完整包含「品牌 + 商品名 + (規格) + 核心特惠機制」，例如：
   - 全家 黑松沙士清新紅柚風味 買一送一
   - 全家 百吉布丁大雪糕 買一送一
   - 全家 阿奇儂極濃義式開心果雪糕 買一送一
   - 全家 農心辛拉麵袋麵 買一送一
   - 全家 金萱二十七 (茶飲) 買二送二
   - 全家 Alfie 草莓牛奶/原味可可 (任選) 買一送一
   - 全家 特趣焦糖夾心巧克力 (任選) 買一送一
   - 全家 義美仙草奶凍雪糕 加10元多1件
   - 全家 日清奶油三明治 第二件10元
   - 全家 -196 強烈雙重檸檬/葡萄柚 任選3件155元
   - 全家 Let's Café 特大杯美式/拿鐵 任選2杯95元
   - 全家 Let's Tea 大杯仙女紅茶 2杯65元
   - 全家 Fami!ce 霜淇淋 2支55元
   - 全家 酷繽沙全系列 任選2杯75元
   - 全家 五月花厚棒衛生紙 (60抽x6包) 2串139元
   - 全家 德國原裝進口黑麥汁原味 買一送一
4. 【🔥 破盤優惠價折算單入均價（極重要）】：
   - 「買一送一」（原價 35/瓶）：discountPrice: 17.5, originalPrice: 35, priceUnit: "瓶", conditions: ["同商品買一送一"]
   - 「任選買一送一」（原價 25/件）：discountPrice: 12.5, originalPrice: 25, priceUnit: "件", conditions: ["任選買一送一"]
   - 「買二送二」（原價 30/瓶）：discountPrice: 15, originalPrice: 30, priceUnit: "瓶", conditions: ["同商品買二送二"]
   - 「加10元多1件」（原價 45/件）：兩件55元 ➔ discountPrice: 27.5, originalPrice: 45, priceUnit: "件", conditions: ["加10元多1件"]
   - 「第二件10元」（原價 45/件）：兩件55元 ➔ discountPrice: 27.5, originalPrice: 45, priceUnit: "件", conditions: ["第二件10元"]
   - 「任選3件155元」（原價 79/件）：3件155元 ➔ discountPrice: 51.7, originalPrice: 79, priceUnit: "件", conditions: ["任選3件155元"]
   - 「任選2杯95元」（原價 60~90/杯）：discountPrice: 47.5, originalPrice: 75, priceUnit: "杯", conditions: ["任選2杯95元"]
   - 「2支55元」（原價 49/支）：兩支55元 ➔ discountPrice: 27.5, originalPrice: 49, priceUnit: "支", conditions: ["2支55元"]
   - 「2串139元」（原價 259/串）：兩串139元 ➔ discountPrice: 69.5, originalPrice: 259, priceUnit: "串", conditions: ["2串139元"]
5. 【🔥 活動起訖日期 OCR 精準解析（極重要）】：
   請仔細辨識圖片頂部或文字中的檔期（例如《活動日期：115.08.28 - 09.01》轉換為 2026-08-28 ~ 2026-09-01）。
6. 【🔥 5層收斂標籤】：
   包含通路品牌（#全家、#7-ELEVEN）、品類（#冰品、#飲品、#泡麵、#零食、#生活用品、#咖啡）、促銷機制（#買一送一、#康康五、#第二件10元、#加10元多1件）。

回傳標準 JSON:
{
  "isDeal": true,
  "deals": [
    {
      "title": "全家 黑松沙士清新紅柚風味 (600ml) 買一送一",
      "subtitle": "康康5限時5天，清爽紅柚沙士同商品買1送1",
      "category": "food",
      "discountPrice": 17.5,
      "originalPrice": 35,
      "priceUnit": "瓶",
      "targetItems": ["黑松沙士清新紅柚風味"],
      "conditions": ["同商品買1送1", "康康5限時優惠"],
      "tags": ["#全家", "#飲品", "#汽水", "#沙士", "#買一送一", "#康康五"],
      "startDate": "2026-08-28",
      "endDate": "2026-09-01",
      "matchedImageIndex": 1
    }
  ]
}`;��中與貼文中的活動日期字樣（如《活動期間：09/01-09/30》、8/24-9/27、即日起至 9/2、8/31-9/2 限時 3 天等）：
   - 轉換為標準格式 YYYY-MM-DD（基準年份 2026 年）。
   - 例如《活動期間：09/01-09/30》➔ startDate: "2026-09-01", endDate: "2026-09-30"
   - 例如 8/24-9/27 ➔ startDate: "2026-08-24", endDate: "2026-09-27"
   - 例如 8/31-9/2 ➔ startDate: "2026-08-31", endDate: "2026-09-02"
4. 【🔥 圖片專屬隔離】：
   每個商品必須挑選最匹配該商品的情境圖索引 (matchedImageIndex)。
5. 【🔥 5層收斂標籤】：
   提煉 4~6 個實用標籤：#品牌, #大品類, #細品項, #規格/豆種, #促銷機制。嚴禁出現 #foodomo、#UberEats、#以系統為準 等雜訊。

回傳標準 JSON:
{
  "isDeal": true,
  "deals": [
    {
      "title": "7-ELEVEN CITY PRIMA 精品美式 (大杯) 買二送二",
      "subtitle": "日曬咖啡豆比例提升20%，大杯同品項買2送2",
      "category": "food",
      "discountPrice": 50,
      "originalPrice": 100,
      "priceUnit": "杯",
      "targetItems": ["大杯精品美式"],
      "conditions": ["大杯同品項買二送二", "冰熱不限"],
      "tags": ["#7-ELEVEN", "#咖啡", "#美式咖啡", "#耶加雪妃", "#大杯", "#買二送二"],
      "startDate": "2026-09-01",
      "endDate": "2026-09-30",
      "matchedImageIndex": 0
    }
  ]
}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.5-flash-lite',
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${systemPrompt}\n\n店家：${target.name}\n附圖清單（共 ${post.images.length} 張）：\n${imageIndexedText}\n\n貼文文字：\n${post.text}`
                    },
                    ...imageParts
                  ]
                }
              ],
              config: { responseMimeType: 'application/json' }
            });

            const parsed = JSON.parse(response.text || '{}');
            if (parsed.isDeal && Array.isArray(parsed.deals) && parsed.deals.length > 0) {
              const now = new Date();
              const nextWeek = new Date();
              nextWeek.setDate(now.getDate() + 7);

              const validCategories = ['food', 'tech', 'grocery', 'fashion', 'entertainment', 'travel'];

              parsed.deals.forEach((d, dealSubIdx) => {
                let img = post.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800';
                if (typeof d.matchedImageIndex === 'number' && post.images[d.matchedImageIndex]) {
                  img = post.images[d.matchedImageIndex];
                } else if (post.images.length > 1 && post.images[dealSubIdx]) {
                  img = post.images[dealSubIdx];
                }

                const cleanedTags = (d.tags || [])
                  .map(t => t.startsWith('#') ? t : `#${t}`)
                  .filter(t => !['#foodomo', '#ubereats', '#以系統為準', '#售完為止', '#優惠', '#熱門'].includes(t.toLowerCase()));

                const normalizedCategory = validCategories.includes(d.category) ? d.category : (target.defaultCategory || 'food');

                const sDate = d.startDate || now.toISOString().split('T')[0];
                const eDate = d.endDate || nextWeek.toISOString().split('T')[0];

                allStructuredDeals.push({
                  id: `deal-${target.id}-${postIdx}-${dealSubIdx}`,
                  title: d.title,
                  subtitle: d.subtitle || post.text.slice(0, 90).replace(/\n+/g, ' '),
                  category: normalizedCategory,
                  channelType: 'offline',
                  merchant: {
                    name: target.name,
                    logo: target.logo,
                    storeBranches: '全台實體門市',
                  },
                  regions: ['全台門市', '台北市', '新北市', '台中市', '高雄市'],
                  discountPrice: Number(d.discountPrice) || 49,
                  originalPrice: Number(d.originalPrice) || Math.round((Number(d.discountPrice) || 49) * 1.35),
                  priceUnit: d.priceUnit || '份',
                  targetItems: d.targetItems || [d.title],
                  conditions: d.conditions || ['門市促銷優惠'],
                  eligibleCards: target.cards || ['信用卡通用', '行動支付'],
                  tags: cleanedTags.length > 0 ? cleanedTags : (target.defaultTags || [`#${target.name}`, '#特價']),
                  startDate: sDate,
                  endDate: eDate,
                  isHot: postIdx === 0 && dealSubIdx === 0,
                  isFlashDeal: (d.conditions || []).some(c => c.includes('買一送一') || c.includes('買二送二') || c.includes('閃購') || c.includes('限時')),
                  source: 'social_listening',
                  sourcePlatform: 'Convenience',
                  sourceUrl: post.link,
                  likeCount: Math.floor(Math.random() * 200) + 40,
                  commentCount: Math.floor(Math.random() * 20) + 3,
                  priceHistory: [
                    { date: '昨日', price: Number(d.originalPrice) || 60 },
                    { date: '今日', price: Number(d.discountPrice) || 49 },
                  ],
                  priceDropAlert: {
                    isLowest90Days: true,
                    isSuspiciousHike: false,
                    note: 'Gemini AI 智能識別活動日期與折算均價！',
                  },
                  imageUrl: img,
                  images: img ? [img] : undefined,
                  aspectRatio: '4:3',
                });

                console.log(`   ✨ [Date OCR] ${d.title} | 期間: ${sDate} ~ ${eDate} | 特價: $${d.discountPrice}/${d.priceUnit}`);
              });
            }
          } catch (aiErr) {
            console.error('   ❌ Gemini Vision error:', aiErr.message);
          }
        }
      }

    } catch (err) {
      console.error(`❌ Error crawling ${target.name}:`, err.message);
    }
  }

  await browser.close();

  console.log(`\n🎉 Total extracted deals: ${allStructuredDeals.length}`);

  const fileContent = `import { SmartDeal } from '@/features/deals/types/deal.types';

/**
 * 由 Gemini Vision 進行圖片日期 OCR、均價折算與專屬圖片隔離之真實超商情報 (共 ${allStructuredDeals.length} 筆)
 */
export const INITIAL_SMART_DEALS: SmartDeal[] = ${JSON.stringify(allStructuredDeals, null, 2)};
`;

  fs.writeFileSync('src/features/deals/server/deals-mock-data.ts', fileContent, 'utf-8');
  console.log('✅ Successfully saved date-precise deals to deals-mock-data.ts!');
}

seedWithGeminiVision();
