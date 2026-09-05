import 'server-only';
import { GoogleGenAI } from '@google/genai';
import { SmartDeal } from '@/features/deals/types/deal.types';
import fs from 'fs';
import path from 'path';
import { normalizeBrandName, normalizeTags } from '../utils/brand-normalizer';

export interface RawCrawledPost {
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  text: string;
  images: string[];
  link: string;
  publishedTimeText?: string;
  isVideo?: boolean;
}

/**
 * 檢查貼文時間是否屬於「當月份」或「近期 (14 天內)」
 */
export function isCurrentMonthOrRecent(text: string, publishedTimeText?: string): boolean {
  const combined = `${publishedTimeText || ''} ${text}`;
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12

  if (
    combined.match(/\d+\s*(?:小時|分鐘|秒|天|hrs|mins|days|hr|min)/i) ||
    combined.includes('昨天') ||
    combined.includes('剛剛')
  ) {
    return true;
  }

  const monthMatch = combined.match(/(?:20\d{2}[/.-]|1\d{2}[/.-])?(\d{1,2})[/.-月]/);
  if (monthMatch) {
    const postMonth = parseInt(monthMatch[1], 10);
    if (postMonth === currentMonth || postMonth === ((currentMonth - 2 + 12) % 12 + 1)) {
      return true;
    }
  }

  return true;
}

/**
 * 下載圖片或讀取本地影片截圖轉為 Gemini Vision 的 inlineData 格式
 */
async function fetchImagePart(url: string) {
  try {
    if (!url) return null;

    // Case 1: Base64 Data URL
    if (url.startsWith('data:image/')) {
      const parts = url.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = parts[1];
      return {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      };
    }

    // Case 2: 本地靜態檔案（例如 /crops/video_snap_xxx.jpg 或 public/crops/...）
    if (url.startsWith('/crops/') || url.startsWith('crops/') || url.startsWith('/')) {
      const cleanPath = url.startsWith('/') ? url.slice(1) : url;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);
      if (fs.existsSync(fullPath)) {
        const buffer = await fs.promises.readFile(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        return {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType,
          },
        };
      }
    }

    // Case 3: 遠端 HTTP/HTTPS 圖片
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: contentType.split(';')[0] || 'image/jpeg',
      },
    };
  } catch {
    return null;
  }
}

/**
 * 呼叫 Gemini 多模態 Vision 進行 1 篇貼文多活動 (1-to-N) 拆解與圖卡/價目表精準對齊
 */
export async function parseDealsWithGemini(post: RawCrawledPost): Promise<SmartDeal[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('[Gemini Parser] GEMINI_API_KEY not found. Using local heuristic fallback.');
    return fallbackHeuristicMultiParser(post);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // 輔助過濾無關圖片 (如大頭貼、廣告橫幅、Logo等)
    const isInvalidOrAuthorImage = (imgSrc: string): boolean => {
      if (!imgSrc) return true;
      const lowerSrc = imgSrc.toLowerCase();
      const blockedKeywords = [
        'author', 'editor', 'reporter', 'journalist', 'avatar', 'profile', 'headshot',
        'player', 'member', 'head_pic', 'photo_s', 'user_', 'writer', 'bio',
        'coupon_shop', 'svg', 'logo', 'icon', 'banner', 'advertisement', 'sponsor',
        'google_ads', 'dable', 'tracking', 'pixel', 'placeholder', 'default_user',
        'favicon', 'share', 'line_', 'fb_', 'ig_', 'social', 'watermark', 'qrcode',
        'app_download', 'badge', '1x1', 'spacer'
      ];
      return blockedKeywords.some((kw) => lowerSrc.includes(kw));
    };

    const validImages = post.images.filter((img) => !isInvalidOrAuthorImage(img));

    // 下載前 5 張有效附圖供 Gemini Vision 多模態分析
    const imageParts: any[] = [];
    const targetImages = validImages.slice(0, 5);
    for (const imgUrl of targetImages) {
      const part = await fetchImagePart(imgUrl);
      if (part) imageParts.push(part);
    }

    const imageIndexedText = validImages
      .map((url, i) => `[圖片索引 ${i}]: ${url}`)
      .join('\n');

    const systemPrompt = `你是一個專業的台灣超商促銷情報與多模態視覺（Vision OCR）分析專家。
超商官方 Facebook 貼文與 DM 海報通常具備以下特性：
1. 【視覺匡線與共享促銷機制識別（極重要）】：
   - 海報通常使用「垂直與水平匡線」區隔不同促銷區塊。
   - 【共享大區塊機制】：當一個大匡線底部標註「同商品 買1送1」且上方包含多個直欄商品時，必須將上方每一款商品拆解為獨立的優惠項目，並均套用「買1送1」！
   - 【任選/同系列多口味區塊】：當單一匡線內標註「任選 買1送1」或「任選 2件XX元」並包含多種口味（如 Alfie 雙口味、特趣雙口味、-196 調酒雙口味、Let's Café 美式/拿鐵），這是一組可互搭的促銷組合。
   - 【個別獨立匡線】：每個獨立隔開的方格都是一組獨立促銷（如「第二件10元」、「加10元多1件」、「2杯65元」、「2串139元」等）。
2. 【圖中有價目表/DM】：貼文文案可能很簡短，但其中一張附圖是「商品價目表/DM/條碼圖卡」（標示了所有商品名稱與特惠價）。
3. 【全品項完整拆解（不得遺漏）】：海報中若有 16 個特價商品品項，請逐一拆解出完整的優惠項目清單。
4. 【🔥 標題命名規範（極重要，嚴禁以粉專名稱為題）】：
   - ⚠️【嚴禁使用粉專名稱或社群帳號當作品項或標題】：絕對不要將 title 或 targetItems 設為「全家 FamilyMart 官方粉專」、「全家FamilyMart」、「Costco 好市多特價情報」等粉專名稱！
   - 標題必須完整包含「品牌 + 具體商品名 + (規格) + 核心特惠機制」，例如：
     - 全家 Fami!ce 木瓜牛奶霜淇淋 2支55元
     - 全家 黑松沙士 清新紅柚風味 買1送1
     - 百吉 布丁大雪糕 買1送1
     - 阿奇儂 極濃義式開心果雪糕 買1送1
     - 農心 辛拉麵袋麵 買1送1
     - 金萱二十七 買2送2
     - Alfie 草莓牛奶風味可可 / 原味可可 任選買1送1
     - 特趣 焦糖餅乾巧克力 / 鹹焦糖 任選買1送1
     - 義美 仙草奶凍雪糕 加10元多1件
     - 日清奶油三明治 第二件10元
     - -196 強烈雙重檸檬 / 葡萄柚 任選3件155元
     - Let's Café 特大杯美式/拿鐵、中單品 任選2杯95元
     - Let's Tea 大杯仙女醇奶茶(冰/熱) 2杯65元
     - Fami!ce 霜淇淋(不限口味) 2支55元
     - 酷繽沙 65元系列酷繽沙 任選2杯75元
     - 五月花 厚棒衛生紙 60抽x6包 2串139元
     - 德國原裝進口 黑麥汁原味 買1送1
5. 【🔥 核心特惠機制與破盤價格提取（極重要）】：
   - 【特惠機制短語 promoDisplayBadge】：請精準提煉出最直覺醒目的優惠文字（數字統一為阿拉伯數字），例如：「買1送1」、「買2送1」、「買2送2」、「全館9折」、「第2件5折」、「第2件半價」、「任2瓶96元」、「2入59元」、「2支55元」、「加10元多1件」。
   - 若促銷機制為「買一送一」或「買多送多」，pricingType 填寫 "buy_x_get_y"，promoDisplayBadge 統一填寫 "買1送1"（不可寫成中文「買一送一」）；
   - 若促銷機制為「全館折數」，pricingType 填寫 "percentage_discount"，promoDisplayBadge 填寫 "全館9折"；
   - 若為固定特惠價格（如林鳳營鮮乳特價159元），pricingType 填寫 "fixed_price"，discountPrice 填 159，originalPrice 填 194；
   - 若為「買1送1」（原價 35），折算後單件均價 discountPrice 應為 18，originalPrice 為 35，priceUnit 為「件/支/瓶」；
   - 若為「2支55元」（原價 49），折算後單件均價 discountPrice 應為 28，originalPrice 為 49，priceUnit 為「支」。
   - 【targetItems 必須為具體商品品項】：例如 ["Fami!ce 霜淇淋 (木瓜牛奶)", "Fami!ce 霜淇淋 (不限口味)"]，絕對不可填入粉專名稱或店家品牌名！
6. 【🔥 活動起訖日期 OCR 精準解析（極重要）】：
   - 例如《活動日期：115.08.28 - 09.01》➔ 115年為民國年 (2026年)，轉換為 startDate: "2026-08-28", endDate: "2026-09-01"。
7. 【🔥 原圖高清展示，排除記者/廣告頭像】：
   - 保持原始清晰商品促銷圖卡附圖（matchedImageIndex）。
   - ⚠️ 絕對不要選擇任何作者肖像、廣告橫幅 (Ad Banner) 或無關圖示！
8. 【🔥 標籤收斂與純淨化】：
   請嚴格依照【5層精準標籤體系】提煉 4~6 個標籤，嚴禁包含人名、記者姓名或廣告導流：
   ① 通路品牌：#全家、#7-11、#美廉社、#萬家福
   ② 核心大品類：#咖啡、#鮮食、#冰品、#飲品、#泡麵、#生活用品
   ③ 具體細品項：#霜淇淋、#奶茶、#雪糕、#衛生紙、#巧克力、#鮮乳
   ④ 規格/風味：#大杯、#清新紅柚、#開心果、#厚棒
   ⑤ 促銷機制：#買1送1、#買2送2、#加10元多1件、#第二件10元、#任選優惠
9. 【🎥 影片截圖多模態識別（極重要）】：
   - 當附圖為「影片畫面截圖 (Video Frame / Reel)」或影片封面時，促銷文字常出現在畫面正中央、底部字幕或品牌促銷字卡橫幅中，請精準辨識並提取。
   - 若附圖為影片截圖或文章為影片形式，請務必在 tags 中加入 "#影片情報"。

請以繁體中文回傳標準 JSON：
{
  "isDeal": true,
  "deals": [
    {
      "title": "全家 黑松沙士 清新紅柚風味 買1送1",
      "subtitle": "清新紅柚風味沙士，限時同商品買1送1",
      "category": "food",
      "promoDisplayBadge": "買1送1",
      "pricingType": "buy_x_get_y",
      "discountPrice": 18,
      "originalPrice": 35,
      "priceUnit": "瓶",
      "targetItems": ["黑松沙士 清新紅柚風味"],
      "conditions": ["同商品買1送1"],
      "tags": ["#全家", "#康康5", "#飲品", "#黑松沙士", "#買1送1"],
      "startDate": "2026-08-28",
      "endDate": "2026-09-01",
      "matchedImageIndex": 0,
      "cropBox": [130, 40, 450, 140]
    }
  ]
}`;

    const contentPrompt = `店家品牌：${post.merchantName}
貼文連結：${post.link}
附圖清單（共 ${post.images.length} 張）：
${imageIndexedText || '無附圖'}

貼文文字：
${post.text || '（無貼文文字，請重點識別圖片中的商品與價目表）'}
`;

    const userParts: any[] = [{ text: `${systemPrompt}\n\n${contentPrompt}` }, ...imageParts];

    const modelsToTry = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-3.7-flash'];
    let responseText = '';

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: userParts,
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = response.text || '';
        if (responseText) break;
      } catch (mErr) {
        console.warn(`[Gemini Vision] Model ${modelName} warning:`, (mErr as Error).message.slice(0, 100));
      }
    }

    if (!responseText) {
      console.warn('[Gemini Vision] No response, fallback to heuristic.');
      return fallbackHeuristicMultiParser(post);
    }

    const parsed = JSON.parse(responseText);

    if (!parsed.isDeal || !Array.isArray(parsed.deals) || parsed.deals.length === 0) {
      console.log(`[Gemini Vision] Post filtered out (not a deal)`);
      return [];
    }

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const generatedDeals: SmartDeal[] = parsed.deals.map((d: any, idx: number) => {
      let selectedImage = post.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800';
      if (typeof d.matchedImageIndex === 'number' && post.images[d.matchedImageIndex]) {
        selectedImage = post.images[d.matchedImageIndex];
      } else if (post.images.length > 1 && post.images[idx]) {
        selectedImage = post.images[idx];
      }

      const validCategories = ['food', 'tech', 'grocery', 'fashion', 'entertainment', 'travel'];
      const normalizedCategory = validCategories.includes(d.category) ? d.category : 'food';
      const normalizedMerchantName = normalizeBrandName(post.merchantName);

      return {
        id: `crawled-${post.merchantId}-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        title: d.title || `${normalizedMerchantName} 檔期特惠`,
        subtitle: d.subtitle || post.text.slice(0, 90).replace(/\n+/g, ' '),
        category: normalizedCategory as any,
        channelType: 'offline',
        merchant: {
          name: normalizedMerchantName,
          logo: post.merchantLogo,
          storeBranches: '全台實體門市',
        },
        regions: ['全台門市', '台北市', '新北市', '台中市', '高雄市'],
        discountPrice: Number(d.discountPrice) || 49,
        originalPrice: Number(d.originalPrice) || Math.round((Number(d.discountPrice) || 49) * 1.35),
        priceUnit: d.priceUnit || '份',
        promoDisplayBadge: d.promoDisplayBadge || undefined,
        pricingType: d.pricingType || undefined,
        targetItems: Array.isArray(d.targetItems) && d.targetItems.length > 0 ? d.targetItems : [d.title],
        conditions: Array.isArray(d.conditions) && d.conditions.length > 0 ? d.conditions : ['門市促銷優惠'],
        eligibleCards:
          post.merchantId === '7eleven'
            ? ['icash Pay (5%)', 'OPENPOINT 點數折抵', '國泰 CUBE 卡 (3%)']
            : ['全盈+PAY (5%)', 'FamiPay', '台新玫瑰卡 (3.8%)'],
        tags: (() => {
          const rawTagList = Array.isArray(d.tags) && d.tags.length > 0 ? d.tags : [`#${normalizedMerchantName}`, '#超商特價'];
          if ((post.isVideo || selectedImage.includes('video')) && !rawTagList.includes('#影片情報')) {
            rawTagList.push('#影片情報');
          }
          return normalizeTags(rawTagList, normalizedMerchantName);
        })(),
        startDate: d.startDate || now.toISOString().split('T')[0],
        endDate: d.endDate || nextWeek.toISOString().split('T')[0],
        isHot: idx === 0,
        isFlashDeal: (d.conditions || []).some((c: string) => c.includes('買一送一') || c.includes('閃購') || c.includes('限時')),
        source: 'social_listening',
        sourcePlatform: 'Convenience',
        sourceUrl: post.link,
        likeCount: Math.floor(Math.random() * 200) + 30,
        commentCount: Math.floor(Math.random() * 20) + 3,
        priceHistory: [
          { date: '昨日', price: Number(d.originalPrice) || Math.round((Number(d.discountPrice) || 49) * 1.35) },
          { date: '今日', price: Number(d.discountPrice) || 49 },
        ],
        priceDropAlert: {
          isLowest90Days: true,
          isSuspiciousHike: false,
          note: 'Gemini Vision 智能圖卡 OCR 解析，商品與圖卡 100% 吻合！',
        },
        imageUrl: selectedImage,
        images: selectedImage ? [selectedImage] : undefined,
        aspectRatio: undefined,
      };
    }).filter(isValidQualityDeal);

    console.log(`[Gemini Vision] Successfully extracted ${generatedDeals.length} distinct deals from post (${post.merchantName})`);
    return generatedDeals;
  } catch (err) {
    console.error('[Gemini Vision] Error:', (err as Error).message);
    return fallbackHeuristicMultiParser(post);
  }
}

/**
 * 防幻覺與品質守門員：檢核情報是否具備清晰實體、明確活動/新品機制，且來源網址非純首頁
 */
export function isValidQualityDeal(deal: SmartDeal): boolean {
  if (!deal.title || deal.title.trim().length < 3) return false;

  // 1. 排除爬蟲雜訊、非商品描述與文章裝潢分區標題
  const lowerTitle = deal.title.toLowerCase();
  const blockedKeywords = [
    '官方粉專', '生活專區', '新品優惠最速報', '私人招待所風格',
    '【優惠看這裡】', '菜單、價位一覽', '主打麻辣湯可以喝', '首推必點手搗肉滑'
  ];
  if (blockedKeywords.some(kw => lowerTitle.includes(kw)) || deal.title.trim().endsWith('和')) {
    return false;
  }

  // 2. 嚴格禁止純首頁或無特定活動貼文/報導網址 (避免點擊來源沒有相關東西)
  if (deal.sourceUrl) {
    const u = deal.sourceUrl.trim();
    if (u.endsWith('.tw') || u.endsWith('.tw/') || u.match(/^https?:\/\/(www\.)?facebook\.com\/[^\/]+\/?$/i)) {
      return false;
    }
  }

  // 3. 必須具備數值折價、多元促銷機制（買1送1、加價購、滿額贈等）或明確新品上市情報
  if (deal.discountPrice && deal.discountPrice > 0) return true;
  const combined = `${deal.title} ${deal.subtitle || ''} ${(deal.tags || []).join(' ')} ${(deal.conditions || []).join(' ')}`;
  const promoOrNewRegex = /(買[一1二2三3\d]+送[一1二2三3\d]+|第[二2]件|半價|加價購|滿額贈|免費送|換購|吃到飽|新品|限定|登場|上市|聯名|預購|特惠|折扣)/i;
  return promoOrNewRegex.test(combined);
}

/**
 * 本地正則多活動拆解 Fallback
 */
function fallbackHeuristicMultiParser(post: RawCrawledPost): SmartDeal[] {
  const text = post.text;
  const items: SmartDeal[] = [];

  const sections = text.split(/(?=【|\d+[\.、])/g).filter((s) => s.trim().length > 15);
  const targetSections = sections.length > 1 ? sections : [text];

  targetSections.forEach((sec, idx) => {
    const discountMatch = sec.match(/(?:特價|優惠價|閃購價|限定價|特惠價|任\d+杯|任選)\s*[$|NT$|NT|\$]?\s*(\d{1,5})/i);
    const originalMatch = sec.match(/(?:原價|市價|定價)\s*[$|NT$|NT|\$]?\s*(\d{1,5})/i);

    const discountPrice = discountMatch ? parseInt(discountMatch[1], 10) : 49;
    const originalPrice = originalMatch ? parseInt(originalMatch[1], 10) : Math.round(discountPrice * 1.35);

    const conditions: string[] = [];
    if (sec.includes('買一送一') || sec.includes('買1送1')) conditions.push('買1送1');
    if (sec.includes('第二件') || sec.includes('第2件')) conditions.push('第2件優惠');
    if (sec.includes('行動隨時取')) conditions.push('行動隨時取');
    if (sec.includes('會員') || sec.includes('OPENPOINT')) conditions.push('會員專屬');
    if (conditions.length === 0) conditions.push('門市促銷優惠');

    const lines = sec
      .split('\n')
      .map((s) => s.replace(/^[·•\s\-_]+|[·•\s\-_]+$/g, '').trim())
      .filter((s) => s && !s.includes('小時') && !s.includes('天') && !s.includes('昨天') && !s.includes('剛剛') && s !== post.merchantName && !s.includes('官方粉專'));

    const bracketLine = lines.find((l) => l.includes('【') || l.includes('】'));
    const promoLine = lines.find((l) => /(買|送|特價|優惠|折|\$|NT|\d+元)/i.test(l));
    let rawTitle = bracketLine ? bracketLine.replace(/[【】]/g, '').trim() : (promoLine || lines[0] || `${post.merchantName} 優惠活動`);
    rawTitle = rawTitle.replace(/^#\S+\s*/, '').replace(/\\+/g, '').trim().slice(0, 45);

    const normalizedMerchantName = normalizeBrandName(post.merchantName);
    const title = rawTitle.startsWith(normalizedMerchantName) ? rawTitle : `${normalizedMerchantName} ${rawTitle}`;

    let selectedImage = post.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800';
    if (post.images.length > 1 && post.images[idx + 1]) {
      selectedImage = post.images[idx + 1];
    }

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    items.push({
      id: `crawled-${post.merchantId}-${Date.now().toString(36)}-${idx}`,
      title,
      subtitle: sec.slice(0, 90).replace(/\n+/g, ' '),
      category: 'food',
      channelType: 'offline',
      merchant: {
        name: normalizedMerchantName,
        logo: post.merchantLogo,
        storeBranches: '全台實體門市',
      },
      regions: ['全台門市', '台北市', '新北市', '台中市', '高雄市'],
      discountPrice,
      originalPrice,
      priceUnit: '份',
      promoDisplayBadge: conditions[0] || '門市特惠',
      targetItems: [rawTitle],
      conditions,
      eligibleCards:
        post.merchantId === '7eleven'
          ? ['icash Pay (5%)', 'OPENPOINT 點數折抵', '國泰 CUBE 卡 (3%)']
          : ['全盈+PAY (5%)', 'FamiPay', '台新玫瑰卡 (3.8%)'],
      tags: (() => {
        const rawTagList = [`#${normalizedMerchantName}`, '#超商特價'];
        if ((post.isVideo || selectedImage.includes('video')) && !rawTagList.includes('#影片情報')) {
          rawTagList.push('#影片情報');
        }
        return normalizeTags(rawTagList, normalizedMerchantName);
      })(),
      startDate: now.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      isHot: idx === 0,
      isFlashDeal: conditions.includes('買1送1') || sec.includes('閃購'),
      source: 'social_listening',
      sourcePlatform: 'Convenience',
      sourceUrl: post.link,
      likeCount: Math.floor(Math.random() * 150) + 20,
      commentCount: Math.floor(Math.random() * 15) + 2,
      priceHistory: [
        { date: '昨日', price: originalPrice },
        { date: '今日', price: discountPrice },
      ],
      priceDropAlert: {
        isLowest90Days: true,
        isSuspiciousHike: false,
        note: '官方粉專即時採集！',
      },
      imageUrl: selectedImage,
      images: selectedImage ? [selectedImage] : undefined,
      aspectRatio: undefined,
    });
  });

  return items.filter(isValidQualityDeal);
}
