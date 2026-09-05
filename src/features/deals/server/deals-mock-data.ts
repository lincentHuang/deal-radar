import { SmartDeal } from '@/features/deals/types/deal.types';

/**
 * 由 Gemini Vision 進行圖片日期 OCR、均價折算與專屬圖片隔離之真實超商情報 (共 87 筆)
 */
export const INITIAL_SMART_DEALS: SmartDeal[] = [
  {
    "id": "deal-familymart-kangkang5-01",
    "title": "全家 黑松沙士 清新紅柚風味 買1送1",
    "subtitle": "清新紅柚風味沙士，5天5好康同商品買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 18,
    "originalPrice": 35,
    "priceUnit": "瓶",
    "targetItems": ["黑松沙士 清新紅柚風味"],
    "conditions": ["同商品買1送1", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#飲品", "#黑松沙士", "#買1送1"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 188,
    "commentCount": 24,
    "priceHistory": [
      { "date": "昨日", "price": 35 },
      { "date": "今日", "price": 18 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-02",
    "title": "全家 百吉 布丁大雪糕 買1送1",
    "subtitle": "百吉布丁大雪糕，5天5好康同商品買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 18,
    "originalPrice": 35,
    "priceUnit": "支",
    "targetItems": ["百吉 布丁大雪糕"],
    "conditions": ["同商品買1送1", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#冰品", "#布丁雪糕", "#買1送1"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 165,
    "commentCount": 19,
    "priceHistory": [
      { "date": "昨日", "price": 35 },
      { "date": "今日", "price": 18 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-03",
    "title": "全家 阿奇儂 極濃義式開心果雪糕 買1送1",
    "subtitle": "阿奇儂極濃義式開心果雪糕，5天5好康同商品買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 20,
    "originalPrice": 40,
    "priceUnit": "支",
    "targetItems": ["阿奇儂 極濃義式開心果雪糕"],
    "conditions": ["同商品買1送1", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#冰品", "#開心果雪糕", "#買1送1"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 210,
    "commentCount": 35,
    "priceHistory": [
      { "date": "昨日", "price": 40 },
      { "date": "今日", "price": 20 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-04",
    "title": "全家 農心 辛拉麵袋麵 買1送1",
    "subtitle": "經典農心辛拉麵袋麵，5天5好康同商品買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 25,
    "originalPrice": 49,
    "priceUnit": "包",
    "targetItems": ["農心 辛拉麵袋麵"],
    "conditions": ["同商品買1送1", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#鮮食泡麵", "#辛拉麵", "#買1送1"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 240,
    "commentCount": 42,
    "priceHistory": [
      { "date": "昨日", "price": 49 },
      { "date": "今日", "price": 25 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-05",
    "title": "全家 金萱二十七 買2送2",
    "subtitle": "金萱二十七茶飲，5天5好康買2送2",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 15,
    "originalPrice": 30,
    "priceUnit": "瓶",
    "targetItems": ["金萱二十七"],
    "conditions": ["買2送2", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#飲品", "#金萱二十七", "#買2送2"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 130,
    "commentCount": 14,
    "priceHistory": [
      { "date": "昨日", "price": 30 },
      { "date": "今日", "price": 15 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-06",
    "title": "全家 Alfie 草莓牛奶風味可可 / 原味可可 任選買1送1",
    "subtitle": "Alfie 巧克力雙口味任選買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 13,
    "originalPrice": 25,
    "priceUnit": "件",
    "targetItems": ["Alfie 草莓牛奶風味可可", "Alfie 原味可可"],
    "conditions": ["任選買1送1", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#零食甜點", "#Alfie巧克力", "#任選買1送1"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 115,
    "commentCount": 9,
    "priceHistory": [
      { "date": "昨日", "price": 25 },
      { "date": "今日", "price": 13 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-07",
    "title": "全家 特趣 焦糖餅乾巧克力 / 鹹焦糖 任選買1送1",
    "subtitle": "Twix 特趣焦糖夾心巧克力雙口味任選買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 28,
    "originalPrice": 55,
    "priceUnit": "件",
    "targetItems": ["特趣 焦糖餅乾巧克力", "特趣 焦糖夾心巧克力鹹焦糖"],
    "conditions": ["任選買1送1", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#零食甜點", "#特趣巧克力", "#任選買1送1"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 142,
    "commentCount": 16,
    "priceHistory": [
      { "date": "昨日", "price": 55 },
      { "date": "今日", "price": 28 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-08",
    "title": "全家 義美 仙草奶凍雪糕 加10元多1件",
    "subtitle": "義美仙草奶凍雪糕，加10元多1件（2件55元）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 28,
    "originalPrice": 45,
    "priceUnit": "支",
    "targetItems": ["義美 仙草奶凍雪糕"],
    "conditions": ["加10元多1件", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#冰品", "#仙草奶凍雪糕", "#加10元多1件"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 178,
    "commentCount": 21,
    "priceHistory": [
      { "date": "昨日", "price": 45 },
      { "date": "今日", "price": 28 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-09",
    "title": "全家 日清奶油三明治 第二件10元",
    "subtitle": "日清奶油三明治餅乾，第二件10元（2件55元）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 28,
    "originalPrice": 45,
    "priceUnit": "包",
    "targetItems": ["日清奶油三明治"],
    "conditions": ["第二件10元", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#零食甜點", "#日清餅乾", "#第二件10元"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 122,
    "commentCount": 8,
    "priceHistory": [
      { "date": "昨日", "price": 45 },
      { "date": "今日", "price": 28 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-10",
    "title": "全家 -196 強烈雙重檸檬 / 葡萄柚調酒 任選3件155元",
    "subtitle": "Suntory -196 調酒雙風味任選 3件155元（單罐折算$52）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 52,
    "originalPrice": 79,
    "priceUnit": "罐",
    "targetItems": ["-196 強烈雙重檸檬", "-196 強烈雙重葡萄柚"],
    "conditions": ["任選3件155元", "未滿十八歲禁止飲酒", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#飲品", "#196調酒", "#任選3件155元"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 195,
    "commentCount": 31,
    "priceHistory": [
      { "date": "昨日", "price": 79 },
      { "date": "今日", "price": 52 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-11",
    "title": "全家 Let's Café 特大杯美式/拿鐵、中單品 任選2杯95元",
    "subtitle": "Let's Café 特大杯美式/拿鐵/中單品任選2杯95元（冰熱不限）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 48,
    "originalPrice": 80,
    "priceUnit": "杯",
    "targetItems": ["特大杯美式", "特大杯拿鐵", "中單品美式", "中單品拿鐵"],
    "conditions": ["任選2杯95元", "冰熱不限", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#咖啡", "#LetsCafe", "#任選2杯95元"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 268,
    "commentCount": 45,
    "priceHistory": [
      { "date": "昨日", "price": 80 },
      { "date": "今日", "price": 48 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-12",
    "title": "全家 Let's Tea 大杯仙女醇奶茶 (冰/熱) 2杯65元",
    "subtitle": "Let's Tea 大杯仙女醇奶茶 2杯65元（單杯折算$33）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 33,
    "originalPrice": 55,
    "priceUnit": "杯",
    "targetItems": ["大杯仙女醇奶茶"],
    "conditions": ["2杯65元", "冰熱不限", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#飲品", "#仙女醇奶茶", "#2杯65元"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 182,
    "commentCount": 22,
    "priceHistory": [
      { "date": "昨日", "price": 55 },
      { "date": "今日", "price": 33 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-13",
    "title": "全家 Fami!ce 霜淇淋 (限店販售 不限口味) 2支55元",
    "subtitle": "Fami!ce 霜淇淋不限口味 2支55元（單支折算$28）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 28,
    "originalPrice": 49,
    "priceUnit": "支",
    "targetItems": ["Fami!ce 霜淇淋"],
    "conditions": ["2支55元", "限店販售", "不限口味", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#冰品", "#Famiice霜淇淋", "#2支55元"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 310,
    "commentCount": 58,
    "priceHistory": [
      { "date": "昨日", "price": 49 },
      { "date": "今日", "price": 28 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-14",
    "title": "全家 酷繽沙 65元系列酷繽沙 任選2杯75元",
    "subtitle": "全家酷繽沙 65元系列任選 2杯75元（單杯折算$38）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 38,
    "originalPrice": 65,
    "priceUnit": "杯",
    "targetItems": ["酷繽沙 65元系列酷繽沙"],
    "conditions": ["任選2杯75元", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#冰品", "#酷繽沙", "#任選2杯75元"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 164,
    "commentCount": 17,
    "priceHistory": [
      { "date": "昨日", "price": 65 },
      { "date": "今日", "price": 38 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-15",
    "title": "全家 五月花 厚棒衛生紙 (60抽x6包) 2串139元",
    "subtitle": "五月花厚棒抽取式衛生紙 60抽x6包，2串139元（單串折算$70）",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 70,
    "originalPrice": 259,
    "priceUnit": "串",
    "targetItems": ["五月花 厚棒衛生紙 60抽x6包"],
    "conditions": ["2串139元", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#生活用品", "#厚棒衛生紙", "#2串139元"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 235,
    "commentCount": 38,
    "priceHistory": [
      { "date": "昨日", "price": 259 },
      { "date": "今日", "price": 70 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-familymart-kangkang5-16",
    "title": "全家 德國原裝進口 黑麥汁原味 買1送1",
    "subtitle": "德國原裝進口黑麥汁原味，5天5好康買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": ["全台門市", "台北市", "新北市", "台中市", "高雄市"],
    "discountPrice": 23,
    "originalPrice": 45,
    "priceUnit": "瓶",
    "targetItems": ["德國原裝進口 黑麥汁原味"],
    "conditions": ["買1送1", "康康5限定"],
    "eligibleCards": ["全盈+PAY (5%)", "FamiPay", "台新玫瑰卡 (3.8%)"],
    "tags": ["#全家", "#康康5", "#飲品", "#黑麥汁", "#買1送1"],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart",
    "likeCount": 147,
    "commentCount": 12,
    "priceHistory": [
      { "date": "昨日", "price": 45 },
      { "date": "今日", "price": 23 }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "官方原圖完整高清呈現！"
    },
    "imageUrl": "/posters/familymart-kangkang5-poster.jpg",
    "images": ["/posters/familymart-kangkang5-poster.jpg"]
  },
  {
    "id": "deal-7eleven-0-0",
    "title": "7-ELEVEN 【CupiCho 丘彼巧】Amedei 艾美黛杯裝冰淇淋 (兩入組) 特價$499",
    "subtitle": "口味隨機出貨，濃醇巧韻醇濃奢享",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 499,
    "originalPrice": 660,
    "priceUnit": "組",
    "targetItems": [
      "Amedei艾美黛杯裝冰淇淋(兩入組)"
    ],
    "conditions": [
      "i預購天天閃購價",
      "口味隨機出貨"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#冰品",
      "#冰淇淋",
      "#巧克力",
      "#特價"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-08-31",
    "isHot": true,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0JbJe9bRYWWueYpprAAAg77pRvxwYVRy4wuJwdCLVySHo1ZGPL4MycPE5wn17ZEHVl?__cft__[0]=AZZzTqrtkyRp46JHFxk-toNKrohBIBlCmx6MJkAWxjLSOLv0f48U52QsgjKy5lLuHYSOCFMbRNYE7sDG7ZL0pTlmpDMvdGOGBOy35HXVzsIfkRJTSQK20UZYin90QvEm5Xxf6LuBd_SC28cNcvSz2GW__9Lz55zYLjFqybJZxsvos9JYYi0m_Z9UaWdzhU5KQvE&__tn__=%2CO%2CP-R",
    "likeCount": 156,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 660
      },
      {
        "date": "今日",
        "price": 499
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788764639_3223161454555829_9120687147641951472_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=5_5AER0kIG4Q7kNvwGfWm4I&_nc_oc=AdpNlqtXd9xURHsAZKYS2nYKzgmxHNxz0U5mI6IlTUxKbhnMFhswGSxpxgECAEMm4ec&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QL6oxxuM1jDC0dV-ST_utg&_nc_ss=7b289&oh=00_AQJQbGUOKkuHkDYn8zRDz85ecYKoKbo8oNd5eCdeEfIpLQ&oe=6A9A73A4",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788764639_3223161454555829_9120687147641951472_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=5_5AER0kIG4Q7kNvwGfWm4I&_nc_oc=AdpNlqtXd9xURHsAZKYS2nYKzgmxHNxz0U5mI6IlTUxKbhnMFhswGSxpxgECAEMm4ec&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QL6oxxuM1jDC0dV-ST_utg&_nc_ss=7b289&oh=00_AQJQbGUOKkuHkDYn8zRDz85ecYKoKbo8oNd5eCdeEfIpLQ&oe=6A9A73A4"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-0-1",
    "title": "7-ELEVEN 勝崎生鮮 澎湃海陸燒烤饗宴 (10件組) 特價$1399",
    "subtitle": "海陸超滿足 澎派開烤",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 1399,
    "originalPrice": 1990,
    "priceUnit": "組",
    "targetItems": [
      "勝崎生鮮 澎湃海陸燒烤饗宴10件組"
    ],
    "conditions": [
      "i預購天天閃購價",
      "宅配商品限本島"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#生鮮",
      "#燒烤",
      "#肉品",
      "#特價"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0JbJe9bRYWWueYpprAAAg77pRvxwYVRy4wuJwdCLVySHo1ZGPL4MycPE5wn17ZEHVl?__cft__[0]=AZZzTqrtkyRp46JHFxk-toNKrohBIBlCmx6MJkAWxjLSOLv0f48U52QsgjKy5lLuHYSOCFMbRNYE7sDG7ZL0pTlmpDMvdGOGBOy35HXVzsIfkRJTSQK20UZYin90QvEm5Xxf6LuBd_SC28cNcvSz2GW__9Lz55zYLjFqybJZxsvos9JYYi0m_Z9UaWdzhU5KQvE&__tn__=%2CO%2CP-R",
    "likeCount": 91,
    "commentCount": 10,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1990
      },
      {
        "date": "今日",
        "price": 1399
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/789612345_946137581879669_43700917787501738_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=3ljK9a0HpBoQ7kNvwGWd07g&_nc_oc=AdpURsQ0FC4v1KztqCfjiYZPjWgd6Q82UsZsQAVusfnKy48C3F1jCYY-vZGs5lKeLX4&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=QL6oxxuM1jDC0dV-ST_utg&_nc_ss=7b289&oh=00_AQKAwtjktXsQPri9in12CeNEMYRB0WcbpFlML4C9l9Zc2A&oe=6A9A65EF",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/789612345_946137581879669_43700917787501738_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=3ljK9a0HpBoQ7kNvwGWd07g&_nc_oc=AdpURsQ0FC4v1KztqCfjiYZPjWgd6Q82UsZsQAVusfnKy48C3F1jCYY-vZGs5lKeLX4&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=QL6oxxuM1jDC0dV-ST_utg&_nc_ss=7b289&oh=00_AQKAwtjktXsQPri9in12CeNEMYRB0WcbpFlML4C9l9Zc2A&oe=6A9A65EF"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-0-2",
    "title": "7-ELEVEN 花蓮鶴岡阿嬤的40年老欉文旦 (5-6顆/3kg/盒) 特價$550",
    "subtitle": "中秋御禮，阿嬤用心的滋味",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 550,
    "originalPrice": 660,
    "priceUnit": "盒",
    "targetItems": [
      "花蓮鶴岡阿嬤的40年老欉文旦"
    ],
    "conditions": [
      "i預購天天閃購價",
      "中秋必備限時限量"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#水果",
      "#文旦",
      "#中秋",
      "#特價"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0JbJe9bRYWWueYpprAAAg77pRvxwYVRy4wuJwdCLVySHo1ZGPL4MycPE5wn17ZEHVl?__cft__[0]=AZZzTqrtkyRp46JHFxk-toNKrohBIBlCmx6MJkAWxjLSOLv0f48U52QsgjKy5lLuHYSOCFMbRNYE7sDG7ZL0pTlmpDMvdGOGBOy35HXVzsIfkRJTSQK20UZYin90QvEm5Xxf6LuBd_SC28cNcvSz2GW__9Lz55zYLjFqybJZxsvos9JYYi0m_Z9UaWdzhU5KQvE&__tn__=%2CO%2CP-R",
    "likeCount": 179,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 660
      },
      {
        "date": "今日",
        "price": 550
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/788780818_4684660938523748_8572649100874468576_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=gmbyf6HbpQAQ7kNvwEBDQGz&_nc_oc=Adoy2kYr_ST1zf9tdVRjByst2VyVsCg82Q2XWjKy4z9NYRheLpE2IYXeQzmQaaeI6UI&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=QL6oxxuM1jDC0dV-ST_utg&_nc_ss=7b289&oh=00_AQLu0wA2cjIizthtj_kt7cSy7HMSj0HRFPXnvZDo84vLwA&oe=6A9A558D",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/788780818_4684660938523748_8572649100874468576_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=gmbyf6HbpQAQ7kNvwEBDQGz&_nc_oc=Adoy2kYr_ST1zf9tdVRjByst2VyVsCg82Q2XWjKy4z9NYRheLpE2IYXeQzmQaaeI6UI&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=QL6oxxuM1jDC0dV-ST_utg&_nc_ss=7b289&oh=00_AQLu0wA2cjIizthtj_kt7cSy7HMSj0HRFPXnvZDo84vLwA&oe=6A9A558D"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-1-0",
    "title": "7-ELEVEN CITY CAFE 大杯燕麥拿鐵 2杯99元",
    "subtitle": "週一限定！CITY CAFE大杯燕麥拿鐵任2杯99元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 50,
    "originalPrice": 75,
    "priceUnit": "杯",
    "targetItems": [
      "大杯燕麥拿鐵"
    ],
    "conditions": [
      "週一限定",
      "任2杯99元",
      "冰熱不限"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#咖啡",
      "#燕麥拿鐵",
      "#大杯",
      "#特價99元"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0eYbzJ2iAbtHHNsia76pKsJ1Q7Uqj4Nm5iEk5Du3djYmhwxx7aMMpaMgiWundzykvl?__cft__[0]=AZZmR_xv8N_bKH_HIG1CQbVQGXRy_vvFBCd3voOSXmfv2N6XToZCwWihZcb5BI38-6w1yV3gHKjKJwa7SNfkQyQnIfnwzodzi9PuH0wJqPoDgq73eiFkDcW4IxH_NIRKxR4lS4pm9FSEzKDBvB2hIqX4eiAh86YmcI6JpLsJlONpgT7IugKlqeC24ZskaenuQuI&__tn__=%2CO%2CP-R",
    "likeCount": 127,
    "commentCount": 18,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 75
      },
      {
        "date": "今日",
        "price": 50
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/788679648_2594665680972718_1046011559833563259_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1080x2048&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6_n1c4SB1BIQ7kNvwEOC4FE&_nc_oc=AdrDLFzvWuD6Bp6GDN6g8cAnkhsyk6Ow99o3KnbA21CoXkASP09dN4JmGL8fMwHmAy0&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQJ-k07n3nYU2Z1D7Ap0XVu03s2coNenY9A-tfJQS3vOBw&oe=6A9A6CDF",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/788679648_2594665680972718_1046011559833563259_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1080x2048&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6_n1c4SB1BIQ7kNvwEOC4FE&_nc_oc=AdrDLFzvWuD6Bp6GDN6g8cAnkhsyk6Ow99o3KnbA21CoXkASP09dN4JmGL8fMwHmAy0&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQJ-k07n3nYU2Z1D7Ap0XVu03s2coNenY9A-tfJQS3vOBw&oe=6A9A6CDF"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-0",
    "title": "博客來 花錢的藝術 (單入) 特價$379",
    "subtitle": "贈財富透析互動金句透卡",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 379,
    "originalPrice": 379,
    "priceUnit": "本",
    "targetItems": [
      "花錢的藝術"
    ],
    "conditions": [
      "贈財富透析互動金句透卡"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#博客來",
      "#圖書",
      "#理財",
      "#花錢的藝術",
      "#特價"
    ],
    "startDate": "2026-06-26",
    "endDate": "2026-09-08",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 71,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 379
      },
      {
        "date": "今日",
        "price": 379
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/787406349_1562963319207097_4755282294420990829_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=veWoqZEaxGQQ7kNvwElGbOs&_nc_oc=AdqxY3RKAuYTWl7R4Oq9ZX4Rsx49lTNxA01v2MS0FWfJFSdZfIw_gsyguN-J3vtfeA0&_nc_zt=23&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIfaQ6Jb1K3X9Gs4MJnY4dg01_jVnZCW63V81o_1Ke9Nw&oe=6A9A4B38",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/787406349_1562963319207097_4755282294420990829_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=veWoqZEaxGQQ7kNvwElGbOs&_nc_oc=AdqxY3RKAuYTWl7R4Oq9ZX4Rsx49lTNxA01v2MS0FWfJFSdZfIw_gsyguN-J3vtfeA0&_nc_zt=23&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIfaQ6Jb1K3X9Gs4MJnY4dg01_jVnZCW63V81o_1Ke9Nw&oe=6A9A4B38"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-1",
    "title": "博客來 張開的手 (單入) 特價$434",
    "subtitle": "贈順風自在葉籤貼",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 434,
    "originalPrice": 434,
    "priceUnit": "本",
    "targetItems": [
      "張開的手"
    ],
    "conditions": [
      "贈順風自在葉籤貼"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#博客來",
      "#圖書",
      "#文學",
      "#張開的手",
      "#特價"
    ],
    "startDate": "2026-06-26",
    "endDate": "2026-09-08",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 159,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 434
      },
      {
        "date": "今日",
        "price": 434
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/787406349_1562963319207097_4755282294420990829_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=veWoqZEaxGQQ7kNvwElGbOs&_nc_oc=AdqxY3RKAuYTWl7R4Oq9ZX4Rsx49lTNxA01v2MS0FWfJFSdZfIw_gsyguN-J3vtfeA0&_nc_zt=23&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIfaQ6Jb1K3X9Gs4MJnY4dg01_jVnZCW63V81o_1Ke9Nw&oe=6A9A4B38",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/787406349_1562963319207097_4755282294420990829_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=veWoqZEaxGQQ7kNvwElGbOs&_nc_oc=AdqxY3RKAuYTWl7R4Oq9ZX4Rsx49lTNxA01v2MS0FWfJFSdZfIw_gsyguN-J3vtfeA0&_nc_zt=23&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIfaQ6Jb1K3X9Gs4MJnY4dg01_jVnZCW63V81o_1Ke9Nw&oe=6A9A4B38"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-2",
    "title": "聖德科斯 黃金嫩肩肉 (200g/包) 第2件4折",
    "subtitle": "土雞胸處的珍稀嫩肉，每隻雞只取2塊肉",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 149,
    "originalPrice": 199,
    "priceUnit": "包",
    "targetItems": [
      "黃金嫩肩肉"
    ],
    "conditions": [
      "第2件4折"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#聖德科斯",
      "#生鮮",
      "#雞肉",
      "#黃金嫩肩肉",
      "#第2件4折"
    ],
    "startDate": "2026-01-01",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 186,
    "commentCount": 3,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 199
      },
      {
        "date": "今日",
        "price": 149
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789216522_1094742299569140_8798971637984306224_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q3OS0-tnC9EQ7kNvwHIdFdL&_nc_oc=AdoGgLt8TPhq7omkgNDxU1VvnqxCLVF1cwVZjlp-fFOntVc9YbIgz109MuQ6EnYJRMk&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIR1G3ePz420lYTWf31Ed0V8GahGJ6AvusHRd3JJdsN8g&oe=6A9A6391",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789216522_1094742299569140_8798971637984306224_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q3OS0-tnC9EQ7kNvwHIdFdL&_nc_oc=AdoGgLt8TPhq7omkgNDxU1VvnqxCLVF1cwVZjlp-fFOntVc9YbIgz109MuQ6EnYJRMk&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIR1G3ePz420lYTWf31Ed0V8GahGJ6AvusHRd3JJdsN8g&oe=6A9A6391"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-3",
    "title": "聖德科斯 梅花嫩芯 (220g/盒) 第2件6折",
    "subtitle": "豬梅花精選嫩肉精華，油花細膩鮮嫩多汁",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 259,
    "originalPrice": 299,
    "priceUnit": "盒",
    "targetItems": [
      "梅花嫩芯"
    ],
    "conditions": [
      "第2件6折"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#聖德科斯",
      "#生鮮",
      "#豬肉",
      "#梅花嫩芯",
      "#第2件6折"
    ],
    "startDate": "2026-01-01",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 204,
    "commentCount": 4,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 299
      },
      {
        "date": "今日",
        "price": 259
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789216522_1094742299569140_8798971637984306224_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q3OS0-tnC9EQ7kNvwHIdFdL&_nc_oc=AdoGgLt8TPhq7omkgNDxU1VvnqxCLVF1cwVZjlp-fFOntVc9YbIgz109MuQ6EnYJRMk&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIR1G3ePz420lYTWf31Ed0V8GahGJ6AvusHRd3JJdsN8g&oe=6A9A6391",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789216522_1094742299569140_8798971637984306224_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q3OS0-tnC9EQ7kNvwHIdFdL&_nc_oc=AdoGgLt8TPhq7omkgNDxU1VvnqxCLVF1cwVZjlp-fFOntVc9YbIgz109MuQ6EnYJRMk&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIR1G3ePz420lYTWf31Ed0V8GahGJ6AvusHRd3JJdsN8g&oe=6A9A6391"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-4",
    "title": "COLD STONE 狗狗好友萌中秋禮盒 (9入組) 早鳥優惠72折起",
    "subtitle": "中秋禮盒早鳥優惠72折起",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 1380,
    "originalPrice": 1380,
    "priceUnit": "盒",
    "targetItems": [
      "狗狗好友萌中秋禮盒"
    ],
    "conditions": [
      "早鳥優惠72折起",
      "商品須冷凍"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#COLD STONE",
      "#冰淇淋",
      "#中秋禮盒",
      "#狗狗好友萌中秋禮盒",
      "#早鳥優惠"
    ],
    "startDate": "2026-01-01",
    "endDate": "2026-09-07",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 96,
    "commentCount": 21,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1380
      },
      {
        "date": "今日",
        "price": 1380
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790591027_1420462380006339_3256447394285293315_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LBuC5my8zT0Q7kNvwGH4aM2&_nc_oc=AdrD-POa5yo4JrCrGr6esQAyuNsa4PG53-kjrIaM4EqaOaY_lvLIG6ltfXVVwDlQvU4&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQKx4EO99mQmOM7H65QpxcfVHecGGXkiWQIQb69ld0H39w&oe=6A9A4A92",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790591027_1420462380006339_3256447394285293315_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LBuC5my8zT0Q7kNvwGH4aM2&_nc_oc=AdrD-POa5yo4JrCrGr6esQAyuNsa4PG53-kjrIaM4EqaOaY_lvLIG6ltfXVVwDlQvU4&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQKx4EO99mQmOM7H65QpxcfVHecGGXkiWQIQb69ld0H39w&oe=6A9A4A92"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-5",
    "title": "7-ELEVEN CITY PRIMA 精品美式 (大杯) 買2送2",
    "subtitle": "探索果香新層次，日曬咖啡豆比例提升20%",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 50,
    "originalPrice": 100,
    "priceUnit": "杯",
    "targetItems": [
      "大杯精品美式"
    ],
    "conditions": [
      "大杯同品項買2送2",
      "冰熱不限"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#咖啡",
      "#精品美式",
      "#花香耶加雪菲",
      "#大杯",
      "#買2送2"
    ],
    "startDate": "2026-09-01",
    "endDate": "2026-09-30",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 65,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 100
      },
      {
        "date": "今日",
        "price": 50
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785363264_2324118561454916_3116088726027959654_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q0lbhxl8JrwQ7kNvwGsbv3C&_nc_oc=Ado6pU2scPaifdP3pEd0zlMzaVzyLPSGjdlhvz4YKk3bJht77vrdW-G1LrMudL8RPYw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIWhEUTt9V6ftpjuX2K1XEr-ynn52iph6iyn-p2ywT_Iw&oe=6A9A7D3E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785363264_2324118561454916_3116088726027959654_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q0lbhxl8JrwQ7kNvwGsbv3C&_nc_oc=Ado6pU2scPaifdP3pEd0zlMzaVzyLPSGjdlhvz4YKk3bJht77vrdW-G1LrMudL8RPYw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIWhEUTt9V6ftpjuX2K1XEr-ynn52iph6iyn-p2ywT_Iw&oe=6A9A7D3E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-6",
    "title": "7-ELEVEN CITY PRIMA 精品拿鐵 (大杯) 買2送1",
    "subtitle": "探索果香新層次，日曬咖啡豆比例提升20%",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 73,
    "originalPrice": 110,
    "priceUnit": "杯",
    "targetItems": [
      "大杯精品拿鐵"
    ],
    "conditions": [
      "大杯同品項買2送1",
      "冰熱不限"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#咖啡",
      "#精品拿鐵",
      "#花香耶加雪菲",
      "#大杯",
      "#買2送1"
    ],
    "startDate": "2026-09-01",
    "endDate": "2026-09-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 149,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 110
      },
      {
        "date": "今日",
        "price": 73
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785363264_2324118561454916_3116088726027959654_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q0lbhxl8JrwQ7kNvwGsbv3C&_nc_oc=Ado6pU2scPaifdP3pEd0zlMzaVzyLPSGjdlhvz4YKk3bJht77vrdW-G1LrMudL8RPYw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIWhEUTt9V6ftpjuX2K1XEr-ynn52iph6iyn-p2ywT_Iw&oe=6A9A7D3E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785363264_2324118561454916_3116088726027959654_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q0lbhxl8JrwQ7kNvwGsbv3C&_nc_oc=Ado6pU2scPaifdP3pEd0zlMzaVzyLPSGjdlhvz4YKk3bJht77vrdW-G1LrMudL8RPYw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIWhEUTt9V6ftpjuX2K1XEr-ynn52iph6iyn-p2ywT_Iw&oe=6A9A7D3E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-2-7",
    "title": "7-ELEVEN CITY PRIMA 精品馥芮白 (大杯) 買2送1",
    "subtitle": "探索果香新層次，日曬咖啡豆比例提升20%",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 80,
    "originalPrice": 120,
    "priceUnit": "杯",
    "targetItems": [
      "大杯精品馥芮白"
    ],
    "conditions": [
      "大杯同品項買2送1",
      "冰熱不限"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#咖啡",
      "#精品馥芮白",
      "#花香耶加雪菲",
      "#大杯",
      "#買2送1"
    ],
    "startDate": "2026-09-01",
    "endDate": "2026-09-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid0Xuy1VUB2iyiC2bCmTXNLuuBEJmqzr4fPbB3ztBnftWsqujnvQ2XtUqYugtPL5sjEl?__cft__[0]=AZYoWn1M86ZTgYSOG2AHVJOpUO0dqhfBk8HZWaYr7s6HBzVxLa-jRUkq-jMBCuaGY3pf4Vqtxu9CI8WgyXA0Y9lwVVoxCYaeLKjICM1KhPeETrDVSQuDhvMKnFj8aYUrN-WshJXK27DxZDWfAfKdRpQzlBFg3s-OEbp8mwVXMsscslpbz8e629VJYBZslk30SrI&__tn__=%2CO%2CP-R",
    "likeCount": 68,
    "commentCount": 7,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 120
      },
      {
        "date": "今日",
        "price": 80
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785363264_2324118561454916_3116088726027959654_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q0lbhxl8JrwQ7kNvwGsbv3C&_nc_oc=Ado6pU2scPaifdP3pEd0zlMzaVzyLPSGjdlhvz4YKk3bJht77vrdW-G1LrMudL8RPYw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIWhEUTt9V6ftpjuX2K1XEr-ynn52iph6iyn-p2ywT_Iw&oe=6A9A7D3E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785363264_2324118561454916_3116088726027959654_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q0lbhxl8JrwQ7kNvwGsbv3C&_nc_oc=Ado6pU2scPaifdP3pEd0zlMzaVzyLPSGjdlhvz4YKk3bJht77vrdW-G1LrMudL8RPYw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQIWhEUTt9V6ftpjuX2K1XEr-ynn52iph6iyn-p2ywT_Iw&oe=6A9A7D3E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-3-0",
    "title": "7-ELEVEN BEAMS DESIGN 潮旅登機箱 + CITY PRIMA 大杯精品美式特價$1980",
    "subtitle": "uniopen PRIMA 訂閱會員專屬預購，潮旅登機箱加大杯精品美式限時特價",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 1980,
    "originalPrice": 1980,
    "priceUnit": "組",
    "targetItems": [
      "潮旅登機箱",
      "大杯精品美式"
    ],
    "conditions": [
      "訂閱會員每人每款限購1組",
      "限量100組"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#BEAMS DESIGN",
      "#登機箱",
      "#咖啡",
      "#會員專屬"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-09-02",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02RTA2Eh2M8McKzEuo5tNf4fbDhhcRDZzHoXatS3ReTKEmxa9KAELcxBbxET3QRuWwl?__cft__[0]=AZaAO2O5NVRXQ8hCIKkAzDk0_wUVqlELQjJVIjN0B_OWzzn973K10rfDiq8c7251KxLMkv3DNu4a92Sk1ufgId6PdiEsa_4JVK925njPdHY-R-w5p5KjypSbajBwX1QeKqGrUOOXQEQHbYGeT9Me_fWee7ilcstY5CLe3UNOb48ZCxw4uVbm_3QV9tdPevi0iAw&__tn__=%2CO%2CP-R",
    "likeCount": 178,
    "commentCount": 6,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1980
      },
      {
        "date": "今日",
        "price": 1980
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789959603_1346026950633509_5901178146735911458_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FzGMX4cCJEoQ7kNvwGkzicZ&_nc_oc=Adp9m8DTZyKk96sfYe_9FdmrZ8vFAao3kc0NJlz2PbMTZPCTIgCaxjLKZlFL4GIN-yw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQLPftF2sq5Ma_-hXFOFXh9kqiffgpgJ2BYtn1O5Vd_dRA&oe=6A9A5BDC",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789959603_1346026950633509_5901178146735911458_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FzGMX4cCJEoQ7kNvwGkzicZ&_nc_oc=Adp9m8DTZyKk96sfYe_9FdmrZ8vFAao3kc0NJlz2PbMTZPCTIgCaxjLKZlFL4GIN-yw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQLPftF2sq5Ma_-hXFOFXh9kqiffgpgJ2BYtn1O5Vd_dRA&oe=6A9A5BDC"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-3-1",
    "title": "7-ELEVEN BEAMS DESIGN 隨拍迷你相機 + CITY PRIMA 大杯精品美式特價$999",
    "subtitle": "uniopen PRIMA 訂閱會員專屬預購，隨拍迷你相機加大杯精品美式限時特價",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 999,
    "originalPrice": 999,
    "priceUnit": "組",
    "targetItems": [
      "隨拍迷你相機",
      "大杯精品美式"
    ],
    "conditions": [
      "訂閱會員每人每款限購1組",
      "限量100組"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#BEAMS DESIGN",
      "#迷你相機",
      "#咖啡",
      "#會員專屬"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-09-02",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02RTA2Eh2M8McKzEuo5tNf4fbDhhcRDZzHoXatS3ReTKEmxa9KAELcxBbxET3QRuWwl?__cft__[0]=AZaAO2O5NVRXQ8hCIKkAzDk0_wUVqlELQjJVIjN0B_OWzzn973K10rfDiq8c7251KxLMkv3DNu4a92Sk1ufgId6PdiEsa_4JVK925njPdHY-R-w5p5KjypSbajBwX1QeKqGrUOOXQEQHbYGeT9Me_fWee7ilcstY5CLe3UNOb48ZCxw4uVbm_3QV9tdPevi0iAw&__tn__=%2CO%2CP-R",
    "likeCount": 161,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 999
      },
      {
        "date": "今日",
        "price": 999
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789426422_1006957072375788_2546423574522120062_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=TMJxGTp6qVAQ7kNvwH5Cmr6&_nc_oc=Adqr3gR-gXNDIV7DArkNRwDsewSa2iDTECykepkYr-f2024Hz9Hi1DZhuUh08tjdvYY&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQLIhLvHVYe6dK31U1GkRGl7YU2T7zXkkf7OMwwQyL0ZRw&oe=6A9A58A4",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789426422_1006957072375788_2546423574522120062_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=TMJxGTp6qVAQ7kNvwH5Cmr6&_nc_oc=Adqr3gR-gXNDIV7DArkNRwDsewSa2iDTECykepkYr-f2024Hz9Hi1DZhuUh08tjdvYY&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rytAA4Pt7aSwwEi4DNUrcg&_nc_ss=7b289&oh=00_AQLIhLvHVYe6dK31U1GkRGl7YU2T7zXkkf7OMwwQyL0ZRw&oe=6A9A58A4"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-4-0",
    "title": "7-ELEVEN satana Soldier 證件零錢包 (共3款) 加價購$699",
    "subtitle": "極輕量防潑水證件套，6點+699元/款",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 699,
    "originalPrice": 980,
    "priceUnit": "個",
    "targetItems": [
      "satana Soldier 證件零錢包"
    ],
    "conditions": [
      "6點加價購",
      "門市快閃購或小7集點卡"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#satana",
      "#證件零錢包",
      "#防潑水",
      "#加價購"
    ],
    "startDate": "2026-09-03",
    "endDate": "2026-11-03",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02gGriErf7R2ZW5nGbCYAMF7o7BYfD4nLKsFdGnEpaDyXFnfeBw8Ha8FcTpAW47sspl?__cft__[0]=AZb7cxco1bemJuHwlTVPiTtRYV4SQogriuOpAFHOrmPJXQe1g7MgsXygT6dDc4gqsnoLg3rdOHfKp2t8hscc5-dlTG1QrZJ4QmSL8f8VqMyQbDHgWZp8JNqX0elZl3HmV0NCxPic-zlX61BxPeyGEF-w2cCEoozsuliW0zH7aPMZ7eBiuSpGsysCl008jY-JPl8&__tn__=%2CO%2CP-R",
    "likeCount": 117,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 980
      },
      {
        "date": "今日",
        "price": 699
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788047043_1071681968667122_6881207533161526766_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oXe9cGG0G7MQ7kNvwGByirB&_nc_oc=AdpbQJsiLX7vSXMQzMzc96DVM5L8m7_aorIPB3-iRBG7Ocqmq2-an1RlGEV93xUqqWo&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKTpbCvjqD6bkV8e86rG4qlbL4FhnQlgPJfs227cbEzHA&oe=6A9A7CAD",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788047043_1071681968667122_6881207533161526766_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oXe9cGG0G7MQ7kNvwGByirB&_nc_oc=AdpbQJsiLX7vSXMQzMzc96DVM5L8m7_aorIPB3-iRBG7Ocqmq2-an1RlGEV93xUqqWo&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKTpbCvjqD6bkV8e86rG4qlbL4FhnQlgPJfs227cbEzHA&oe=6A9A7CAD"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-4-1",
    "title": "7-ELEVEN satana Soldier 可掛式折疊盥洗包 (共2款) 加價購$699",
    "subtitle": "極輕量防潑水、多功能收納空間、附掛勾設計，6點+699元/款",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 699,
    "originalPrice": 1300,
    "priceUnit": "個",
    "targetItems": [
      "satana Soldier 可掛式折疊盥洗包"
    ],
    "conditions": [
      "6點加價購",
      "門市快閃購或小7集點卡"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#satana",
      "#盥洗包",
      "#收納",
      "#加價購"
    ],
    "startDate": "2026-09-03",
    "endDate": "2026-11-03",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02gGriErf7R2ZW5nGbCYAMF7o7BYfD4nLKsFdGnEpaDyXFnfeBw8Ha8FcTpAW47sspl?__cft__[0]=AZb7cxco1bemJuHwlTVPiTtRYV4SQogriuOpAFHOrmPJXQe1g7MgsXygT6dDc4gqsnoLg3rdOHfKp2t8hscc5-dlTG1QrZJ4QmSL8f8VqMyQbDHgWZp8JNqX0elZl3HmV0NCxPic-zlX61BxPeyGEF-w2cCEoozsuliW0zH7aPMZ7eBiuSpGsysCl008jY-JPl8&__tn__=%2CO%2CP-R",
    "likeCount": 181,
    "commentCount": 5,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1300
      },
      {
        "date": "今日",
        "price": 699
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788047043_1071681968667122_6881207533161526766_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oXe9cGG0G7MQ7kNvwGByirB&_nc_oc=AdpbQJsiLX7vSXMQzMzc96DVM5L8m7_aorIPB3-iRBG7Ocqmq2-an1RlGEV93xUqqWo&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKTpbCvjqD6bkV8e86rG4qlbL4FhnQlgPJfs227cbEzHA&oe=6A9A7CAD",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788047043_1071681968667122_6881207533161526766_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oXe9cGG0G7MQ7kNvwGByirB&_nc_oc=AdpbQJsiLX7vSXMQzMzc96DVM5L8m7_aorIPB3-iRBG7Ocqmq2-an1RlGEV93xUqqWo&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKTpbCvjqD6bkV8e86rG4qlbL4FhnQlgPJfs227cbEzHA&oe=6A9A7CAD"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-4-2",
    "title": "7-ELEVEN satana Soldier 折疊托特包&購物袋 (共3款) 加價購$799",
    "subtitle": "可折疊托特購物袋，可放14吋筆電、A4文件，6點+799元/款",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 799,
    "originalPrice": 2000,
    "priceUnit": "個",
    "targetItems": [
      "satana Soldier 折疊托特包＆購物袋"
    ],
    "conditions": [
      "6點加價購",
      "門市快閃購或小7集點卡"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#satana",
      "#托特包",
      "#購物袋",
      "#加價購"
    ],
    "startDate": "2026-09-03",
    "endDate": "2026-11-03",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02gGriErf7R2ZW5nGbCYAMF7o7BYfD4nLKsFdGnEpaDyXFnfeBw8Ha8FcTpAW47sspl?__cft__[0]=AZb7cxco1bemJuHwlTVPiTtRYV4SQogriuOpAFHOrmPJXQe1g7MgsXygT6dDc4gqsnoLg3rdOHfKp2t8hscc5-dlTG1QrZJ4QmSL8f8VqMyQbDHgWZp8JNqX0elZl3HmV0NCxPic-zlX61BxPeyGEF-w2cCEoozsuliW0zH7aPMZ7eBiuSpGsysCl008jY-JPl8&__tn__=%2CO%2CP-R",
    "likeCount": 57,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 2000
      },
      {
        "date": "今日",
        "price": 799
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787701806_1019022517759842_4016785300682981975_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BJAspoc1lhQQ7kNvwFrU89Q&_nc_oc=AdpQNy2rKZk-W1-O9kHCbJL4MB4DRRERfK_Z1RXqShDYaB3cV2oJU9SmyeMdv6YVcCI&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKcmrBLhQQMAGB2SmMj8BlxoZ3bDE5DsvOST5RZDnrDsw&oe=6A9A6733",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787701806_1019022517759842_4016785300682981975_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BJAspoc1lhQQ7kNvwFrU89Q&_nc_oc=AdpQNy2rKZk-W1-O9kHCbJL4MB4DRRERfK_Z1RXqShDYaB3cV2oJU9SmyeMdv6YVcCI&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKcmrBLhQQMAGB2SmMj8BlxoZ3bDE5DsvOST5RZDnrDsw&oe=6A9A6733"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-4-3",
    "title": "7-ELEVEN satana Re:Play 直式手機斜背包 (共2款) 加價購$1499",
    "subtitle": "雙主袋設計，可放6.9吋手機、護照、短夾，6點+1499元/款",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 1499,
    "originalPrice": 2200,
    "priceUnit": "個",
    "targetItems": [
      "satana Re:Play 直式手機斜背包"
    ],
    "conditions": [
      "6點加價購",
      "門市快閃購或小7集點卡"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#satana",
      "#手機斜背包",
      "#斜背包",
      "#加價購"
    ],
    "startDate": "2026-09-03",
    "endDate": "2026-11-03",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02gGriErf7R2ZW5nGbCYAMF7o7BYfD4nLKsFdGnEpaDyXFnfeBw8Ha8FcTpAW47sspl?__cft__[0]=AZb7cxco1bemJuHwlTVPiTtRYV4SQogriuOpAFHOrmPJXQe1g7MgsXygT6dDc4gqsnoLg3rdOHfKp2t8hscc5-dlTG1QrZJ4QmSL8f8VqMyQbDHgWZp8JNqX0elZl3HmV0NCxPic-zlX61BxPeyGEF-w2cCEoozsuliW0zH7aPMZ7eBiuSpGsysCl008jY-JPl8&__tn__=%2CO%2CP-R",
    "likeCount": 141,
    "commentCount": 5,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 2200
      },
      {
        "date": "今日",
        "price": 1499
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787701806_1019022517759842_4016785300682981975_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BJAspoc1lhQQ7kNvwFrU89Q&_nc_oc=AdpQNy2rKZk-W1-O9kHCbJL4MB4DRRERfK_Z1RXqShDYaB3cV2oJU9SmyeMdv6YVcCI&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKcmrBLhQQMAGB2SmMj8BlxoZ3bDE5DsvOST5RZDnrDsw&oe=6A9A6733",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787701806_1019022517759842_4016785300682981975_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BJAspoc1lhQQ7kNvwFrU89Q&_nc_oc=AdpQNy2rKZk-W1-O9kHCbJL4MB4DRRERfK_Z1RXqShDYaB3cV2oJU9SmyeMdv6YVcCI&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQKcmrBLhQQMAGB2SmMj8BlxoZ3bDE5DsvOST5RZDnrDsw&oe=6A9A6733"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-4-4",
    "title": "7-ELEVEN satana Soldier 趣遊戶外斜背包 (共2款) 加價購$899",
    "subtitle": "主袋可放A5文件、長夾，粉嫩輕透格紋mono紗拼接設計，6點+899元/款",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 899,
    "originalPrice": 1800,
    "priceUnit": "個",
    "targetItems": [
      "satana Soldier 趣遊戶外斜背包"
    ],
    "conditions": [
      "6點加價購",
      "門市快閃購或小7集點卡"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#satana",
      "#戶外斜背包",
      "#斜背包",
      "#加價購"
    ],
    "startDate": "2026-09-03",
    "endDate": "2026-11-03",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02gGriErf7R2ZW5nGbCYAMF7o7BYfD4nLKsFdGnEpaDyXFnfeBw8Ha8FcTpAW47sspl?__cft__[0]=AZb7cxco1bemJuHwlTVPiTtRYV4SQogriuOpAFHOrmPJXQe1g7MgsXygT6dDc4gqsnoLg3rdOHfKp2t8hscc5-dlTG1QrZJ4QmSL8f8VqMyQbDHgWZp8JNqX0elZl3HmV0NCxPic-zlX61BxPeyGEF-w2cCEoozsuliW0zH7aPMZ7eBiuSpGsysCl008jY-JPl8&__tn__=%2CO%2CP-R",
    "likeCount": 166,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1800
      },
      {
        "date": "今日",
        "price": 899
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788348984_1043628921892169_7912526202025014076_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=27N1E1SuunMQ7kNvwHYFNTB&_nc_oc=AdoGst2AdnawML178fSdDbCbwz_gE6RIPfBP3u2EkT-Z9lHbYoD6JXZ4cdIj6Qxg_7k&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQLUdsfXQ1NSVuf1SbsM3LykrpJjwcP0LT178--6Vd-UBw&oe=6A9A6191",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788348984_1043628921892169_7912526202025014076_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=27N1E1SuunMQ7kNvwHYFNTB&_nc_oc=AdoGst2AdnawML178fSdDbCbwz_gE6RIPfBP3u2EkT-Z9lHbYoD6JXZ4cdIj6Qxg_7k&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQLUdsfXQ1NSVuf1SbsM3LykrpJjwcP0LT178--6Vd-UBw&oe=6A9A6191"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-7eleven-4-5",
    "title": "7-ELEVEN satana Soldier 折疊旅行袋 27L (共4款) 加價購$1899",
    "subtitle": "可折疊成手掌大小，超輕量防潑水尼龍，6點+1899元/款",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "7-ELEVEN",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 1899,
    "originalPrice": 3200,
    "priceUnit": "個",
    "targetItems": [
      "satana Soldier 折疊旅行袋 27L"
    ],
    "conditions": [
      "6點加價購",
      "門市快閃購或小7集點卡"
    ],
    "eligibleCards": [
      "icash Pay (5%)",
      "OPENPOINT 點數折抵",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#7-ELEVEN",
      "#satana",
      "#折疊旅行袋",
      "#旅行袋",
      "#加價購"
    ],
    "startDate": "2026-09-03",
    "endDate": "2026-11-03",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/711open/posts/pfbid02gGriErf7R2ZW5nGbCYAMF7o7BYfD4nLKsFdGnEpaDyXFnfeBw8Ha8FcTpAW47sspl?__cft__[0]=AZb7cxco1bemJuHwlTVPiTtRYV4SQogriuOpAFHOrmPJXQe1g7MgsXygT6dDc4gqsnoLg3rdOHfKp2t8hscc5-dlTG1QrZJ4QmSL8f8VqMyQbDHgWZp8JNqX0elZl3HmV0NCxPic-zlX61BxPeyGEF-w2cCEoozsuliW0zH7aPMZ7eBiuSpGsysCl008jY-JPl8&__tn__=%2CO%2CP-R",
    "likeCount": 194,
    "commentCount": 13,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 3200
      },
      {
        "date": "今日",
        "price": 1899
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788348984_1043628921892169_7912526202025014076_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=27N1E1SuunMQ7kNvwHYFNTB&_nc_oc=AdoGst2AdnawML178fSdDbCbwz_gE6RIPfBP3u2EkT-Z9lHbYoD6JXZ4cdIj6Qxg_7k&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQLUdsfXQ1NSVuf1SbsM3LykrpJjwcP0LT178--6Vd-UBw&oe=6A9A6191",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788348984_1043628921892169_7912526202025014076_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=27N1E1SuunMQ7kNvwHYFNTB&_nc_oc=AdoGst2AdnawML178fSdDbCbwz_gE6RIPfBP3u2EkT-Z9lHbYoD6JXZ4cdIj6Qxg_7k&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Y2YERhOja3j7UNK2Dmjjsw&_nc_ss=7b289&oh=00_AQLUdsfXQ1NSVuf1SbsM3LykrpJjwcP0LT178--6Vd-UBw&oe=6A9A6191"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-0-0",
    "title": "FamiCollection 雪山天然深層礦泉水 6300ml 特價$49",
    "subtitle": "經3000萬年前形成的石英岩層過濾，來自291公尺深含水層的礦泉水",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 60,
    "priceUnit": "瓶",
    "targetItems": [
      "雪山天然深層礦泉水 6300ml"
    ],
    "conditions": [
      "特價$49/瓶"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#FamiCollection",
      "#礦泉水",
      "#6300ml",
      "#特價"
    ],
    "startDate": "2026-08-19",
    "endDate": "2026-09-29",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid034Enzeye8r3UpPFMwfYeaw4LjH9uyDbE8vWdSrnyXhHcLsbhTnnNA31YBnQVuhVhpl?__cft__[0]=AZb5Sj2bFZEIiUMAa_80UweXZYNTOE3jCuDAAOgn7K7zgvfqDVvPIs5s4EsC5F4m61ZgZY-CE3loGR0qVq_C_I-IWgL2qb3YIiXAhUfEXIE8ElnEKBlX-QPqmqvkPBKx7SWDROpm1EUTt_x4_uVHRxZa_PIHQ5_lLrzygmL8Qu72qzqHvY5sZYIdeuEkFHGIFb8&__tn__=%2CO%2CP-R",
    "likeCount": 41,
    "commentCount": 18,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790440106_28472144315743555_1899650458524129035_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=MfBpbk9UanAQ7kNvwFoBfPt&_nc_oc=AdoO99cF-1bNsm3VgeSfmdRgm0IS30zLc8GC5on4kR9p1PVqpZbMesa-8vBkRURP1E0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=zAadGfqdT5MR-AETTzwBjg&_nc_ss=7b289&oh=00_AQLSwUYkNg-7KKv7peTT1PDiQhZobljuJmpVa_9lIWeTZw&oe=6A9A7AAA",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790440106_28472144315743555_1899650458524129035_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=MfBpbk9UanAQ7kNvwFoBfPt&_nc_oc=AdoO99cF-1bNsm3VgeSfmdRgm0IS30zLc8GC5on4kR9p1PVqpZbMesa-8vBkRURP1E0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=zAadGfqdT5MR-AETTzwBjg&_nc_ss=7b289&oh=00_AQLSwUYkNg-7KKv7peTT1PDiQhZobljuJmpVa_9lIWeTZw&oe=6A9A7AAA"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-2-0",
    "title": "全家 艾絲樂小兔 - 雙人餐盤6件組 特價$399",
    "subtitle": "內含2盤+2碗+2湯匙，實用組合，微波、冰箱、洗碗機都能使用",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 399,
    "originalPrice": 1099,
    "priceUnit": "組",
    "targetItems": [
      "艾絲樂小兔 - 雙人餐盤6件組"
    ],
    "conditions": [
      "全家刷就購",
      "限量預購"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#艾絲樂小兔",
      "#餐具",
      "#雙人餐盤6件組",
      "#特價"
    ],
    "startDate": "2026-08-24",
    "endDate": "2026-09-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02Rc7QC5GmR1XAvPub9pQkZGq635va2LpMkEspmb7YBAYtRoVt4VmiGKrCVsADy3Wol?__cft__[0]=AZa2pFHLWKZeL3HoI_wOaeCWhCKuBTC8Mn529whMN2IklubQkDUQYfM-ejhrSnIQeweCjTSNP8X0xyC8PHxYRgwkZ7vL2p57EwIkGT7C9fSPeR9NCQmAuRZmGaG52S9kQmp87dCABoCU5lC5lrp3tEs72aQVtki8vzJ-4qPa1TZM021wHNymuKA2AiSqbh0HeIw&__tn__=%2CO%2CP-R",
    "likeCount": 205,
    "commentCount": 15,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1099
      },
      {
        "date": "今日",
        "price": 399
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787046609_1116282554088277_5141180069359707001_n.png?stp=dst-jpg_tt6&cstp=mx747x933&ctp=s747x933&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LlKAeE48C0sQ7kNvwHW9XB7&_nc_oc=AdqwuXIs3IZeIixewJM4ENsWK1Yp1ZiBjNr3IWh-QvVfoe6uBdxvXvsS5fjLtOike8M&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLBy0IwfsW8T5FjvD0CTFugxFeXiDBHK9g-RrcMraHBlQ&oe=6A9A4DE2",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787046609_1116282554088277_5141180069359707001_n.png?stp=dst-jpg_tt6&cstp=mx747x933&ctp=s747x933&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LlKAeE48C0sQ7kNvwHW9XB7&_nc_oc=AdqwuXIs3IZeIixewJM4ENsWK1Yp1ZiBjNr3IWh-QvVfoe6uBdxvXvsS5fjLtOike8M&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLBy0IwfsW8T5FjvD0CTFugxFeXiDBHK9g-RrcMraHBlQ&oe=6A9A4DE2"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-2-1",
    "title": "全家 艾絲樂小兔 - 冰絲懶骨頭椅 特價$599",
    "subtitle": "冰絲透氣材質，坐起來清爽不悶熱，躺著、坐著、抱著任何角度都舒適",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 599,
    "originalPrice": 1999,
    "priceUnit": "個",
    "targetItems": [
      "艾絲樂小兔 - 冰絲懶骨頭椅"
    ],
    "conditions": [
      "全家刷就購",
      "限量預購"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#艾絲樂小兔",
      "#居家生活",
      "#冰絲懶骨頭椅",
      "#特價"
    ],
    "startDate": "2026-08-24",
    "endDate": "2026-09-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02Rc7QC5GmR1XAvPub9pQkZGq635va2LpMkEspmb7YBAYtRoVt4VmiGKrCVsADy3Wol?__cft__[0]=AZa2pFHLWKZeL3HoI_wOaeCWhCKuBTC8Mn529whMN2IklubQkDUQYfM-ejhrSnIQeweCjTSNP8X0xyC8PHxYRgwkZ7vL2p57EwIkGT7C9fSPeR9NCQmAuRZmGaG52S9kQmp87dCABoCU5lC5lrp3tEs72aQVtki8vzJ-4qPa1TZM021wHNymuKA2AiSqbh0HeIw&__tn__=%2CO%2CP-R",
    "likeCount": 228,
    "commentCount": 12,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1999
      },
      {
        "date": "今日",
        "price": 599
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788348737_2633034060514245_6512760184501835544_n.png?stp=dst-jpg_tt6&cstp=mx626x782&ctp=s626x782&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ZqCRPntPdAIQ7kNvwFseNyZ&_nc_oc=Adrygb00SCsyll1CbTXMgar2MLaGSAyY59RwLf797hZpS-znAq9cRHA8yfr3Jo61WOw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQI4t7Xyw5NCFCcr6LIUP3BUt5oswK1KI7elBXQPj-FlpQ&oe=6A9A60DC",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788348737_2633034060514245_6512760184501835544_n.png?stp=dst-jpg_tt6&cstp=mx626x782&ctp=s626x782&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ZqCRPntPdAIQ7kNvwFseNyZ&_nc_oc=Adrygb00SCsyll1CbTXMgar2MLaGSAyY59RwLf797hZpS-znAq9cRHA8yfr3Jo61WOw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQI4t7Xyw5NCFCcr6LIUP3BUt5oswK1KI7elBXQPj-FlpQ&oe=6A9A60DC"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-2-2",
    "title": "全家 艾絲樂小兔 - 粉粉雙面被 特價$399",
    "subtitle": "最療癒的床伴，一人蓋剛剛好，給你滿滿安全感，雙面設計",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 399,
    "originalPrice": 1699,
    "priceUnit": "件",
    "targetItems": [
      "艾絲樂小兔 - 粉粉雙面被"
    ],
    "conditions": [
      "全家刷就購",
      "限量預購"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#艾絲樂小兔",
      "#寢具",
      "#粉粉雙面被",
      "#特價"
    ],
    "startDate": "2026-08-24",
    "endDate": "2026-09-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02Rc7QC5GmR1XAvPub9pQkZGq635va2LpMkEspmb7YBAYtRoVt4VmiGKrCVsADy3Wol?__cft__[0]=AZa2pFHLWKZeL3HoI_wOaeCWhCKuBTC8Mn529whMN2IklubQkDUQYfM-ejhrSnIQeweCjTSNP8X0xyC8PHxYRgwkZ7vL2p57EwIkGT7C9fSPeR9NCQmAuRZmGaG52S9kQmp87dCABoCU5lC5lrp3tEs72aQVtki8vzJ-4qPa1TZM021wHNymuKA2AiSqbh0HeIw&__tn__=%2CO%2CP-R",
    "likeCount": 143,
    "commentCount": 10,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1699
      },
      {
        "date": "今日",
        "price": 399
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/780388981_916511797737700_4462019895897520850_n.png?stp=dst-jpg_tt6&cstp=mx795x993&ctp=s795x993&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WYN5x6f5qMQQ7kNvwEn7PV0&_nc_oc=AdpxQHUu-_wCKqVKpw1m23Mm-yvtpj6Km7WqVFoM7OFRUjygzUiS6CexTWRyYVoU2-w&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLdMwLT9ta4r_mhgM2i78ytxUPHSYLC2idlrXleGj1lCQ&oe=6A9A7608",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/780388981_916511797737700_4462019895897520850_n.png?stp=dst-jpg_tt6&cstp=mx795x993&ctp=s795x993&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WYN5x6f5qMQQ7kNvwEn7PV0&_nc_oc=AdpxQHUu-_wCKqVKpw1m23Mm-yvtpj6Km7WqVFoM7OFRUjygzUiS6CexTWRyYVoU2-w&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLdMwLT9ta4r_mhgM2i78ytxUPHSYLC2idlrXleGj1lCQ&oe=6A9A7608"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-2-3",
    "title": "全家 艾絲樂小兔 - 透明炫彩相機包 特價$149",
    "subtitle": "不只能裝東西還能裝可愛！可愛造型加上透明防潑水大容量",
    "category": "fashion",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 149,
    "originalPrice": 699,
    "priceUnit": "個",
    "targetItems": [
      "艾絲樂小兔 - 透明炫彩相機包"
    ],
    "conditions": [
      "全家刷就購",
      "限量預購"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#艾絲樂小兔",
      "#包包",
      "#透明炫彩相機包",
      "#特價"
    ],
    "startDate": "2026-08-24",
    "endDate": "2026-09-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02Rc7QC5GmR1XAvPub9pQkZGq635va2LpMkEspmb7YBAYtRoVt4VmiGKrCVsADy3Wol?__cft__[0]=AZa2pFHLWKZeL3HoI_wOaeCWhCKuBTC8Mn529whMN2IklubQkDUQYfM-ejhrSnIQeweCjTSNP8X0xyC8PHxYRgwkZ7vL2p57EwIkGT7C9fSPeR9NCQmAuRZmGaG52S9kQmp87dCABoCU5lC5lrp3tEs72aQVtki8vzJ-4qPa1TZM021wHNymuKA2AiSqbh0HeIw&__tn__=%2CO%2CP-R",
    "likeCount": 224,
    "commentCount": 21,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 699
      },
      {
        "date": "今日",
        "price": 149
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786828904_1046194244950035_6222995491943539569_n.png?stp=dst-jpg_tt6&cstp=mx748x935&ctp=s748x935&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=mIoPj-Tskm4Q7kNvwHi0ax4&_nc_oc=AdqLXamvC-XQV15mXx3j3Hcc3a6WggcLtVMZldiCZdlJkcXsT-yoeSn03SggWRRP_CM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQIey29Q4VVcpSubVS_deTsNo3XOeJJ5qcDfMrIZKvnhQw&oe=6A9A5A56",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786828904_1046194244950035_6222995491943539569_n.png?stp=dst-jpg_tt6&cstp=mx748x935&ctp=s748x935&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=mIoPj-Tskm4Q7kNvwHi0ax4&_nc_oc=AdqLXamvC-XQV15mXx3j3Hcc3a6WggcLtVMZldiCZdlJkcXsT-yoeSn03SggWRRP_CM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQIey29Q4VVcpSubVS_deTsNo3XOeJJ5qcDfMrIZKvnhQw&oe=6A9A5A56"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-3-0",
    "title": "全家 FamilyMart TOKYO BANANA 香蕉卡士達麵包 特價$39",
    "subtitle": "滑順香茶卡士達×柔軟麵包體",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 39,
    "originalPrice": 39,
    "priceUnit": "個",
    "targetItems": [
      "香蕉卡士達麵包"
    ],
    "conditions": [
      "新品上市"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#麵包",
      "#TOKYO BANANA",
      "#香蕉卡士達",
      "#新品上市"
    ],
    "startDate": "2026-08-01",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02RU2hJK4YZEmFSmDwEZrgbcXvvfkryL37LuspqjyyLxfhvzT5wvrGRnxVkgLgqDo2l?__cft__[0]=AZa9McMmcTBNYcbBuAem8-Oumh10C7qEswwGFBzEh6pcpv-AX5yfH8B03SMhT9eAQA1iv7f8gGXF_t8M93vI5zNkL68MHB9vhaAraiNeJAvk2ORY1NmTF5_EP4qoS7ECq4YM5_kXrlIN8aWoyHkIiEmZHl3tSZq_BdrmPDT5i6_kbJzyzlHGuRzKEjbBgTEjnTE&__tn__=%2CO%2CP-R",
    "likeCount": 89,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 39
      },
      {
        "date": "今日",
        "price": 39
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785035039_1371216498019905_2613526895834137550_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=szi6bgk1s_oQ7kNvwE62sPE&_nc_oc=Adph4aJrwgOmZ2uNFxsZoKXClfqvTFDAKpI5oMqOOEDsQRJXpUThcwwusxqvi0StkCI&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQIWk1aEP_d1pc5FjV8hLQY_sGy9Ovkicpk6vMitnpopdQ&oe=6A9A4B12",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785035039_1371216498019905_2613526895834137550_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=szi6bgk1s_oQ7kNvwE62sPE&_nc_oc=Adph4aJrwgOmZ2uNFxsZoKXClfqvTFDAKpI5oMqOOEDsQRJXpUThcwwusxqvi0StkCI&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQIWk1aEP_d1pc5FjV8hLQY_sGy9Ovkicpk6vMitnpopdQ&oe=6A9A4B12"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-3-1",
    "title": "全家 FamilyMart TOKYO BANANA 香蕉卡士達泡芙 特價$42",
    "subtitle": "香甜濃郁的香蕉卡士達",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 42,
    "originalPrice": 42,
    "priceUnit": "個",
    "targetItems": [
      "香蕉卡士達泡芙"
    ],
    "conditions": [
      "新品上市"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#甜點",
      "#TOKYO BANANA",
      "#香蕉卡士達",
      "#新品上市"
    ],
    "startDate": "2026-08-01",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02RU2hJK4YZEmFSmDwEZrgbcXvvfkryL37LuspqjyyLxfhvzT5wvrGRnxVkgLgqDo2l?__cft__[0]=AZa9McMmcTBNYcbBuAem8-Oumh10C7qEswwGFBzEh6pcpv-AX5yfH8B03SMhT9eAQA1iv7f8gGXF_t8M93vI5zNkL68MHB9vhaAraiNeJAvk2ORY1NmTF5_EP4qoS7ECq4YM5_kXrlIN8aWoyHkIiEmZHl3tSZq_BdrmPDT5i6_kbJzyzlHGuRzKEjbBgTEjnTE&__tn__=%2CO%2CP-R",
    "likeCount": 68,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 42
      },
      {
        "date": "今日",
        "price": 42
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788764650_1118554807740607_4491324094030008449_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=nxbZOgVuZxsQ7kNvwG3wWaW&_nc_oc=AdpQFhxjgm3uSvo6V4-uRO1dbxotddK81ONDDY_6Rvvc9YEMEh3EioIN_4KfTo6sfUs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLfFEMy4tHZh0kQgk4CmGAvFMvM8flBGZJZ5iSLa4lTPQ&oe=6A9A750E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788764650_1118554807740607_4491324094030008449_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=nxbZOgVuZxsQ7kNvwG3wWaW&_nc_oc=AdpQFhxjgm3uSvo6V4-uRO1dbxotddK81ONDDY_6Rvvc9YEMEh3EioIN_4KfTo6sfUs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLfFEMy4tHZh0kQgk4CmGAvFMvM8flBGZJZ5iSLa4lTPQ&oe=6A9A750E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-3-2",
    "title": "全家 FamilyMart TOKYO BANANA 香蕉卡士達牛奶布丁 特價$45",
    "subtitle": "香蕉卡士達牛奶布丁",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 45,
    "originalPrice": 45,
    "priceUnit": "個",
    "targetItems": [
      "香蕉卡士達牛奶布丁"
    ],
    "conditions": [
      "新品上市"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#布丁",
      "#TOKYO BANANA",
      "#香蕉卡士達",
      "#新品上市"
    ],
    "startDate": "2026-08-01",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02RU2hJK4YZEmFSmDwEZrgbcXvvfkryL37LuspqjyyLxfhvzT5wvrGRnxVkgLgqDo2l?__cft__[0]=AZa9McMmcTBNYcbBuAem8-Oumh10C7qEswwGFBzEh6pcpv-AX5yfH8B03SMhT9eAQA1iv7f8gGXF_t8M93vI5zNkL68MHB9vhaAraiNeJAvk2ORY1NmTF5_EP4qoS7ECq4YM5_kXrlIN8aWoyHkIiEmZHl3tSZq_BdrmPDT5i6_kbJzyzlHGuRzKEjbBgTEjnTE&__tn__=%2CO%2CP-R",
    "likeCount": 200,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 45
      },
      {
        "date": "今日",
        "price": 45
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786158054_1589178972850037_1270931043956444459_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=tX6clwoypvkQ7kNvwH0xWx3&_nc_oc=Adqs07NCQEhNq6QRIwBRrHy8j9ccs6XEnE--8trLaQ5zoFop-LI2lTUHBsA7u8-yyLw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQJ9gnaazwb6_1IcPnHXUjpBdgrPKwwNTgpNre4DYaIQsQ&oe=6A9A68B7",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786158054_1589178972850037_1270931043956444459_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=tX6clwoypvkQ7kNvwH0xWx3&_nc_oc=Adqs07NCQEhNq6QRIwBRrHy8j9ccs6XEnE--8trLaQ5zoFop-LI2lTUHBsA7u8-yyLw&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQJ9gnaazwb6_1IcPnHXUjpBdgrPKwwNTgpNre4DYaIQsQ&oe=6A9A68B7"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-3-3",
    "title": "全家 FamilyMart TOKYO BANANA 香蕉卡士達酷繽沙 特價$65",
    "subtitle": "香蕉卡士達酷繽沙",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 65,
    "originalPrice": 65,
    "priceUnit": "杯",
    "targetItems": [
      "香蕉卡士達酷繽沙"
    ],
    "conditions": [
      "新品上市"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家",
      "#酷繽沙",
      "#TOKYO BANANA",
      "#香蕉卡士達",
      "#新品上市"
    ],
    "startDate": "2026-08-01",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid02RU2hJK4YZEmFSmDwEZrgbcXvvfkryL37LuspqjyyLxfhvzT5wvrGRnxVkgLgqDo2l?__cft__[0]=AZa9McMmcTBNYcbBuAem8-Oumh10C7qEswwGFBzEh6pcpv-AX5yfH8B03SMhT9eAQA1iv7f8gGXF_t8M93vI5zNkL68MHB9vhaAraiNeJAvk2ORY1NmTF5_EP4qoS7ECq4YM5_kXrlIN8aWoyHkIiEmZHl3tSZq_BdrmPDT5i6_kbJzyzlHGuRzKEjbBgTEjnTE&__tn__=%2CO%2CP-R",
    "likeCount": 99,
    "commentCount": 7,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 65
      },
      {
        "date": "今日",
        "price": 65
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787888529_930036899562616_7085075325599738647_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hWq70dMNVkQQ7kNvwHBAgd6&_nc_oc=AdpR9YsZjL9yEsquO4UQxZnpwdB--duHerxp12OE-enyj84ABytHOv1AdBFjcyzUkwE&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLqO8eztfDPzFfGd7_FfLXAoBD3MdkC65Ro_iDgc6J4Ew&oe=6A9A70FD",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787888529_930036899562616_7085075325599738647_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hWq70dMNVkQQ7kNvwHBAgd6&_nc_oc=AdpR9YsZjL9yEsquO4UQxZnpwdB--duHerxp12OE-enyj84ABytHOv1AdBFjcyzUkwE&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=4eDP5bBV8evVjePFTo5rKQ&_nc_ss=7b289&oh=00_AQLqO8eztfDPzFfGd7_FfLXAoBD3MdkC65Ro_iDgc6J4Ew&oe=6A9A70FD"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-familymart-4-0",
    "title": "全家 FamilyMart GREEN & SAFE 白桃青心烏龍氣泡茶 特價$35",
    "subtitle": "白桃果香x青心烏龍茶，全家獨家上市",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamilyMart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 35,
    "originalPrice": 39,
    "priceUnit": "瓶",
    "targetItems": [
      "GREEN & SAFE 白桃青心烏龍氣泡茶"
    ],
    "conditions": [
      "全家獨家新品上市"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "台新玫瑰卡 (3.8%)"
    ],
    "tags": [
      "#全家FamilyMart",
      "#飲料",
      "#氣泡茶",
      "#白桃青心烏龍",
      "#新品特價"
    ],
    "startDate": "2026-06-01",
    "endDate": "2026-06-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamilyMart/posts/pfbid0FSVBu6MiaWMTu6qJKidUvhsoFwe39fQqz1uk8Ti2eqhvLQ52yswxSLaPupP7HWXNl?__cft__[0]=AZbFnlIj1mxbqbBcBh2SZ_TGwK11WXmveQLiEHNqvOF6pBuqNmvHGD9QrwAr2RkMIXMSEQ_SOgTCoKpf5VdVcBi1158genXGq56JrZSo0xTLOE3Ys7qKMWd5_E9nMH315_SpW1JuF0AkzIEY6oWAh5-Kf2GVx-sWJKgzsa0myZV38dpjVMdwJk3Pf5JFiZUmk3Y&__tn__=%2CO%2CP-R",
    "likeCount": 87,
    "commentCount": 20,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 39
      },
      {
        "date": "今日",
        "price": 35
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789446292_1965717900790608_4815214406692660789_n.png?stp=dst-jpg_tt6&cstp=mx1144x1430&ctp=s1080x2048&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4mEuIpdOMngQ7kNvwHdYyVq&_nc_oc=AdobjuPDOjXjHnTdFvNTfuljutKvRhbM84ZQihDSqKF2yVsM-ifI7h5a6FhqEA6bNas&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=jcBbt_jmpo8IdwlciYK_8A&_nc_ss=7b289&oh=00_AQK47uuJAuS533IwRbJo4FPYovA_CoVxp7nrjNFpRpzxYg&oe=6A9A7DEC",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789446292_1965717900790608_4815214406692660789_n.png?stp=dst-jpg_tt6&cstp=mx1144x1430&ctp=s1080x2048&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4mEuIpdOMngQ7kNvwHdYyVq&_nc_oc=AdobjuPDOjXjHnTdFvNTfuljutKvRhbM84ZQihDSqKF2yVsM-ifI7h5a6FhqEA6bNas&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=jcBbt_jmpo8IdwlciYK_8A&_nc_ss=7b289&oh=00_AQK47uuJAuS533IwRbJo4FPYovA_CoVxp7nrjNFpRpzxYg&oe=6A9A7DEC"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-0-0",
    "title": "全家 阿奇儂極濃義式開心果雪糕 買1送1",
    "subtitle": "日曬咖啡豆比例提升20%的美味雪糕，同品項買1送1",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 20,
    "originalPrice": 40,
    "priceUnit": "支",
    "targetItems": [
      "阿奇儂極濃義式開心果雪糕"
    ],
    "conditions": [
      "同品項買1送1"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#冰品",
      "#雪糕",
      "#阿奇儂",
      "#買1送1"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02ZjF73cqcEtVYpMYK8roAKmXeV96jwZaFsh5pHbkqdUtQrWAzwoK3QeyvJbid22uPl?__cft__[0]=AZazAuRTsQ5Nf73dMSYDuhceHcavDpj_dGkQ5l16AOn81DjyDQgJdkhAUJggpktgnmLfsMLR5-n3DORsgWIWgEBx1Dycg_LZuvGhFHWXwTAd32jywM99vU61CaOx596NRGYA5aG0HAoUbJoYIOrNv2prg_uo8SNVeQ33pGbcRqSSx2sazgD2D4LWyhV9UxPmKx0&__tn__=%2CO%2CP-R",
    "likeCount": 207,
    "commentCount": 17,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 40
      },
      {
        "date": "今日",
        "price": 20
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-0-1",
    "title": "全家 FamiCollection金萱二十七 買2送2",
    "subtitle": "優質茶飲，同品項買2送2超划算",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 15,
    "originalPrice": 30,
    "priceUnit": "瓶",
    "targetItems": [
      "FamiCollection金萱二十七"
    ],
    "conditions": [
      "同品項買2送2"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#茶飲",
      "#FamiCollection",
      "#金萱",
      "#買2送2"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02ZjF73cqcEtVYpMYK8roAKmXeV96jwZaFsh5pHbkqdUtQrWAzwoK3QeyvJbid22uPl?__cft__[0]=AZazAuRTsQ5Nf73dMSYDuhceHcavDpj_dGkQ5l16AOn81DjyDQgJdkhAUJggpktgnmLfsMLR5-n3DORsgWIWgEBx1Dycg_LZuvGhFHWXwTAd32jywM99vU61CaOx596NRGYA5aG0HAoUbJoYIOrNv2prg_uo8SNVeQ33pGbcRqSSx2sazgD2D4LWyhV9UxPmKx0&__tn__=%2CO%2CP-R",
    "likeCount": 155,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 30
      },
      {
        "date": "今日",
        "price": 15
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-0-2",
    "title": "全家 Let’s Café 特大經典美式 (杯) 任選2杯95元",
    "subtitle": "特大經典美式/拿鐵、中杯單品美式/拿鐵任選2杯95元",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 48,
    "originalPrice": 60,
    "priceUnit": "杯",
    "targetItems": [
      "特大經典美式"
    ],
    "conditions": [
      "任選2杯95元"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#咖啡",
      "#Let's Café",
      "#美式咖啡",
      "#特大杯"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02ZjF73cqcEtVYpMYK8roAKmXeV96jwZaFsh5pHbkqdUtQrWAzwoK3QeyvJbid22uPl?__cft__[0]=AZazAuRTsQ5Nf73dMSYDuhceHcavDpj_dGkQ5l16AOn81DjyDQgJdkhAUJggpktgnmLfsMLR5-n3DORsgWIWgEBx1Dycg_LZuvGhFHWXwTAd32jywM99vU61CaOx596NRGYA5aG0HAoUbJoYIOrNv2prg_uo8SNVeQ33pGbcRqSSx2sazgD2D4LWyhV9UxPmKx0&__tn__=%2CO%2CP-R",
    "likeCount": 179,
    "commentCount": 5,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 48
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-0-3",
    "title": "全家 Let’s Tea 仙女醇奶茶 (杯) 特價2杯75元",
    "subtitle": "大杯仙女醇奶茶(冰/熱) 2杯75元",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 38,
    "originalPrice": 55,
    "priceUnit": "杯",
    "targetItems": [
      "大杯仙女醇奶茶"
    ],
    "conditions": [
      "2杯75元"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#奶茶",
      "#Let's Tea",
      "#仙女醇奶茶",
      "#大杯"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02ZjF73cqcEtVYpMYK8roAKmXeV96jwZaFsh5pHbkqdUtQrWAzwoK3QeyvJbid22uPl?__cft__[0]=AZazAuRTsQ5Nf73dMSYDuhceHcavDpj_dGkQ5l16AOn81DjyDQgJdkhAUJggpktgnmLfsMLR5-n3DORsgWIWgEBx1Dycg_LZuvGhFHWXwTAd32jywM99vU61CaOx596NRGYA5aG0HAoUbJoYIOrNv2prg_uo8SNVeQ33pGbcRqSSx2sazgD2D4LWyhV9UxPmKx0&__tn__=%2CO%2CP-R",
    "likeCount": 66,
    "commentCount": 3,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 55
      },
      {
        "date": "今日",
        "price": 38
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-0-4",
    "title": "全家 Fami!ce 霜淇淋 (支) 特價2支55元",
    "subtitle": "Fami!ce霜淇淋(不限口味) 2支55元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 28,
    "originalPrice": 49,
    "priceUnit": "支",
    "targetItems": [
      "Fami!ce霜淇淋"
    ],
    "conditions": [
      "不限口味",
      "2支55元"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#冰品",
      "#霜淇淋",
      "#Fami!ce",
      "#特價"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-09-01",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02ZjF73cqcEtVYpMYK8roAKmXeV96jwZaFsh5pHbkqdUtQrWAzwoK3QeyvJbid22uPl?__cft__[0]=AZazAuRTsQ5Nf73dMSYDuhceHcavDpj_dGkQ5l16AOn81DjyDQgJdkhAUJggpktgnmLfsMLR5-n3DORsgWIWgEBx1Dycg_LZuvGhFHWXwTAd32jywM99vU61CaOx596NRGYA5aG0HAoUbJoYIOrNv2prg_uo8SNVeQ33pGbcRqSSx2sazgD2D4LWyhV9UxPmKx0&__tn__=%2CO%2CP-R",
    "likeCount": 122,
    "commentCount": 4,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 49
      },
      {
        "date": "今日",
        "price": 28
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786543098_1388435136033945_9085832004128255884_n.png?stp=dst-jpg_tt6&cstp=mx1080x1350&ctp=p960x960&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wHHg6ZTwQ1EQ7kNvwGMved3&_nc_oc=AdrObCSB5oA_6oXztbS0qtFGpa5SwW7Z3vf4NZTHOamAcOVoEjrtqEahBK-MkSVdgGM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=y__gTyt_k9Dy-6AQUz9eKA&_nc_ss=7b289&oh=00_AQKb7hjIKnwLx0yiV8T9Xw2m2yISqGga5igoNov6SsxfjQ&oe=6A9A5287"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-1-0",
    "title": "全家 Let's Café 大杯特濃美式 (大杯) 第二件10元",
    "subtitle": "每週三咖啡日，大杯特濃美式同品項第二件10元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 33,
    "originalPrice": 55,
    "priceUnit": "杯",
    "targetItems": [
      "大杯特濃美式"
    ],
    "conditions": [
      "每週三咖啡日",
      "同品項第二件10元",
      "冷熱不限"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#咖啡",
      "#特濃美式",
      "#大杯",
      "#第二件10元"
    ],
    "startDate": "2026-08-26",
    "endDate": "2026-08-26",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02zqfp8Pz2yePtG7pgithBDu9GYYYDvw3FbE5MNxz6SP9ofrZ5zpBnwGSNpFbx4U4fl?__cft__[0]=AZYMQeSNCKQKeWpQnPCtIAeQ_L6_b_ldaIMUjsW7Bm3d4i9uTzxLGa8Vyu6IkbXAZ0Fu2YyuzZFn1uvUAIfDY9y3Ti1QW8tBZ9F54Qb_1I9fmaJGpoI2pU19YutWzQyp0CcBagoNaBsHV7y_QgqGBJSruk9Ck7itahl8cCuJJJJrYnWZ3qPsMYzP21gjXYkfU8Y&__tn__=%2CO%2CP-R",
    "likeCount": 141,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 55
      },
      {
        "date": "今日",
        "price": 33
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-1-1",
    "title": "全家 Let's Café 大杯特濃拿鐵 (大杯) 第二件10元",
    "subtitle": "每週三咖啡日，大杯特濃拿鐵同品項第二件10元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 40,
    "originalPrice": 65,
    "priceUnit": "杯",
    "targetItems": [
      "大杯特濃拿鐵"
    ],
    "conditions": [
      "每週三咖啡日",
      "同品項第二件10元",
      "冷熱不限"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#咖啡",
      "#特濃拿鐵",
      "#大杯",
      "#第二件10元"
    ],
    "startDate": "2026-08-26",
    "endDate": "2026-08-26",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02zqfp8Pz2yePtG7pgithBDu9GYYYDvw3FbE5MNxz6SP9ofrZ5zpBnwGSNpFbx4U4fl?__cft__[0]=AZYMQeSNCKQKeWpQnPCtIAeQ_L6_b_ldaIMUjsW7Bm3d4i9uTzxLGa8Vyu6IkbXAZ0Fu2YyuzZFn1uvUAIfDY9y3Ti1QW8tBZ9F54Qb_1I9fmaJGpoI2pU19YutWzQyp0CcBagoNaBsHV7y_QgqGBJSruk9Ck7itahl8cCuJJJJrYnWZ3qPsMYzP21gjXYkfU8Y&__tn__=%2CO%2CP-R",
    "likeCount": 188,
    "commentCount": 7,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 65
      },
      {
        "date": "今日",
        "price": 40
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-1-2",
    "title": "全家 Let's Café 大杯單品美式 (大杯) 買六送六",
    "subtitle": "每月6、16、26號會員好咖日，大杯單品美式買6送6",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 50,
    "originalPrice": 100,
    "priceUnit": "杯",
    "targetItems": [
      "大杯單品美式"
    ],
    "conditions": [
      "每月6、16、26號會員好咖日",
      "買六送六",
      "冷熱不限"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#咖啡",
      "#單品美式",
      "#大杯",
      "#買六送六"
    ],
    "startDate": "2026-08-26",
    "endDate": "2026-08-26",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02zqfp8Pz2yePtG7pgithBDu9GYYYDvw3FbE5MNxz6SP9ofrZ5zpBnwGSNpFbx4U4fl?__cft__[0]=AZYMQeSNCKQKeWpQnPCtIAeQ_L6_b_ldaIMUjsW7Bm3d4i9uTzxLGa8Vyu6IkbXAZ0Fu2YyuzZFn1uvUAIfDY9y3Ti1QW8tBZ9F54Qb_1I9fmaJGpoI2pU19YutWzQyp0CcBagoNaBsHV7y_QgqGBJSruk9Ck7itahl8cCuJJJJrYnWZ3qPsMYzP21gjXYkfU8Y&__tn__=%2CO%2CP-R",
    "likeCount": 157,
    "commentCount": 4,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 100
      },
      {
        "date": "今日",
        "price": 50
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-1-3",
    "title": "全家 Let's Café 大杯單品拿鐵 (大杯) 買六送六",
    "subtitle": "每月6、16、26號會員好咖日，大杯單品拿鐵買6送6",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 55,
    "originalPrice": 110,
    "priceUnit": "杯",
    "targetItems": [
      "大杯單品拿鐵"
    ],
    "conditions": [
      "每月6、16、26號會員好咖日",
      "買六送六",
      "冷熱不限"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#咖啡",
      "#單品拿鐵",
      "#大杯",
      "#買六送六"
    ],
    "startDate": "2026-08-26",
    "endDate": "2026-08-26",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02zqfp8Pz2yePtG7pgithBDu9GYYYDvw3FbE5MNxz6SP9ofrZ5zpBnwGSNpFbx4U4fl?__cft__[0]=AZYMQeSNCKQKeWpQnPCtIAeQ_L6_b_ldaIMUjsW7Bm3d4i9uTzxLGa8Vyu6IkbXAZ0Fu2YyuzZFn1uvUAIfDY9y3Ti1QW8tBZ9F54Qb_1I9fmaJGpoI2pU19YutWzQyp0CcBagoNaBsHV7y_QgqGBJSruk9Ck7itahl8cCuJJJJrYnWZ3qPsMYzP21gjXYkfU8Y&__tn__=%2CO%2CP-R",
    "likeCount": 134,
    "commentCount": 21,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 110
      },
      {
        "date": "今日",
        "price": 55
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/778985159_1112811187849751_2266897199723358459_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LROla-ePan8Q7kNvwEkEcHO&_nc_oc=AdrMf8h7Dzc5JsAu1Qm4LbWjkNXcFMrvuyFDHBgeC4DBiiqmYwWEIaMO6cPoFQeqhFM&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQLpq0zI83LrQ5gVklzLsPr5KfyDMskQxE5Iqso1cvQrLw&oe=6A9A5DF3"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-1-4",
    "title": "全家 光泉豆漿 25元系列 7折起",
    "subtitle": "全家APP隨買跨店取，光泉豆漿25元系列特價18.5元起",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 19,
    "originalPrice": 25,
    "priceUnit": "瓶",
    "targetItems": [
      "光泉豆漿25元系列"
    ],
    "conditions": [
      "隨買跨店取優惠",
      "7折起"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#光泉",
      "#豆漿",
      "#飲品"
    ],
    "startDate": "2026-07-22",
    "endDate": "2026-08-31",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02zqfp8Pz2yePtG7pgithBDu9GYYYDvw3FbE5MNxz6SP9ofrZ5zpBnwGSNpFbx4U4fl?__cft__[0]=AZYMQeSNCKQKeWpQnPCtIAeQ_L6_b_ldaIMUjsW7Bm3d4i9uTzxLGa8Vyu6IkbXAZ0Fu2YyuzZFn1uvUAIfDY9y3Ti1QW8tBZ9F54Qb_1I9fmaJGpoI2pU19YutWzQyp0CcBagoNaBsHV7y_QgqGBJSruk9Ck7itahl8cCuJJJJrYnWZ3qPsMYzP21gjXYkfU8Y&__tn__=%2CO%2CP-R",
    "likeCount": 51,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 25
      },
      {
        "date": "今日",
        "price": 19
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785944713_1088095423580520_3853985424347425056_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=j7Dahl29oOEQ7kNvwG2gNHd&_nc_oc=AdrfSv3hFUm1jLXyLUZZzzBwI2Q7CRNp3bCo9RGuCDI9krr380xRxmYGwtcXb_lQFLs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQIc8zqgLHUEHRT2zX89JYTQ1tw69QtfRayzcAT5atPxIA&oe=6A9A764F",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785944713_1088095423580520_3853985424347425056_n.png?stp=dst-jpg_tt6&cstp=mx1639x2048&ctp=p960x960&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=j7Dahl29oOEQ7kNvwG2gNHd&_nc_oc=AdrfSv3hFUm1jLXyLUZZzzBwI2Q7CRNp3bCo9RGuCDI9krr380xRxmYGwtcXb_lQFLs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=aXSOd748_kqPWYed5ZiU5w&_nc_ss=7b289&oh=00_AQIc8zqgLHUEHRT2zX89JYTQ1tw69QtfRayzcAT5atPxIA&oe=6A9A764F"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-4-0",
    "title": "全家茶葉蛋 77折",
    "subtitle": "今天 8/25 限定，全家APP買茶葉蛋77折",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 66,
    "priceUnit": "顆",
    "targetItems": [
      "茶葉蛋"
    ],
    "conditions": [
      "8/25限定",
      "全家APP購買"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#鮮食",
      "#茶葉蛋",
      "#限時優惠",
      "#77折"
    ],
    "startDate": "2026-08-25",
    "endDate": "2026-08-25",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02aLJNvg7GFQodMFYUScs57F4y4Nqkvu8jWETi8uHKuRH7GfizEA7td3BowEqZjgDVl?__cft__[0]=AZZ0xR5X6M9ZU1hCmWXNJk0kobXoKA7w_lBbHIuVB975oo-SEsMerSrDOK_oIAPgn6bLCmK-w0BWUfCY1cqZCCTeOUkHk5KaI3BTzV-mZoWtYYQT4ISUDLi8bNtrp-66y6sAFvvKt_uydrjlXOnb-chV5tPP3j9sQzNRgcMH5lMODU_yrKr22nRUG8zkkJJY4zk&__tn__=%2CO%2CP-R",
    "likeCount": 189,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
    "images": [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-famiport-4-1",
    "title": "全家夯番薯 75折",
    "subtitle": "今天 8/25 限定，全家APP買番薯75折",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全家 FamiPort",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 66,
    "priceUnit": "個",
    "targetItems": [
      "番薯"
    ],
    "conditions": [
      "8/25限定",
      "全家APP購買"
    ],
    "eligibleCards": [
      "全盈+PAY (5%)",
      "FamiPay",
      "悠遊卡"
    ],
    "tags": [
      "#全家",
      "#鮮食",
      "#夯番薯",
      "#限時優惠",
      "#75折"
    ],
    "startDate": "2026-08-25",
    "endDate": "2026-08-25",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/FamiPortTW/posts/pfbid02aLJNvg7GFQodMFYUScs57F4y4Nqkvu8jWETi8uHKuRH7GfizEA7td3BowEqZjgDVl?__cft__[0]=AZZ0xR5X6M9ZU1hCmWXNJk0kobXoKA7w_lBbHIuVB975oo-SEsMerSrDOK_oIAPgn6bLCmK-w0BWUfCY1cqZCCTeOUkHk5KaI3BTzV-mZoWtYYQT4ISUDLi8bNtrp-66y6sAFvvKt_uydrjlXOnb-chV5tPP3j9sQzNRgcMH5lMODU_yrKr22nRUG8zkkJJY4zk&__tn__=%2CO%2CP-R",
    "likeCount": 222,
    "commentCount": 6,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
    "images": [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-hilife-0-0",
    "title": "萊爾富 Hi-Life 三層抽取式衛生紙 (120抽×24包) 特價$299",
    "subtitle": "柔韌三層設計，1串特價299元，刷iPASS MONEY綁聯邦卡再享現折10%",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "萊爾富 Hi-Life",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 299,
    "originalPrice": 1080,
    "priceUnit": "串",
    "targetItems": [
      "Hi-Life 三層抽取式衛生紙"
    ],
    "conditions": [
      "1串特價299元",
      "刷iPASS MONEY綁聯邦卡現折10%"
    ],
    "eligibleCards": [
      "HiPay (4%)",
      "玉山 U Bear (3%)",
      "聯邦賴點卡 (2%)"
    ],
    "tags": [
      "#萊爾富",
      "#日用品",
      "#衛生紙",
      "#抽取式衛生紙",
      "#特價$299"
    ],
    "startDate": "2026-08-19",
    "endDate": "2026-09-15",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/hihilife/posts/pfbid0gBj69niy472AbT4BDxVB7Ki6AhBnhpnrfHDVCvicvzJgP1yMo3SGLgM6gnKDBZ3Sl?__cft__[0]=AZbmLctv5TdYdh3VpthICBzFRhB1gO8LAgo9Lu86L0Njm1jQ2-s9tT3eFkUcyqirYANSoLnwGrlI1pxLUi14rUfU8dJrA9Xp0hsWvCSBfVzC04HR68jtq3-zlKIrwy8Lm2z0IU8CEcortEDbJ_8a7m2xE4158uiOP-YQ4kMn1uWpHCD7JHHepGIsGigSI_aPEto&__tn__=%2CO%2CP-R",
    "likeCount": 158,
    "commentCount": 15,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1080
      },
      {
        "date": "今日",
        "price": 299
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790147185_1760095068572518_5033637880548121215_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6qcrTOmT308Q7kNvwF8Qzqw&_nc_oc=AdpKM13M32ZeknDOoutsS74y9-cMKhpPUKKmJ08Ge8sj3NnZWvUqHirxWPrX2QcaLsc&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rR2uBAn3CdCbfK-hoL6a5A&_nc_ss=7b289&oh=00_AQLbB-u9W7EPFHjUhJf9est36CERMv1u-a8hny5kSrssfg&oe=6A9A7100",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790147185_1760095068572518_5033637880548121215_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6qcrTOmT308Q7kNvwF8Qzqw&_nc_oc=AdpKM13M32ZeknDOoutsS74y9-cMKhpPUKKmJ08Ge8sj3NnZWvUqHirxWPrX2QcaLsc&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=rR2uBAn3CdCbfK-hoL6a5A&_nc_ss=7b289&oh=00_AQLbB-u9W7EPFHjUhJf9est36CERMv1u-a8hny5kSrssfg&oe=6A9A7100"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-hilife-1-0",
    "title": "萊爾富 果C果昔 全品項 第2杯5折",
    "subtitle": "果昔控揪起來！果昔全品項第二杯直接享5折",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "萊爾富 Hi-Life",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 45,
    "originalPrice": 60,
    "priceUnit": "杯",
    "targetItems": [
      "果C果昔全品項"
    ],
    "conditions": [
      "同品項第2杯5折",
      "不同價位者以2杯75折計"
    ],
    "eligibleCards": [
      "HiPay (4%)",
      "玉山 U Bear (3%)",
      "聯邦賴點卡 (2%)"
    ],
    "tags": [
      "#萊爾富",
      "#飲料",
      "#果昔",
      "#果C果昔",
      "#第2杯5折"
    ],
    "startDate": "2026-08-19",
    "endDate": "2026-09-15",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/hihilife/posts/pfbid0gRAAoUv9QLWa7EyTxnAdgdn4UgZBMoAB9tsR6TfqMnadWGd1YHnH6VAERSAmv3Uwl?__cft__[0]=AZYPhTuawvqlGB7K_VxzRdZQLb5n5CO9wsjumYnH0jaZ45nKnuxTR9tJ1Hq8NHfXR4NF_RyN2McZmTxBR0DKHObmcwwSiXnFD8yf63qqw-3uXZd_AWdeiwOP_rTslUWFGgfn4ZZSXnHsIoZ8Q_Fs8QVEBY_t7CouHC81AjG7J1moifm7ZzQlXfNYh1EgVnVZodI&__tn__=%2CO%2CP-R",
    "likeCount": 67,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 45
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785081677_2127252834842289_8821007316588545998_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=EEQKoj2D_WMQ7kNvwG6G86_&_nc_oc=AdriSTzzgAO5DW9PvWiGT3Gc3WrnkOH0TChqOdzvbXUwcKOdMgdKgp3SbBJjMW4ONBk&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=YEzXBdpVM7Z0t3VemqQEzQ&_nc_ss=7b289&oh=00_AQJ0YRgRg-NYFgfyd6_J_8grgF9DL9bA2Rs4lKXP0OqZpg&oe=6A9A5881",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785081677_2127252834842289_8821007316588545998_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=EEQKoj2D_WMQ7kNvwG6G86_&_nc_oc=AdriSTzzgAO5DW9PvWiGT3Gc3WrnkOH0TChqOdzvbXUwcKOdMgdKgp3SbBJjMW4ONBk&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=YEzXBdpVM7Z0t3VemqQEzQ&_nc_ss=7b289&oh=00_AQJ0YRgRg-NYFgfyd6_J_8grgF9DL9bA2Rs4lKXP0OqZpg&oe=6A9A5881"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-hilife-3-0",
    "title": "萊爾富 Batiste 芭緹絲乾洗髮 (經典清新50ml) 第2件75折",
    "subtitle": "忙碌早晨救星！頭髮快速恢復清爽感",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "萊爾富 Hi-Life",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 153,
    "originalPrice": 175,
    "priceUnit": "件",
    "targetItems": [
      "Batiste 芭緹絲乾洗髮 經典清新 50ml"
    ],
    "conditions": [
      "第2件75折",
      "同品項優惠"
    ],
    "eligibleCards": [
      "HiPay (4%)",
      "玉山 U Bear (3%)",
      "聯邦賴點卡 (2%)"
    ],
    "tags": [
      "#萊爾富",
      "#個人清潔",
      "#乾洗髮",
      "#50ml",
      "#第2件75折"
    ],
    "startDate": "2026-08-19",
    "endDate": "2026-09-15",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/hihilife/posts/pfbid0VE86o2XY6mvyW6gDXNARtyfX3pDpxmnzwebH3pC89fogzGKj8cUuZfnvcUqzcLzkl?__cft__[0]=AZbogggvC4a-n2rNhrLRsJzhzOpbExGQJSKlUxeKm3Duu78nrh4PB9erVrkvS1TjAK-EYFBX8HksZeAompwoUIx-Wxk7E9INIWAMlvN-fUtB6MznzWxeW4flyaeOj4n6Kzn26ZzazM6rkNOh1MPHDZZJo_HIm5mMu1ut2vPXDRSET2l9x9USKYStIZij6ORH3t4&__tn__=%2CO%2CP-R",
    "likeCount": 109,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 175
      },
      {
        "date": "今日",
        "price": 153
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788860627_27823194497323176_8585135768727855170_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=5isesrNJ9h8Q7kNvwHa3nih&_nc_oc=AdrSUT2YDZ2b6SUUP10W2MCM9Dlo9HWzDSuq1tdQrZFkBcl9fTXo6lFyLBP-Ekl2zk0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=YEzXBdpVM7Z0t3VemqQEzQ&_nc_ss=7b289&oh=00_AQK-69OelHX59QBxo3s3X5vbZG1gPGnDkTccGCKNXOo6nw&oe=6A9A7273",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788860627_27823194497323176_8585135768727855170_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=5isesrNJ9h8Q7kNvwHa3nih&_nc_oc=AdrSUT2YDZ2b6SUUP10W2MCM9Dlo9HWzDSuq1tdQrZFkBcl9fTXo6lFyLBP-Ekl2zk0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=YEzXBdpVM7Z0t3VemqQEzQ&_nc_ss=7b289&oh=00_AQK-69OelHX59QBxo3s3X5vbZG1gPGnDkTccGCKNXOo6nw&oe=6A9A7273"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-hilife-4-0",
    "title": "萊爾富 日本北川甜甜圈 (任選) 任選2件99元",
    "subtitle": "日本人氣甜甜圈新品獨家上市，蜂蜜奶油風味酥脆、可可/巧克力風味懷舊可可風味/巧克力波堤、草莓風味波堤任選",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "萊爾富 Hi-Life",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 50,
    "originalPrice": 59,
    "priceUnit": "個",
    "targetItems": [
      "日本北川甜甜圈"
    ],
    "conditions": [
      "任選2件99元"
    ],
    "eligibleCards": [
      "HiPay (4%)",
      "玉山 U Bear (3%)",
      "聯邦賴點卡 (2%)"
    ],
    "tags": [
      "#萊爾富",
      "#甜點",
      "#甜甜圈",
      "#日本北川甜甜圈",
      "#任選2件99元"
    ],
    "startDate": "2026-08-19",
    "endDate": "2026-09-15",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/hihilife/posts/pfbid02Pobar7zSy5H7q9P69fRjW8cf8B5MZAKrsP4wb3PBoFX4weAyd9bD7SudAxQehjXyl?__cft__[0]=AZZTXET-O8sYMCWTyzyS_X8jwLn7S902w44Ck2ScTOFmSOVPT20RSA4JWraEXFVzYc4k-3g6PVvBj1Wat2zG7vYirjP32K8LsTMRum_xNkMeKGDFaEg3UWco-wsIs1S8bBCG_AuMGorWruOa_TSCJcpVRe328_Yj5M9QlBZEcHnepJ4r9Euk8t0gzykKqSAzJT8&__tn__=%2CO%2CP-R",
    "likeCount": 236,
    "commentCount": 12,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 59
      },
      {
        "date": "今日",
        "price": 50
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/790003232_1778716776504710_6965745747684167626_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hWc0jemwgvoQ7kNvwGAohsN&_nc_oc=Adp0oXBJbTIlK1eZEZqTAagS8TxNqnK4kEsGjct--JFbPWAbVBk9eIMoQua4RuJzK5A&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=YEzXBdpVM7Z0t3VemqQEzQ&_nc_ss=7b289&oh=00_AQL2N3En3Oo5Zb-IcojsBaWkbdupH75HJGz1CvmC4eLLMA&oe=6A9A749F",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/790003232_1778716776504710_6965745747684167626_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hWc0jemwgvoQ7kNvwGAohsN&_nc_oc=Adp0oXBJbTIlK1eZEZqTAagS8TxNqnK4kEsGjct--JFbPWAbVBk9eIMoQua4RuJzK5A&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=YEzXBdpVM7Z0t3VemqQEzQ&_nc_ss=7b289&oh=00_AQL2N3En3Oo5Zb-IcojsBaWkbdupH75HJGz1CvmC4eLLMA&oe=6A9A749F"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-hilife-5-0",
    "title": "萊爾富 Hi Café 漂浮巧克力奶茶 (大杯) 特價$39",
    "subtitle": "巧克力控注意！漂浮巧克力奶茶限時特價",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "萊爾富 Hi-Life",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 39,
    "originalPrice": 80,
    "priceUnit": "杯",
    "targetItems": [
      "漂浮巧克力奶茶"
    ],
    "conditions": [
      "大杯特價39元",
      "數量有限，售完為止"
    ],
    "eligibleCards": [
      "HiPay (4%)",
      "玉山 U Bear (3%)",
      "聯邦賴點卡 (2%)"
    ],
    "tags": [
      "#萊爾富",
      "#Hi-Life",
      "#飲料",
      "#奶茶",
      "#巧克力",
      "#大杯",
      "#特價"
    ],
    "startDate": "2026-08-19",
    "endDate": "2026-09-15",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/hihilife/posts/pfbid0q837WR4FFkXWMzks3CW24vZDQSTBafXDXX3QAsdvNwjNneLFrA26oUg24bUwVxGSl?__cft__[0]=AZaaXAd1jIHbJpgPFrb5G4fxPVOi_IA8k_8UZ68MR-wCYo0J__dqDchn3grE9zWk2Heg0ytor7C3dyYKpJPI-jSUH-wyAFbqbgr1salNFv4kW4g7MfeJRMoN6gJ9eCxjV7BTCxT9Uf2SUvqrmU4khBsqwm0R84_vEk6aM2jou-t5Fswii8HxAsJwKC-wRPe27o4&__tn__=%2CO%2CP-R",
    "likeCount": 134,
    "commentCount": 20,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 80
      },
      {
        "date": "今日",
        "price": 39
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789033908_1080822064429978_3395525274289592802_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=TlRfPVT6K4IQ7kNvwHAK7lO&_nc_oc=Adofd8ToSkyeegdExolg8RPXql1rIvjgDCzRszzuw_RlQ7c4-twV15Dj-CoWFic6ZZs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=m8UIXJMKXAZp5kNZ66YqTA&_nc_ss=7b289&oh=00_AQIm1l0KavzQok2OvmqNaGgb7E0J39gzYaoZx7CvA1tABw&oe=6A9A5EB0",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789033908_1080822064429978_3395525274289592802_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=TlRfPVT6K4IQ7kNvwHAK7lO&_nc_oc=Adofd8ToSkyeegdExolg8RPXql1rIvjgDCzRszzuw_RlQ7c4-twV15Dj-CoWFic6ZZs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=m8UIXJMKXAZp5kNZ66YqTA&_nc_ss=7b289&oh=00_AQIm1l0KavzQok2OvmqNaGgb7E0J39gzYaoZx7CvA1tABw&oe=6A9A5EB0"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-hilife-5-1",
    "title": "萊爾富 Hi Café 恐龍巧克力歐蕾 (大杯) 特價$39",
    "subtitle": "巧克力控注意！恐龍巧克力歐蕾限時特價",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "萊爾富 Hi-Life",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/Hi-Life_logo.svg/1200px-Hi-Life_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 39,
    "originalPrice": 65,
    "priceUnit": "杯",
    "targetItems": [
      "恐龍巧克力歐蕾"
    ],
    "conditions": [
      "大杯特價39元",
      "數量有限，售完為止"
    ],
    "eligibleCards": [
      "HiPay (4%)",
      "玉山 U Bear (3%)",
      "聯邦賴點卡 (2%)"
    ],
    "tags": [
      "#萊爾富",
      "#Hi-Life",
      "#飲料",
      "#巧克力歐蕾",
      "#巧克力",
      "#大杯",
      "#特價"
    ],
    "startDate": "2026-08-19",
    "endDate": "2026-09-15",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/hihilife/posts/pfbid0q837WR4FFkXWMzks3CW24vZDQSTBafXDXX3QAsdvNwjNneLFrA26oUg24bUwVxGSl?__cft__[0]=AZaaXAd1jIHbJpgPFrb5G4fxPVOi_IA8k_8UZ68MR-wCYo0J__dqDchn3grE9zWk2Heg0ytor7C3dyYKpJPI-jSUH-wyAFbqbgr1salNFv4kW4g7MfeJRMoN6gJ9eCxjV7BTCxT9Uf2SUvqrmU4khBsqwm0R84_vEk6aM2jou-t5Fswii8HxAsJwKC-wRPe27o4&__tn__=%2CO%2CP-R",
    "likeCount": 58,
    "commentCount": 10,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 65
      },
      {
        "date": "今日",
        "price": 39
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789033908_1080822064429978_3395525274289592802_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=TlRfPVT6K4IQ7kNvwHAK7lO&_nc_oc=Adofd8ToSkyeegdExolg8RPXql1rIvjgDCzRszzuw_RlQ7c4-twV15Dj-CoWFic6ZZs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=m8UIXJMKXAZp5kNZ66YqTA&_nc_ss=7b289&oh=00_AQIm1l0KavzQok2OvmqNaGgb7E0J39gzYaoZx7CvA1tABw&oe=6A9A5EB0",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789033908_1080822064429978_3395525274289592802_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=TlRfPVT6K4IQ7kNvwHAK7lO&_nc_oc=Adofd8ToSkyeegdExolg8RPXql1rIvjgDCzRszzuw_RlQ7c4-twV15Dj-CoWFic6ZZs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=m8UIXJMKXAZp5kNZ66YqTA&_nc_ss=7b289&oh=00_AQIm1l0KavzQok2OvmqNaGgb7E0J39gzYaoZx7CvA1tABw&oe=6A9A5EB0"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-0-0",
    "title": "OKmart 郭元益士林1867酥皮四大天王禮盒 特價優惠",
    "subtitle": "中秋送禮首選，經典酥皮四大天王一次集合",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 66,
    "priceUnit": "盒",
    "targetItems": [
      "郭元益士林1867酥皮四大天王禮盒"
    ],
    "conditions": [
      "指定月餅享多入組優惠",
      "限量商品，售完為止"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#中秋禮盒",
      "#月餅",
      "#郭元益",
      "#限時預購"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-09-16",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw",
    "likeCount": 217,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
    "images": [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-0-1",
    "title": "OKmart 郭元益經典四款迷你系列禮盒 特價優惠",
    "subtitle": "迷你金沙蛋黃酥、綠豆椪、鳳梨奶黃酥、芋頭Q餅小巧一次滿足",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 66,
    "priceUnit": "盒",
    "targetItems": [
      "郭元益經典四款迷你系列禮盒"
    ],
    "conditions": [
      "指定月餅享多入組優惠",
      "限量商品，售完為止"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#中秋禮盒",
      "#月餅",
      "#郭元益",
      "#限時預購"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-09-16",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw",
    "likeCount": 238,
    "commentCount": 21,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
    "images": [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-0-2",
    "title": "OKmart 奇華奶黃迎月禮盒 特價優惠",
    "subtitle": "濃郁白蓮蓉與經典奶黃雙重滋味",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 66,
    "priceUnit": "盒",
    "targetItems": [
      "奇華奶黃迎月禮盒"
    ],
    "conditions": [
      "指定月餅享多入組優惠",
      "限量商品，售完為止"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#中秋禮盒",
      "#月餅",
      "#奇華",
      "#限時預購"
    ],
    "startDate": "2026-08-31",
    "endDate": "2026-09-16",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw",
    "likeCount": 208,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
    "images": [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-1-0",
    "title": "OKmart 灣A冰工廠X茶匠系列 綠豆鑽包種茶冰棒 / 黑金奶凍仙草茶冰棒 任選第2件10元",
    "subtitle": "OKmart週週超值選，開學倒數吃冰再收心",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 20,
    "originalPrice": 30,
    "priceUnit": "支",
    "targetItems": [
      "綠豆鑽包種茶冰棒",
      "黑金奶凍仙草茶冰棒"
    ],
    "conditions": [
      "任選第2件10元"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#冰品",
      "#冰棒",
      "#茶匠系列",
      "#任選第2件10元"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid02za3zxBRAPD3WeqQiSKyY8iMPbSovmCHAeVFX2hnRcYRXFGJadYZWKP9iuEbVHKPwl?__cft__[0]=AZZhZcfb_ML1OGmLEfTfqmSLZgeIZwrB6yKo_8ZnKy9ZCg7rEXX4lqliQxNlPzg1qXecjCu4isIUyoJaM2_Eh2D8cXtWQmRdzQnRcprTr77WEeXqlyTVOQ0_XACjQv1dLgzZV-FWQdrS00QjI8HMh5aDjvg27BQNCc1NEjXd0RDZ9jLun421x_3qRT98Y8FrCFU&__tn__=%2CO%2CP-R",
    "likeCount": 154,
    "commentCount": 6,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 30
      },
      {
        "date": "今日",
        "price": 20
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788689656_2273620180063370_6494659057447431638_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UVXyoI0562AQ7kNvwG7TbDb&_nc_oc=Adp7QtZh6bsHYHDmyNl-efQXOTzTHFtq_e5suA85A1gMIYLpAKYQsvOOErfzt3RRJvU&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQLE03K_t51E-ZmtUu_8Nalgl1bm0sZIQzPL-0ly0ggWvg&oe=6A9A77C7",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788689656_2273620180063370_6494659057447431638_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UVXyoI0562AQ7kNvwG7TbDb&_nc_oc=Adp7QtZh6bsHYHDmyNl-efQXOTzTHFtq_e5suA85A1gMIYLpAKYQsvOOErfzt3RRJvU&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQLE03K_t51E-ZmtUu_8Nalgl1bm0sZIQzPL-0ly0ggWvg&oe=6A9A77C7"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-1-1",
    "title": "OKmart 杜老爺 特級甜筒 / 淇淋巧酥甜筒 任選3件100元",
    "subtitle": "OKmart週週超值選，開學倒數吃冰再收心",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 34,
    "originalPrice": 45,
    "priceUnit": "支",
    "targetItems": [
      "特級甜筒",
      "淇淋巧酥甜筒"
    ],
    "conditions": [
      "任選3件100元"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#冰品",
      "#杜老爺",
      "#甜筒",
      "#任選3件100元"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid02za3zxBRAPD3WeqQiSKyY8iMPbSovmCHAeVFX2hnRcYRXFGJadYZWKP9iuEbVHKPwl?__cft__[0]=AZZhZcfb_ML1OGmLEfTfqmSLZgeIZwrB6yKo_8ZnKy9ZCg7rEXX4lqliQxNlPzg1qXecjCu4isIUyoJaM2_Eh2D8cXtWQmRdzQnRcprTr77WEeXqlyTVOQ0_XACjQv1dLgzZV-FWQdrS00QjI8HMh5aDjvg27BQNCc1NEjXd0RDZ9jLun421x_3qRT98Y8FrCFU&__tn__=%2CO%2CP-R",
    "likeCount": 177,
    "commentCount": 16,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 45
      },
      {
        "date": "今日",
        "price": 34
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788689656_2273620180063370_6494659057447431638_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UVXyoI0562AQ7kNvwG7TbDb&_nc_oc=Adp7QtZh6bsHYHDmyNl-efQXOTzTHFtq_e5suA85A1gMIYLpAKYQsvOOErfzt3RRJvU&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQLE03K_t51E-ZmtUu_8Nalgl1bm0sZIQzPL-0ly0ggWvg&oe=6A9A77C7",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788689656_2273620180063370_6494659057447431638_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UVXyoI0562AQ7kNvwG7TbDb&_nc_oc=Adp7QtZh6bsHYHDmyNl-efQXOTzTHFtq_e5suA85A1gMIYLpAKYQsvOOErfzt3RRJvU&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQLE03K_t51E-ZmtUu_8Nalgl1bm0sZIQzPL-0ly0ggWvg&oe=6A9A77C7"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-1-2",
    "title": "OKmart 曠世奇派 玫瑰鹽焦糖巧克力 / 草莓大雪糕 / 巧克力大雪糕 / 卡布奇諾大雪糕 任選3件100元",
    "subtitle": "OKmart週週超值選，開學倒數吃冰再收心",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 34,
    "originalPrice": 45,
    "priceUnit": "支",
    "targetItems": [
      "玫瑰鹽焦糖巧克力",
      "草莓大雪糕",
      "巧克力大雪糕",
      "卡布奇諾大雪糕"
    ],
    "conditions": [
      "任選3件100元"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#冰品",
      "#曠世奇派",
      "#雪糕",
      "#任選3件100元"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid02za3zxBRAPD3WeqQiSKyY8iMPbSovmCHAeVFX2hnRcYRXFGJadYZWKP9iuEbVHKPwl?__cft__[0]=AZZhZcfb_ML1OGmLEfTfqmSLZgeIZwrB6yKo_8ZnKy9ZCg7rEXX4lqliQxNlPzg1qXecjCu4isIUyoJaM2_Eh2D8cXtWQmRdzQnRcprTr77WEeXqlyTVOQ0_XACjQv1dLgzZV-FWQdrS00QjI8HMh5aDjvg27BQNCc1NEjXd0RDZ9jLun421x_3qRT98Y8FrCFU&__tn__=%2CO%2CP-R",
    "likeCount": 197,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 45
      },
      {
        "date": "今日",
        "price": 34
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788689656_2273620180063370_6494659057447431638_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UVXyoI0562AQ7kNvwG7TbDb&_nc_oc=Adp7QtZh6bsHYHDmyNl-efQXOTzTHFtq_e5suA85A1gMIYLpAKYQsvOOErfzt3RRJvU&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQLE03K_t51E-ZmtUu_8Nalgl1bm0sZIQzPL-0ly0ggWvg&oe=6A9A77C7",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788689656_2273620180063370_6494659057447431638_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=UVXyoI0562AQ7kNvwG7TbDb&_nc_oc=Adp7QtZh6bsHYHDmyNl-efQXOTzTHFtq_e5suA85A1gMIYLpAKYQsvOOErfzt3RRJvU&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQLE03K_t51E-ZmtUu_8Nalgl1bm0sZIQzPL-0ly0ggWvg&oe=6A9A77C7"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-2-0",
    "title": "OKmart 指定鮮食 (蒜辣雞絲涼麵/鹿兒島-豚雞雙寶燒肉便當) 搭配可可可樂系列任2瓶 送限量明信片",
    "subtitle": "購買指定鮮食任1件加可可可樂系列任2瓶，即贈限量明信片乙組(3張/組)",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 66,
    "priceUnit": "組",
    "targetItems": [
      "指定涼麵/便當",
      "可可可樂系列"
    ],
    "conditions": [
      "指定涼麵/便當任1件 + 可可可樂系列任2瓶",
      "送限量明信片乙組(3張/組)",
      "數量有限送完為止"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#鮮食",
      "#涼麵",
      "#便當",
      "#可口可樂",
      "#滿額贈"
    ],
    "startDate": "2026-08-20",
    "endDate": "2026-09-16",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid0KwAterukbgfvPZevQkHLPhi7JPwwKtii9MQGRvWyEdZkwJLAPbSqpT126RYmSneXl?__cft__[0]=AZbBGndRcGtjb0GEeVTmJ1yak5toku6L_N6shA5mKuPEDjxYlZZ0mZni8bWkoPfuAVgObS6vh8ELPO8-jK4hzukChhWeb6CR0vTgEHpt9FbN33a1Jt6-OjTtIKFiXZ7Yg5yrOR_gw_iSTFDAzOPPZEhZF0hVcgdIpf6oIFGjA0oYcgcovWRxHpzk9oW5X7oIzDc&__tn__=%2CO%2CP-R",
    "likeCount": 151,
    "commentCount": 11,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/788455269_2036068430357370_624974852188262105_n.png?stp=dst-jpg_tt6&cstp=mx780x630&ctp=s780x630&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=nTrJbxuDhOwQ7kNvwERfS-5&_nc_oc=AdqDFb_3kMTPAecdj88Sa8qW6X__Trtr2h7Fa_OnC4UFX4--fKd5WsY6pvB-Q6X6DcA&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQKjRg1_xtW3ipAdqyPnsUuGpiI7-WCUyQ-R0DXalDbuYg&oe=6A9A66EE",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/788455269_2036068430357370_624974852188262105_n.png?stp=dst-jpg_tt6&cstp=mx780x630&ctp=s780x630&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=nTrJbxuDhOwQ7kNvwERfS-5&_nc_oc=AdqDFb_3kMTPAecdj88Sa8qW6X__Trtr2h7Fa_OnC4UFX4--fKd5WsY6pvB-Q6X6DcA&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQKjRg1_xtW3ipAdqyPnsUuGpiI7-WCUyQ-R0DXalDbuYg&oe=6A9A66EE"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-3-0",
    "title": "OKmart OKCAFE 極淬莊園美式 (大杯) 買2送2",
    "subtitle": "0826一日限定，OKCAFE 極淬好咖日，大杯極淬莊園美式買2送2",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 25,
    "originalPrice": 50,
    "priceUnit": "杯",
    "targetItems": [
      "大杯極淬莊園美式"
    ],
    "conditions": [
      "一日限定",
      "大杯同品項買2送2"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#咖啡",
      "#美式咖啡",
      "#大杯",
      "#買2送2"
    ],
    "startDate": "2026-08-26",
    "endDate": "2026-08-26",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid02VTZAqy6khT6mR9Zw4LuukYo4cVHna9YRVqsJvntLXG5AkWM9nK6wvNuhNbjCRBmxl?__cft__[0]=AZbW163wyFt3x3VhU3QL4jh6Z1S0l8wur7WqfnKkD-uOkUKPWDt5JQpE0ghNJGAlrom7FwTHsb0iNnpSgB7Fl99i9H8rgsZnQBjR3HJ5H8otrpBSCQL7cMj3TByYNOv2o74hecI7lALtU8RO2un2SmfU4Y1-NQQ8RRuQ3S9f9cNAou6kE7JcHBy3G_kTE1IEUMw&__tn__=%2CO%2CP-R",
    "likeCount": 77,
    "commentCount": 10,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 50
      },
      {
        "date": "今日",
        "price": 25
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784619401_2010250386305614_5340218962871384085_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vR8pAjaRDUUQ7kNvwGuKx8U&_nc_oc=AdrXnS4EPKBtD0gVXGPC9-1t7QwtAC2GAX53tgwnKbLBGePon7hET9C9hfWENqC4hec&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQJ0IStT1gqVTX411ZIELLtSpn6FsFgwiupXJpZb4XjvLg&oe=6A9A67A5",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784619401_2010250386305614_5340218962871384085_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vR8pAjaRDUUQ7kNvwGuKx8U&_nc_oc=AdrXnS4EPKBtD0gVXGPC9-1t7QwtAC2GAX53tgwnKbLBGePon7hET9C9hfWENqC4hec&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQJ0IStT1gqVTX411ZIELLtSpn6FsFgwiupXJpZb4XjvLg&oe=6A9A67A5"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-3-1",
    "title": "OKmart OKCAFE 極淬莊園拿鐵 (大杯) 買2送2",
    "subtitle": "0826一日限定，OKCAFE 極淬好咖日，大杯極淬莊園拿鐵買2送2",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 33,
    "originalPrice": 65,
    "priceUnit": "杯",
    "targetItems": [
      "大杯極淬莊園拿鐵"
    ],
    "conditions": [
      "一日限定",
      "大杯同品項買2送2"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#咖啡",
      "#拿鐵",
      "#大杯",
      "#買2送2"
    ],
    "startDate": "2026-08-26",
    "endDate": "2026-08-26",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid02VTZAqy6khT6mR9Zw4LuukYo4cVHna9YRVqsJvntLXG5AkWM9nK6wvNuhNbjCRBmxl?__cft__[0]=AZbW163wyFt3x3VhU3QL4jh6Z1S0l8wur7WqfnKkD-uOkUKPWDt5JQpE0ghNJGAlrom7FwTHsb0iNnpSgB7Fl99i9H8rgsZnQBjR3HJ5H8otrpBSCQL7cMj3TByYNOv2o74hecI7lALtU8RO2un2SmfU4Y1-NQQ8RRuQ3S9f9cNAou6kE7JcHBy3G_kTE1IEUMw&__tn__=%2CO%2CP-R",
    "likeCount": 101,
    "commentCount": 18,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 65
      },
      {
        "date": "今日",
        "price": 33
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784619401_2010250386305614_5340218962871384085_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vR8pAjaRDUUQ7kNvwGuKx8U&_nc_oc=AdrXnS4EPKBtD0gVXGPC9-1t7QwtAC2GAX53tgwnKbLBGePon7hET9C9hfWENqC4hec&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQJ0IStT1gqVTX411ZIELLtSpn6FsFgwiupXJpZb4XjvLg&oe=6A9A67A5",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784619401_2010250386305614_5340218962871384085_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vR8pAjaRDUUQ7kNvwGuKx8U&_nc_oc=AdrXnS4EPKBtD0gVXGPC9-1t7QwtAC2GAX53tgwnKbLBGePon7hET9C9hfWENqC4hec&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=qmwe6CrK8RMexuuKmxjWjA&_nc_ss=7b289&oh=00_AQJ0IStT1gqVTX411ZIELLtSpn6FsFgwiupXJpZb4XjvLg&oe=6A9A67A5"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-4-0",
    "title": "OKmart 太古可口可樂公司20元以上飲料 任6件送芬達果味小公仔",
    "subtitle": "購買指定20元以上太古可口可樂公司飲料任6件，送芬達果味小公仔一個",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 49,
    "originalPrice": 66,
    "priceUnit": "件",
    "targetItems": [
      "太古可口可樂公司20元以上飲料"
    ],
    "conditions": [
      "指定品項任6件送芬達果味小公仔",
      "數量有限送完為止"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#飲料",
      "#可口可樂",
      "#芬達",
      "#滿件送"
    ],
    "startDate": "2026-08-20",
    "endDate": "2026-09-16",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid0myf3fCHiiXie3pWbJgorHZNyWGJMB8mqYehjv9abKxkgHeQkANAWXbzei4yRAMNTl?__cft__[0]=AZbahhBeU_7HNQLv5RIH0laOiH5t_2ZfLxkwiT7iS1BXhbbUvrsUzHOU1t2jhtShpBOw2RyYF01UeZp6YdOFSxIneKekktdMW4e-696grQrH6KhuSNozQZqU_UMTfAVg1YsmuwA9yKafUxOMjeOu7XUy06DasBUSOcqvbgpO4feL0HnfnJZ9GxS39EYdfDqWkUc&__tn__=%2CO%2CP-R",
    "likeCount": 230,
    "commentCount": 21,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 49
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/780127480_2140931043470689_1309913677341489183_n.png?stp=dst-jpg_tt6&cstp=mx1250x1000&ctp=s1250x1000&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=k8Udg1FCo5MQ7kNvwHTrHi1&_nc_oc=AdrZCasE-15ujnq60oWDEJtXCNkiBMdSIx8RxhWPRpPO3W9tv1E2rpLghzd-XKibzL4&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Gq4WBksHsOSLA9tjkUasEg&_nc_ss=7b289&oh=00_AQLb1Zpn11U2branvJ5CMfEGSHckM3PPJYvSTbMXNMs8LQ&oe=6A9A5121",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/780127480_2140931043470689_1309913677341489183_n.png?stp=dst-jpg_tt6&cstp=mx1250x1000&ctp=s1250x1000&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=k8Udg1FCo5MQ7kNvwHTrHi1&_nc_oc=AdrZCasE-15ujnq60oWDEJtXCNkiBMdSIx8RxhWPRpPO3W9tv1E2rpLghzd-XKibzL4&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Gq4WBksHsOSLA9tjkUasEg&_nc_ss=7b289&oh=00_AQLb1Zpn11U2branvJ5CMfEGSHckM3PPJYvSTbMXNMs8LQ&oe=6A9A5121"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-5-0",
    "title": "OKmart 杜老爺 特級巧克力脆皮雪糕 第2件10元",
    "subtitle": "處暑週週超值選，經典巧克力雪糕限時優惠",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 25,
    "originalPrice": 40,
    "priceUnit": "支",
    "targetItems": [
      "杜老爺特級巧克力脆皮雪糕"
    ],
    "conditions": [
      "第2件10元"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#冰品",
      "#雪糕",
      "#杜老爺",
      "#第2件10元"
    ],
    "startDate": "2026-08-21",
    "endDate": "2026-08-23",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid0eGssAr2cvFxL8o51ewwRnz9LcJ6n4WjMnVeohfVCDnzT17mCt4XuEcTbQvdosD6Al?__cft__[0]=AZajrKXj-wEjn93lWO79ot5jlfjp2LGKOTfg6iowGZjoEylnHBG-ISLYwzPPR7SZ6p62B9nhmtjA9UiDP_-x0e0hEsBgO7Hp64Wp5lIEe5Wn_KCBfbbxR7ePx6egO13UhmTdewkn1K-KqRBq4peg76_z52lCDktuTX3TdvpNPas17iwE4lcXxTlMp6McG7rOr2U&__tn__=%2CO%2CP-R",
    "likeCount": 61,
    "commentCount": 10,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 40
      },
      {
        "date": "今日",
        "price": 25
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/777515666_1688812576252776_6026566420206320578_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-AGvSssUjrIQ7kNvwF7xrQ0&_nc_oc=AdpBByZnExESOJ8B90EuEStHXLvHCGvTWI1mHwV2Daux-tB__1qAADk9_Bprqb_CCag&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Gq4WBksHsOSLA9tjkUasEg&_nc_ss=7b289&oh=00_AQJJ--yhpoNAkJwHpQzPYpAM0r1-L3ncY79bETcE7dY2SA&oe=6A9A535E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/777515666_1688812576252776_6026566420206320578_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-AGvSssUjrIQ7kNvwF7xrQ0&_nc_oc=AdpBByZnExESOJ8B90EuEStHXLvHCGvTWI1mHwV2Daux-tB__1qAADk9_Bprqb_CCag&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Gq4WBksHsOSLA9tjkUasEg&_nc_ss=7b289&oh=00_AQJJ--yhpoNAkJwHpQzPYpAM0r1-L3ncY79bETcE7dY2SA&oe=6A9A535E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-okmart-5-1",
    "title": "OKmart 杜老爺指定冰品 任選5件100元",
    "subtitle": "高級甜筒、玉井情人果大脆冰棒、芒果大鮮果BAR、抹茶紅豆QQ雪糕、柚香蜜檸脆冰棒、桂花芋頭QQ雪糕任選5件100元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "OK超商 OKmart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/OK_mart_logo.svg/1200px-OK_mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 20,
    "originalPrice": 35,
    "priceUnit": "支",
    "targetItems": [
      "高級甜筒",
      "玉井情人果大脆冰棒",
      "芒果大鮮果BAR",
      "抹茶紅豆QQ雪糕",
      "柚香蜜檸脆冰棒",
      "桂花芋頭QQ雪糕"
    ],
    "conditions": [
      "任選5件100元"
    ],
    "eligibleCards": [
      "悠遊卡",
      "一卡通",
      "國泰 CUBE 卡 (3%)"
    ],
    "tags": [
      "#OKmart",
      "#冰品",
      "#雪糕",
      "#杜老爺",
      "#任選5件100元"
    ],
    "startDate": "2026-08-21",
    "endDate": "2026-08-23",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/okmart.tw/posts/pfbid0eGssAr2cvFxL8o51ewwRnz9LcJ6n4WjMnVeohfVCDnzT17mCt4XuEcTbQvdosD6Al?__cft__[0]=AZajrKXj-wEjn93lWO79ot5jlfjp2LGKOTfg6iowGZjoEylnHBG-ISLYwzPPR7SZ6p62B9nhmtjA9UiDP_-x0e0hEsBgO7Hp64Wp5lIEe5Wn_KCBfbbxR7ePx6egO13UhmTdewkn1K-KqRBq4peg76_z52lCDktuTX3TdvpNPas17iwE4lcXxTlMp6McG7rOr2U&__tn__=%2CO%2CP-R",
    "likeCount": 140,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 35
      },
      {
        "date": "今日",
        "price": 20
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/777515666_1688812576252776_6026566420206320578_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-AGvSssUjrIQ7kNvwF7xrQ0&_nc_oc=AdpBByZnExESOJ8B90EuEStHXLvHCGvTWI1mHwV2Daux-tB__1qAADk9_Bprqb_CCag&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Gq4WBksHsOSLA9tjkUasEg&_nc_ss=7b289&oh=00_AQJJ--yhpoNAkJwHpQzPYpAM0r1-L3ncY79bETcE7dY2SA&oe=6A9A535E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/777515666_1688812576252776_6026566420206320578_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-AGvSssUjrIQ7kNvwF7xrQ0&_nc_oc=AdpBByZnExESOJ8B90EuEStHXLvHCGvTWI1mHwV2Daux-tB__1qAADk9_Bprqb_CCag&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Gq4WBksHsOSLA9tjkUasEg&_nc_ss=7b289&oh=00_AQJJ--yhpoNAkJwHpQzPYpAM0r1-L3ncY79bETcE7dY2SA&oe=6A9A535E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-0-0",
    "title": "全聯福利中心 威滅 滅蟻隊 (1.5gx6入/盒) 特價$129",
    "subtitle": "威滅滅蟻隊居家防護1.5gx6入/盒",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 129,
    "originalPrice": 129,
    "priceUnit": "盒",
    "targetItems": [
      "威滅滅蟻隊"
    ],
    "conditions": [
      "全店防蟲/除蟲商品單筆每滿299元贈300福利點"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#居家用品",
      "#防蟲除蟲",
      "#威滅",
      "#特價"
    ],
    "startDate": "2026-08-21",
    "endDate": "2026-09-03",
    "isHot": true,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid02K59mrpLoyMLHwk175uVZqw9PLPVxJiGq5rgtSHfJT6W3AdCBPQxums3rgGCvAAsAl?__cft__[0]=AZac0I8Z_l3RL_pXNaYMEFouZ7wx_ET88dcazfoW9flYdY7cCE0B2Tz94ZzpAg35MslYO5zu1FA5BHO0D0xLgqc-g4Y5ZJviKTHoRLrnZCiIcLG7FyfblI_jLhudUHvB49AbVKGHB1lciwc-ACC4Z6f30KMWOMJqVUWwk3OqVAN7iWNgSxVl0Jya5WQM4oqHR3M&__tn__=%2CO%2CP-R",
    "likeCount": 40,
    "commentCount": 19,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 129
      },
      {
        "date": "今日",
        "price": 129
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790591135_1083200764068364_4734494149262035051_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=09t2otaBx2AQ7kNvwFDYR6V&_nc_oc=Adome9Et2emdmXjXFFWKjgTlsfMjYVpVt_CtKW-Q3_P3x8urhp6PGQI4arivPtdFfmE&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQJRM4s__Xz2K8BpmCd2vdia8rMSkzdjgE2GACxe0Fa8iw&oe=6A9A5EF8",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/790591135_1083200764068364_4734494149262035051_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=09t2otaBx2AQ7kNvwFDYR6V&_nc_oc=Adome9Et2emdmXjXFFWKjgTlsfMjYVpVt_CtKW-Q3_P3x8urhp6PGQI4arivPtdFfmE&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQJRM4s__Xz2K8BpmCd2vdia8rMSkzdjgE2GACxe0Fa8iw&oe=6A9A5EF8"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-0-1",
    "title": "全聯福利中心 興安安速 水煙殺蟲劑 (20g/盒) 2盒特價$199",
    "subtitle": "興安安速水煙殺蟲劑20g/盒，2盒199元平均一盒99.5元",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 100,
    "originalPrice": 139,
    "priceUnit": "盒",
    "targetItems": [
      "興安安速水煙殺蟲劑"
    ],
    "conditions": [
      "2盒199元",
      "全店防蟲/除蟲商品單筆每滿299元贈300福利點"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#居家用品",
      "#防蟲除蟲",
      "#興安安速",
      "#特價"
    ],
    "startDate": "2026-08-21",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid02K59mrpLoyMLHwk175uVZqw9PLPVxJiGq5rgtSHfJT6W3AdCBPQxums3rgGCvAAsAl?__cft__[0]=AZac0I8Z_l3RL_pXNaYMEFouZ7wx_ET88dcazfoW9flYdY7cCE0B2Tz94ZzpAg35MslYO5zu1FA5BHO0D0xLgqc-g4Y5ZJviKTHoRLrnZCiIcLG7FyfblI_jLhudUHvB49AbVKGHB1lciwc-ACC4Z6f30KMWOMJqVUWwk3OqVAN7iWNgSxVl0Jya5WQM4oqHR3M&__tn__=%2CO%2CP-R",
    "likeCount": 192,
    "commentCount": 3,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 139
      },
      {
        "date": "今日",
        "price": 100
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788766293_4502947693284247_5411439710389932879_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4lS6Xstbw6IQ7kNvwHinR3u&_nc_oc=AdqGG2Y2Jiw4NOYf2TAAT1YpQTxy_uimgmK_PWc1DbKAvlvA_ImCKMu4BbSfFC_T0Js&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQLUQEQu2gVk1i5A37F32bHsy_3ZxAsHSrW57xEFgm3ZoA&oe=6A9A765C",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788766293_4502947693284247_5411439710389932879_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4lS6Xstbw6IQ7kNvwHinR3u&_nc_oc=AdqGG2Y2Jiw4NOYf2TAAT1YpQTxy_uimgmK_PWc1DbKAvlvA_ImCKMu4BbSfFC_T0Js&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQLUQEQu2gVk1i5A37F32bHsy_3ZxAsHSrW57xEFgm3ZoA&oe=6A9A765C"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-0-2",
    "title": "全聯福利中心 Clean Bait Power 科林比 2%蟑螂凝膠餌劑 (5g/盒) 特價$179",
    "subtitle": "科林比2%蟑螂凝膠餌劑5g/盒",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 179,
    "originalPrice": 179,
    "priceUnit": "盒",
    "targetItems": [
      "科林比2%蟑螂凝膠餌劑"
    ],
    "conditions": [
      "全店防蟲/除蟲商品單筆每滿299元贈300福利點"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#居家用品",
      "#防蟲除蟲",
      "#科林比",
      "#特價"
    ],
    "startDate": "2026-08-21",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid02K59mrpLoyMLHwk175uVZqw9PLPVxJiGq5rgtSHfJT6W3AdCBPQxums3rgGCvAAsAl?__cft__[0]=AZac0I8Z_l3RL_pXNaYMEFouZ7wx_ET88dcazfoW9flYdY7cCE0B2Tz94ZzpAg35MslYO5zu1FA5BHO0D0xLgqc-g4Y5ZJviKTHoRLrnZCiIcLG7FyfblI_jLhudUHvB49AbVKGHB1lciwc-ACC4Z6f30KMWOMJqVUWwk3OqVAN7iWNgSxVl0Jya5WQM4oqHR3M&__tn__=%2CO%2CP-R",
    "likeCount": 62,
    "commentCount": 16,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 179
      },
      {
        "date": "今日",
        "price": 179
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/787996872_1637462621237086_6612858839333627079_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qL7nvOApe5QQ7kNvwF75wAM&_nc_oc=AdoATTUrOpyrhC1mH9ZIV3fLHW-ocMGBCpKKY9L8wXmleS9KcbU_WiPQHB3tWTnmRu4&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQLkyUdv1w2iGFbXqcZkGQpIQuREzXAKV6IF2ms8O8Kizg&oe=6A9A4CD2",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/787996872_1637462621237086_6612858839333627079_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qL7nvOApe5QQ7kNvwF75wAM&_nc_oc=AdoATTUrOpyrhC1mH9ZIV3fLHW-ocMGBCpKKY9L8wXmleS9KcbU_WiPQHB3tWTnmRu4&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQLkyUdv1w2iGFbXqcZkGQpIQuREzXAKV6IF2ms8O8Kizg&oe=6A9A4CD2"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-0-3",
    "title": "全聯福利中心 安德生 蟑愛呷除蟑一號 (3gx12入/盒) 特價$105",
    "subtitle": "安德生蟑愛呷除蟑一號超大餌站3gx12入/盒",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 105,
    "originalPrice": 105,
    "priceUnit": "盒",
    "targetItems": [
      "安德生蟑愛呷除蟑一號"
    ],
    "conditions": [
      "全店防蟲/除蟲商品單筆每滿299元贈300福利點"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#居家用品",
      "#防蟲除蟲",
      "#安德生",
      "#特價"
    ],
    "startDate": "2026-08-21",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid02K59mrpLoyMLHwk175uVZqw9PLPVxJiGq5rgtSHfJT6W3AdCBPQxums3rgGCvAAsAl?__cft__[0]=AZac0I8Z_l3RL_pXNaYMEFouZ7wx_ET88dcazfoW9flYdY7cCE0B2Tz94ZzpAg35MslYO5zu1FA5BHO0D0xLgqc-g4Y5ZJviKTHoRLrnZCiIcLG7FyfblI_jLhudUHvB49AbVKGHB1lciwc-ACC4Z6f30KMWOMJqVUWwk3OqVAN7iWNgSxVl0Jya5WQM4oqHR3M&__tn__=%2CO%2CP-R",
    "likeCount": 135,
    "commentCount": 7,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 105
      },
      {
        "date": "今日",
        "price": 105
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789425137_2223337528591902_8113724401875488994_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Asg0G2hhdiAQ7kNvwF88lr6&_nc_oc=AdoplPz9AAl6FYs2OmMzvnOkId6-DgNRbRdX10mOkWx2uAcGgtLMfI1VuSt6Aw6rzRs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQIoIGOgI7MPI3zsdTgrwYZBT2W_tL6QPnGxQiJqla_5Ig&oe=6A9A70B8",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789425137_2223337528591902_8113724401875488994_n.png?stp=dst-jpg_tt6&cstp=mx1081x1081&ctp=s1081x1081&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Asg0G2hhdiAQ7kNvwF88lr6&_nc_oc=AdoplPz9AAl6FYs2OmMzvnOkId6-DgNRbRdX10mOkWx2uAcGgtLMfI1VuSt6Aw6rzRs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=QTNQf7M79zqEynhxkhTUdQ&_nc_ss=7b289&oh=00_AQIoIGOgI7MPI3zsdTgrwYZBT2W_tL6QPnGxQiJqla_5Ig&oe=6A9A70B8"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-1-0",
    "title": "全聯福利中心 récolte 無線萬用調理機 (RCP-7) 5積分/300福利點+$2380",
    "subtitle": "日本麗克特人氣話題家電，沁涼碎冰輕鬆做",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 2380,
    "originalPrice": 3990,
    "priceUnit": "台",
    "targetItems": [
      "récolte 無線萬用調理機"
    ],
    "conditions": [
      "5積分或300福利點加價購",
      "換購至9/17"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#家電",
      "#調理機",
      "#récolte麗克特",
      "#加價購"
    ],
    "startDate": "2026-07-24",
    "endDate": "2026-09-13",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034PXjHC277fKizeW5ifj7nvkhS4XgynMj5M5oCx8xCW9jNJtGULHo5mnd8FHUDBGXl?__cft__[0]=AZZ71xX7A80wFGYpndiLMUkesw8O6B-_t-kHpMQT4GuF79mr2VgmS6TvwUcfNB__slMI3P3Gg1SQiTzKbhjQScpoZX3LR2QughZt-l0DWVgbVCugj3sQf_uVDLCMQ7rqJIXHXTAnoe9a2kbA9yIXvpp9zz7AswYNIJXCcxELD13z1kawBzcZZ3xAfJHlwQLq_lw&__tn__=%2CO%2CP-R",
    "likeCount": 43,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 3990
      },
      {
        "date": "今日",
        "price": 2380
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/787701817_1420408026605339_900443846281348822_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Rf7XY42TJ98Q7kNvwHctFo_&_nc_oc=AdoshQSXm_U4afA0lpCFWU3vcO_hhuEg2LGxPw55PR3MKOV8_8ZIs1sUx3wzQMmr5sI&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQLil8N_XNIFT6-8ouwLeFDuzhucP_yVjhBUGSQ2kJh3mQ&oe=6A9A6280",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/787701817_1420408026605339_900443846281348822_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Rf7XY42TJ98Q7kNvwHctFo_&_nc_oc=AdoshQSXm_U4afA0lpCFWU3vcO_hhuEg2LGxPw55PR3MKOV8_8ZIs1sUx3wzQMmr5sI&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQLil8N_XNIFT6-8ouwLeFDuzhucP_yVjhBUGSQ2kJh3mQ&oe=6A9A6280"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-1-1",
    "title": "全聯福利中心 récolte 無線循環電風扇 (RE11) 5積分/300福利點+$4590",
    "subtitle": "日本麗克特人氣話題家電，涼感無線隨行",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 4590,
    "originalPrice": 7990,
    "priceUnit": "台",
    "targetItems": [
      "récolte 無線循環電風扇"
    ],
    "conditions": [
      "5積分或300福利點加價購",
      "換購至9/17"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#家電",
      "#電風扇",
      "#récolte麗克特",
      "#加價購"
    ],
    "startDate": "2026-07-24",
    "endDate": "2026-09-13",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034PXjHC277fKizeW5ifj7nvkhS4XgynMj5M5oCx8xCW9jNJtGULHo5mnd8FHUDBGXl?__cft__[0]=AZZ71xX7A80wFGYpndiLMUkesw8O6B-_t-kHpMQT4GuF79mr2VgmS6TvwUcfNB__slMI3P3Gg1SQiTzKbhjQScpoZX3LR2QughZt-l0DWVgbVCugj3sQf_uVDLCMQ7rqJIXHXTAnoe9a2kbA9yIXvpp9zz7AswYNIJXCcxELD13z1kawBzcZZ3xAfJHlwQLq_lw&__tn__=%2CO%2CP-R",
    "likeCount": 130,
    "commentCount": 15,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 7990
      },
      {
        "date": "今日",
        "price": 4590
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787858995_2254603035330955_8388481149862840838_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=eoiYkAiZmp4Q7kNvwHpyId6&_nc_oc=Adrzp7NnU3z8iWuGn93h79NJienfwBEkcFuEITxW-iPaqebWLv0pvrsYdak0fOsgNH8&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQL3t0bQ8gz47AiAt5FjThAJStx0Mhlw4sqfZ4wi1nH07g&oe=6A9A6024",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787858995_2254603035330955_8388481149862840838_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=eoiYkAiZmp4Q7kNvwHpyId6&_nc_oc=Adrzp7NnU3z8iWuGn93h79NJienfwBEkcFuEITxW-iPaqebWLv0pvrsYdak0fOsgNH8&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQL3t0bQ8gz47AiAt5FjThAJStx0Mhlw4sqfZ4wi1nH07g&oe=6A9A6024"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-1-2",
    "title": "全聯福利中心 récolte 蒸氣氣炸鍋 (RE3) 5積分/300福利點+$3980",
    "subtitle": "日本麗克特人氣話題家電，少油清爽夏料理",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 3980,
    "originalPrice": 8990,
    "priceUnit": "台",
    "targetItems": [
      "récolte 蒸氣氣炸鍋"
    ],
    "conditions": [
      "5積分或300福利點加價購",
      "換購至9/17"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#家電",
      "#氣炸鍋",
      "#récolte麗克特",
      "#加價購"
    ],
    "startDate": "2026-07-24",
    "endDate": "2026-09-13",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034PXjHC277fKizeW5ifj7nvkhS4XgynMj5M5oCx8xCW9jNJtGULHo5mnd8FHUDBGXl?__cft__[0]=AZZ71xX7A80wFGYpndiLMUkesw8O6B-_t-kHpMQT4GuF79mr2VgmS6TvwUcfNB__slMI3P3Gg1SQiTzKbhjQScpoZX3LR2QughZt-l0DWVgbVCugj3sQf_uVDLCMQ7rqJIXHXTAnoe9a2kbA9yIXvpp9zz7AswYNIJXCcxELD13z1kawBzcZZ3xAfJHlwQLq_lw&__tn__=%2CO%2CP-R",
    "likeCount": 96,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 8990
      },
      {
        "date": "今日",
        "price": 3980
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789506063_1614125836909234_2562395330808549922_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=7DkjYtaPHHwQ7kNvwG6aopT&_nc_oc=AdoFHyqtM4OBpYswuUzVZrvedz1K7iFFD1VTW_dyIjnGMxJts8R6vvgzbTtuGFMyn7Y&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQLZhbqJRSG91ZngtBTjrj4iSr2DmOeVHn3S07G5qzbwmA&oe=6A9A5F93",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789506063_1614125836909234_2562395330808549922_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=7DkjYtaPHHwQ7kNvwG6aopT&_nc_oc=AdoFHyqtM4OBpYswuUzVZrvedz1K7iFFD1VTW_dyIjnGMxJts8R6vvgzbTtuGFMyn7Y&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQLZhbqJRSG91ZngtBTjrj4iSr2DmOeVHn3S07G5qzbwmA&oe=6A9A5F93"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-1-3",
    "title": "全聯福利中心 récolte 料理電磁爐專用-IH對應陶瓷鍋 (RE7) 5積分/300福利點+$790",
    "subtitle": "日本麗克特人氣話題家電，IH爐料理免開火",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 790,
    "originalPrice": 1690,
    "priceUnit": "個",
    "targetItems": [
      "récolte 料理電磁爐專用-IH對應陶瓷鍋"
    ],
    "conditions": [
      "5積分或300福利點加價購",
      "換購至9/17"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#廚具",
      "#陶瓷鍋",
      "#récolte麗克特",
      "#加價購"
    ],
    "startDate": "2026-07-24",
    "endDate": "2026-09-13",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034PXjHC277fKizeW5ifj7nvkhS4XgynMj5M5oCx8xCW9jNJtGULHo5mnd8FHUDBGXl?__cft__[0]=AZZ71xX7A80wFGYpndiLMUkesw8O6B-_t-kHpMQT4GuF79mr2VgmS6TvwUcfNB__slMI3P3Gg1SQiTzKbhjQScpoZX3LR2QughZt-l0DWVgbVCugj3sQf_uVDLCMQ7rqJIXHXTAnoe9a2kbA9yIXvpp9zz7AswYNIJXCcxELD13z1kawBzcZZ3xAfJHlwQLq_lw&__tn__=%2CO%2CP-R",
    "likeCount": 104,
    "commentCount": 15,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 1690
      },
      {
        "date": "今日",
        "price": 790
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787208349_1104667182068015_7041316761527577343_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wUIh1GgsBWYQ7kNvwEWN0aj&_nc_oc=AdqWKrvMtZN2hdWUhUiDFx4mvL3_9ig9mXDaXn68_N0y2MJLIFp-QYKdF6ZTCjS-Kt0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQLsmu4VgwmqjmRCCDk-xLL6bRtW4qhpV9WiUHrd672MCA&oe=6A9A76B3",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787208349_1104667182068015_7041316761527577343_n.png?stp=dst-jpg_tt6&cstp=mx1125x1125&ctp=s1125x1125&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wUIh1GgsBWYQ7kNvwEWN0aj&_nc_oc=AdqWKrvMtZN2hdWUhUiDFx4mvL3_9ig9mXDaXn68_N0y2MJLIFp-QYKdF6ZTCjS-Kt0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQLsmu4VgwmqjmRCCDk-xLL6bRtW4qhpV9WiUHrd672MCA&oe=6A9A76B3"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-4-0",
    "title": "全聯福利中心 杜老爺曠世奇派雪糕 (90~91gx4入/盒) 特價$129",
    "subtitle": "週末大閱冰限時優惠，比利時巧克力/鹽焦糖巧克力/提拉米蘇/奧地利草莓多口味任選",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 129,
    "originalPrice": 174,
    "priceUnit": "盒",
    "targetItems": [
      "杜老爺曠世奇派雪糕"
    ],
    "conditions": [
      "限時優惠",
      "週末大閱冰"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#冰品",
      "#雪糕",
      "#杜老爺",
      "#特價"
    ],
    "startDate": "2026-06-01",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034rWGqFSSRW8s6YdNYvNx3dmUcyCky48EPPdASDQf26Jf11mMHf8sJ7BcJ15tohj2l?__cft__[0]=AZYLjEpk7e4aBey0DqxeN6KJ-au1Qyfvlmmt1ggwZn6K9dQ9dZx4bQUZMQFneukGyz-TS_NosZYkzjXhqefbdVm75R5PPI7JpLGUrr5NPd323DZSW5cg8hIQ8eg2wtrbwtReMYtP-MBPRXqlS6PvnjUFSIu414jyKzI1aQPv2j_BpX2GJbn4DRoMgCN2eetFFPs&__tn__=%2CO%2CP-R",
    "likeCount": 111,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 129
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-4-1",
    "title": "全聯福利中心 LOTTE TICO可可脆皮香草雪糕 (342g/盒) 特價$139",
    "subtitle": "週末大閱冰限時優惠，黑巧/抹茶/原味多口味任選",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 139,
    "originalPrice": 188,
    "priceUnit": "盒",
    "targetItems": [
      "LOTTE TICO可可脆皮香草雪糕"
    ],
    "conditions": [
      "限時優惠",
      "週末大閱冰"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#冰品",
      "#雪糕",
      "#LOTTE",
      "#特價"
    ],
    "startDate": "2026-06-01",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034rWGqFSSRW8s6YdNYvNx3dmUcyCky48EPPdASDQf26Jf11mMHf8sJ7BcJ15tohj2l?__cft__[0]=AZYLjEpk7e4aBey0DqxeN6KJ-au1Qyfvlmmt1ggwZn6K9dQ9dZx4bQUZMQFneukGyz-TS_NosZYkzjXhqefbdVm75R5PPI7JpLGUrr5NPd323DZSW5cg8hIQ8eg2wtrbwtReMYtP-MBPRXqlS6PvnjUFSIu414jyKzI1aQPv2j_BpX2GJbn4DRoMgCN2eetFFPs&__tn__=%2CO%2CP-R",
    "likeCount": 78,
    "commentCount": 12,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 139
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-4-2",
    "title": "全聯福利中心 鮮芋仙芋見白玉冰 (300g/盒) 特價$58",
    "subtitle": "週末大閱冰限時優惠，獨家販售",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 58,
    "originalPrice": 78,
    "priceUnit": "盒",
    "targetItems": [
      "鮮芋仙芋見白玉冰"
    ],
    "conditions": [
      "限時優惠",
      "週末大閱冰",
      "獨家"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#冰品",
      "#冰棒",
      "#鮮芋仙",
      "#特價"
    ],
    "startDate": "2026-06-01",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034rWGqFSSRW8s6YdNYvNx3dmUcyCky48EPPdASDQf26Jf11mMHf8sJ7BcJ15tohj2l?__cft__[0]=AZYLjEpk7e4aBey0DqxeN6KJ-au1Qyfvlmmt1ggwZn6K9dQ9dZx4bQUZMQFneukGyz-TS_NosZYkzjXhqefbdVm75R5PPI7JpLGUrr5NPd323DZSW5cg8hIQ8eg2wtrbwtReMYtP-MBPRXqlS6PvnjUFSIu414jyKzI1aQPv2j_BpX2GJbn4DRoMgCN2eetFFPs&__tn__=%2CO%2CP-R",
    "likeCount": 221,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 58
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-4-3",
    "title": "全聯福利中心 LOTTE爽冰淇淋家庭號 (551.6~634.8gx4入/盒) 特價$159",
    "subtitle": "週末大閱冰限時優惠，草莓煉乳/香草口味任選",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 159,
    "originalPrice": 215,
    "priceUnit": "盒",
    "targetItems": [
      "LOTTE爽冰淇淋家庭號"
    ],
    "conditions": [
      "限時優惠",
      "週末大閱冰"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#冰品",
      "#冰淇淋",
      "#LOTTE",
      "#特價"
    ],
    "startDate": "2026-06-01",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid034rWGqFSSRW8s6YdNYvNx3dmUcyCky48EPPdASDQf26Jf11mMHf8sJ7BcJ15tohj2l?__cft__[0]=AZYLjEpk7e4aBey0DqxeN6KJ-au1Qyfvlmmt1ggwZn6K9dQ9dZx4bQUZMQFneukGyz-TS_NosZYkzjXhqefbdVm75R5PPI7JpLGUrr5NPd323DZSW5cg8hIQ8eg2wtrbwtReMYtP-MBPRXqlS6PvnjUFSIu414jyKzI1aQPv2j_BpX2GJbn4DRoMgCN2eetFFPs&__tn__=%2CO%2CP-R",
    "likeCount": 147,
    "commentCount": 3,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 159
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789213887_1066082132563246_109500722428079819_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1080x2048&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pPDZk_aDA14Q7kNvwGImnNo&_nc_oc=Adq34zXM8hinrbpRDO63qDOL5JadfYQokEhXoxG-j7Aha8z6ENxToBr2UdSuOOBAYbs&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=sYyJKjT_SdvapXBVo1M7_A&_nc_ss=7b289&oh=00_AQI4lCcXSItx0wfwQnJ3p1kDKNNZBk_gG-JMKlMEhgEntw&oe=6A9A7B71"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-5-0",
    "title": "全聯福利中心 We Sweet × 食芋堂 芋頭大福 (6入/225g/盒) 特價$55",
    "subtitle": "Q彈外皮包裹綿密香濃大甲芋泥，任選2件現折10元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 55,
    "originalPrice": 55,
    "priceUnit": "盒",
    "targetItems": [
      "芋頭大福"
    ],
    "conditions": [
      "任選2件現折10元",
      "可累折"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#甜點",
      "#芋頭大福",
      "#6入",
      "#特價"
    ],
    "startDate": "2026-08-07",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid031qLGFQV3A7KMhvR7uEiNtGPeHFQpxPKkoLRpW49bkA3ZJewq5JZ6pVL5MPhefhuwl?__cft__[0]=AZYu4VlJcyISwETkCcYE-VaOLqDgqVlExg3Z3poRaT3LxU9JEKeOIXxE_moKChcbxlwXXUPlm_FTZc1HVFaWkQQHbW-07yixN1zWNfQQj_syLR4CIGcdvgHlw6rIjeDVNHY5clQhrbRdytPU41vLy_9KVNF2UgQC6fcrW3q64VLa3BIk-4FMyeK9QxLubvNHQYA&__tn__=%2CO%2CP-R",
    "likeCount": 137,
    "commentCount": 9,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 55
      },
      {
        "date": "今日",
        "price": 55
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789973202_886538657667798_8505445021553798241_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=06MjRLDXhxAQ7kNvwHZJNk9&_nc_oc=Adr6z0y67mjCaym8rgfZaYywqeP7PGw2P7UviSAKV_bjQTHMX1IJADtyzYt4ftYNvM0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQIumvkxn69Lx16pLuqjUnGqaiEjs--QhpTUcnS-F9fXXg&oe=6A9A5C12",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789973202_886538657667798_8505445021553798241_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=06MjRLDXhxAQ7kNvwHZJNk9&_nc_oc=Adr6z0y67mjCaym8rgfZaYywqeP7PGw2P7UviSAKV_bjQTHMX1IJADtyzYt4ftYNvM0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQIumvkxn69Lx16pLuqjUnGqaiEjs--QhpTUcnS-F9fXXg&oe=6A9A5C12"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-5-1",
    "title": "全聯福利中心 We Sweet × 食芋堂 芋頭布丁塔 (2入/140g/盒) 特價$79",
    "subtitle": "酥脆塔皮搭配香甜綿密芋泥餡與軟嫩布丁，任選2件現折10元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 79,
    "originalPrice": 79,
    "priceUnit": "盒",
    "targetItems": [
      "芋頭布丁塔"
    ],
    "conditions": [
      "任選2件現折10元",
      "可累折"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#甜點",
      "#芋頭布丁塔",
      "#2入",
      "#特價"
    ],
    "startDate": "2026-08-07",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid031qLGFQV3A7KMhvR7uEiNtGPeHFQpxPKkoLRpW49bkA3ZJewq5JZ6pVL5MPhefhuwl?__cft__[0]=AZYu4VlJcyISwETkCcYE-VaOLqDgqVlExg3Z3poRaT3LxU9JEKeOIXxE_moKChcbxlwXXUPlm_FTZc1HVFaWkQQHbW-07yixN1zWNfQQj_syLR4CIGcdvgHlw6rIjeDVNHY5clQhrbRdytPU41vLy_9KVNF2UgQC6fcrW3q64VLa3BIk-4FMyeK9QxLubvNHQYA&__tn__=%2CO%2CP-R",
    "likeCount": 88,
    "commentCount": 14,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 79
      },
      {
        "date": "今日",
        "price": 79
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789973202_886538657667798_8505445021553798241_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=06MjRLDXhxAQ7kNvwHZJNk9&_nc_oc=Adr6z0y67mjCaym8rgfZaYywqeP7PGw2P7UviSAKV_bjQTHMX1IJADtyzYt4ftYNvM0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQIumvkxn69Lx16pLuqjUnGqaiEjs--QhpTUcnS-F9fXXg&oe=6A9A5C12",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/789973202_886538657667798_8505445021553798241_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=06MjRLDXhxAQ7kNvwHZJNk9&_nc_oc=Adr6z0y67mjCaym8rgfZaYywqeP7PGw2P7UviSAKV_bjQTHMX1IJADtyzYt4ftYNvM0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQIumvkxn69Lx16pLuqjUnGqaiEjs--QhpTUcnS-F9fXXg&oe=6A9A5C12"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-5-2",
    "title": "全聯福利中心 We Sweet × 食芋堂 芋泥布蕾盒 (380g/盒) 特價$139",
    "subtitle": "原味布蕾X鬆軟蛋糕X綿密芋泥三重口感，任選2件現折10元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 139,
    "originalPrice": 139,
    "priceUnit": "盒",
    "targetItems": [
      "芋泥布蕾盒"
    ],
    "conditions": [
      "任選2件現折10元",
      "可累折"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#甜點",
      "#芋泥布蕾盒",
      "#380g",
      "#特價"
    ],
    "startDate": "2026-08-07",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid031qLGFQV3A7KMhvR7uEiNtGPeHFQpxPKkoLRpW49bkA3ZJewq5JZ6pVL5MPhefhuwl?__cft__[0]=AZYu4VlJcyISwETkCcYE-VaOLqDgqVlExg3Z3poRaT3LxU9JEKeOIXxE_moKChcbxlwXXUPlm_FTZc1HVFaWkQQHbW-07yixN1zWNfQQj_syLR4CIGcdvgHlw6rIjeDVNHY5clQhrbRdytPU41vLy_9KVNF2UgQC6fcrW3q64VLa3BIk-4FMyeK9QxLubvNHQYA&__tn__=%2CO%2CP-R",
    "likeCount": 45,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 139
      },
      {
        "date": "今日",
        "price": 139
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786801708_1521013350040348_2028029508207539694_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qva5uKe-VDwQ7kNvwHduRHe&_nc_oc=Adqz9YuBkI3eVYkoje_9_VlmM0BT3SSas0UijRyF2G_sU7WbRsRP6nrpsKo_zDcBl6Y&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQLN76yc7dgUkTg-Ib40PenG6vJeSY_1tdWuAaaj-kYLzQ&oe=6A9A6802",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786801708_1521013350040348_2028029508207539694_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qva5uKe-VDwQ7kNvwHduRHe&_nc_oc=Adqz9YuBkI3eVYkoje_9_VlmM0BT3SSas0UijRyF2G_sU7WbRsRP6nrpsKo_zDcBl6Y&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQLN76yc7dgUkTg-Ib40PenG6vJeSY_1tdWuAaaj-kYLzQ&oe=6A9A6802"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-5-3",
    "title": "全聯福利中心 We Sweet × 食芋堂 芋頭麻糬雙餡銅鑼燒 (4入/260g/盒) 特價$79",
    "subtitle": "蓬鬆柔軟餅皮，夾入滑順芋頭內餡與Q彈麻糬，任選2件現折10元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 79,
    "originalPrice": 79,
    "priceUnit": "盒",
    "targetItems": [
      "芋頭麻糬雙餡銅鑼燒"
    ],
    "conditions": [
      "任選2件現折10元",
      "可累折"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#甜點",
      "#芋頭麻糬雙餡銅鑼燒",
      "#4入",
      "#特價"
    ],
    "startDate": "2026-08-07",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid031qLGFQV3A7KMhvR7uEiNtGPeHFQpxPKkoLRpW49bkA3ZJewq5JZ6pVL5MPhefhuwl?__cft__[0]=AZYu4VlJcyISwETkCcYE-VaOLqDgqVlExg3Z3poRaT3LxU9JEKeOIXxE_moKChcbxlwXXUPlm_FTZc1HVFaWkQQHbW-07yixN1zWNfQQj_syLR4CIGcdvgHlw6rIjeDVNHY5clQhrbRdytPU41vLy_9KVNF2UgQC6fcrW3q64VLa3BIk-4FMyeK9QxLubvNHQYA&__tn__=%2CO%2CP-R",
    "likeCount": 85,
    "commentCount": 9,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 79
      },
      {
        "date": "今日",
        "price": 79
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785638713_1730588581497179_8347268113773997567_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=C0m7AGymp-cQ7kNvwFhrApj&_nc_oc=AdrQRzmgyOGjCuGsuu2Sp5cNPI3xyGh4zeME_gyvsT_XviHQ9amKS-aQ1axO_yf0amA&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQKHrUyTbM-9KFKWA51q8ypzvxuiCKYOB9uEfdxyuuIQ4w&oe=6A9A4E9E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785638713_1730588581497179_8347268113773997567_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=C0m7AGymp-cQ7kNvwFhrApj&_nc_oc=AdrQRzmgyOGjCuGsuu2Sp5cNPI3xyGh4zeME_gyvsT_XviHQ9amKS-aQ1axO_yf0amA&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQKHrUyTbM-9KFKWA51q8ypzvxuiCKYOB9uEfdxyuuIQ4w&oe=6A9A4E9E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-pxmart-5-4",
    "title": "全聯福利中心 We Sweet × 食芋堂 芋見布蕾蛋糕 (260g/盒) 特價$139",
    "subtitle": "綿密芋頭戚風搭配滑順布蕾與醇厚芋泥，任選2件現折10元",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "全聯福利中心",
      "logo": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/26/PX_Mart_logo.svg/1200px-PX_Mart_logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 139,
    "originalPrice": 139,
    "priceUnit": "盒",
    "targetItems": [
      "芋見布蕾蛋糕"
    ],
    "conditions": [
      "任選2件現折10元",
      "可累折"
    ],
    "eligibleCards": [
      "全支付 (4.5%)",
      "PX Pay",
      "國泰世華信用卡"
    ],
    "tags": [
      "#全聯福利中心",
      "#甜點",
      "#芋見布蕾蛋糕",
      "#260g",
      "#特價"
    ],
    "startDate": "2026-08-07",
    "endDate": "2026-09-03",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/pxmartchannel/posts/pfbid031qLGFQV3A7KMhvR7uEiNtGPeHFQpxPKkoLRpW49bkA3ZJewq5JZ6pVL5MPhefhuwl?__cft__[0]=AZYu4VlJcyISwETkCcYE-VaOLqDgqVlExg3Z3poRaT3LxU9JEKeOIXxE_moKChcbxlwXXUPlm_FTZc1HVFaWkQQHbW-07yixN1zWNfQQj_syLR4CIGcdvgHlw6rIjeDVNHY5clQhrbRdytPU41vLy_9KVNF2UgQC6fcrW3q64VLa3BIk-4FMyeK9QxLubvNHQYA&__tn__=%2CO%2CP-R",
    "likeCount": 68,
    "commentCount": 21,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 139
      },
      {
        "date": "今日",
        "price": 139
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785638713_1730588581497179_8347268113773997567_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=C0m7AGymp-cQ7kNvwFhrApj&_nc_oc=AdrQRzmgyOGjCuGsuu2Sp5cNPI3xyGh4zeME_gyvsT_XviHQ9amKS-aQ1axO_yf0amA&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQKHrUyTbM-9KFKWA51q8ypzvxuiCKYOB9uEfdxyuuIQ4w&oe=6A9A4E9E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/785638713_1730588581497179_8347268113773997567_n.png?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=C0m7AGymp-cQ7kNvwFhrApj&_nc_oc=AdrQRzmgyOGjCuGsuu2Sp5cNPI3xyGh4zeME_gyvsT_XviHQ9amKS-aQ1axO_yf0amA&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=01n_zc9uUXN9FNCsumNxuA&_nc_ss=7b289&oh=00_AQKHrUyTbM-9KFKWA51q8ypzvxuiCKYOB9uEfdxyuuIQ4w&oe=6A9A4E9E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-1-0",
    "title": "美廉社 喜憨兒愛點心 憨喜虎咬豬 (預購組) 特價$399",
    "subtitle": "內容物：貝殼刈包40g x 6顆、岩燒風味客家豬肉230g",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 399,
    "originalPrice": 399,
    "priceUnit": "組",
    "targetItems": [
      "喜憨兒愛點心 憨喜虎咬豬"
    ],
    "conditions": [
      "門市預購",
      "愛心捐贈"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#中秋禮盒",
      "#喜憨兒基金會",
      "#刈包",
      "#預購特價"
    ],
    "startDate": "2026-01-01",
    "endDate": "2026-09-08",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid0bxDpAxSWEgfBFHWNeVdjvZr21G745P4wRdVkGgRfsmjY7NZp7ykuhT2z7Kju1tMyl?__cft__[0]=AZa0hsqNl-pDHJq9uGFGZXOU3k2LwwMqROdP0r8DRQErzdAtYEHjoyVpCW_jiv7AHLmnjn-n4lIPkPCi_czNoCrzaJ81K-WDWedii8NxMDTa5_rYjOtvr9qrUd4EV2a4IDKZYF_xmhVe9UjeqwnooL69fDQZzsJ-Tf4vt6FykUGWInt5zsNTJDVnkmh_Urr1-wE&__tn__=%2CO%2CP-R",
    "likeCount": 118,
    "commentCount": 13,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 399
      },
      {
        "date": "今日",
        "price": 399
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787542029_2391312734731395_2184891456070177139_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2VcLh6hwKpUQ7kNvwHMt153&_nc_oc=Adq46qBxwpIyMNU_alxuDt0Oc2k_3uE0QEFF7gFjhsyxKZsiHTcdSwaAGannRJI7FB0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIbv9QprO1UGAQWQrUwNImeCu7pYtwyPy13ISjZNy_d5g&oe=6A9A5E82",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787542029_2391312734731395_2184891456070177139_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2VcLh6hwKpUQ7kNvwHMt153&_nc_oc=Adq46qBxwpIyMNU_alxuDt0Oc2k_3uE0QEFF7gFjhsyxKZsiHTcdSwaAGannRJI7FB0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIbv9QprO1UGAQWQrUwNImeCu7pYtwyPy13ISjZNy_d5g&oe=6A9A5E82"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-1-1",
    "title": "美廉社 幸福珍味愛心餐 (預購組) 特價$399",
    "subtitle": "內容物：味付海蜇200g、中華牛蒡絲200g、響宴海鮮粥400g、上品蕈菇養生湯300g、Q波芒芒枝甘露150g各1份",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 399,
    "originalPrice": 399,
    "priceUnit": "組",
    "targetItems": [
      "幸福珍味愛心餐"
    ],
    "conditions": [
      "門市預購",
      "愛心捐贈"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#中秋愛心餐",
      "#朝興啟能中心",
      "#調理包",
      "#預購特價"
    ],
    "startDate": "2026-01-01",
    "endDate": "2026-09-08",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid0bxDpAxSWEgfBFHWNeVdjvZr21G745P4wRdVkGgRfsmjY7NZp7ykuhT2z7Kju1tMyl?__cft__[0]=AZa0hsqNl-pDHJq9uGFGZXOU3k2LwwMqROdP0r8DRQErzdAtYEHjoyVpCW_jiv7AHLmnjn-n4lIPkPCi_czNoCrzaJ81K-WDWedii8NxMDTa5_rYjOtvr9qrUd4EV2a4IDKZYF_xmhVe9UjeqwnooL69fDQZzsJ-Tf4vt6FykUGWInt5zsNTJDVnkmh_Urr1-wE&__tn__=%2CO%2CP-R",
    "likeCount": 196,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 399
      },
      {
        "date": "今日",
        "price": 399
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787542029_2391312734731395_2184891456070177139_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2VcLh6hwKpUQ7kNvwHMt153&_nc_oc=Adq46qBxwpIyMNU_alxuDt0Oc2k_3uE0QEFF7gFjhsyxKZsiHTcdSwaAGannRJI7FB0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIbv9QprO1UGAQWQrUwNImeCu7pYtwyPy13ISjZNy_d5g&oe=6A9A5E82",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787542029_2391312734731395_2184891456070177139_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2VcLh6hwKpUQ7kNvwHMt153&_nc_oc=Adq46qBxwpIyMNU_alxuDt0Oc2k_3uE0QEFF7gFjhsyxKZsiHTcdSwaAGannRJI7FB0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIbv9QprO1UGAQWQrUwNImeCu7pYtwyPy13ISjZNy_d5g&oe=6A9A5E82"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-1-2",
    "title": "美廉社 金安心尿布組 (預購組) 特價$295",
    "subtitle": "內容物：超柔看護墊XL號10片、加長型尿片30片",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 295,
    "originalPrice": 295,
    "priceUnit": "組",
    "targetItems": [
      "金安心尿布組"
    ],
    "conditions": [
      "門市預購",
      "愛心捐贈"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#照護用品",
      "#成人看護墊",
      "#尿布組",
      "#預購特價"
    ],
    "startDate": "2026-01-01",
    "endDate": "2026-09-08",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid0bxDpAxSWEgfBFHWNeVdjvZr21G745P4wRdVkGgRfsmjY7NZp7ykuhT2z7Kju1tMyl?__cft__[0]=AZa0hsqNl-pDHJq9uGFGZXOU3k2LwwMqROdP0r8DRQErzdAtYEHjoyVpCW_jiv7AHLmnjn-n4lIPkPCi_czNoCrzaJ81K-WDWedii8NxMDTa5_rYjOtvr9qrUd4EV2a4IDKZYF_xmhVe9UjeqwnooL69fDQZzsJ-Tf4vt6FykUGWInt5zsNTJDVnkmh_Urr1-wE&__tn__=%2CO%2CP-R",
    "likeCount": 213,
    "commentCount": 10,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 295
      },
      {
        "date": "今日",
        "price": 295
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787542029_2391312734731395_2184891456070177139_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2VcLh6hwKpUQ7kNvwHMt153&_nc_oc=Adq46qBxwpIyMNU_alxuDt0Oc2k_3uE0QEFF7gFjhsyxKZsiHTcdSwaAGannRJI7FB0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIbv9QprO1UGAQWQrUwNImeCu7pYtwyPy13ISjZNy_d5g&oe=6A9A5E82",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787542029_2391312734731395_2184891456070177139_n.png?stp=dst-jpg_tt6&cstp=mx1040x1040&ctp=s1040x1040&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2VcLh6hwKpUQ7kNvwHMt153&_nc_oc=Adq46qBxwpIyMNU_alxuDt0Oc2k_3uE0QEFF7gFjhsyxKZsiHTcdSwaAGannRJI7FB0&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIbv9QprO1UGAQWQrUwNImeCu7pYtwyPy13ISjZNy_d5g&oe=6A9A5E82"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-2-0",
    "title": "美廉社 明治超級杯冰淇淋 (水果優格派對149.9g) 買1送1",
    "subtitle": "APP隨買隨取限定，週末促銷巷口3天限定",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 39.5,
    "originalPrice": 79,
    "priceUnit": "杯",
    "targetItems": [
      "明治超級杯冰淇淋-水果優格派對149.9g"
    ],
    "conditions": [
      "APP隨買隨取限定",
      "買1送1",
      "巷口3天限定"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#冰品",
      "#明治超級杯冰淇淋",
      "#水果優格派對149.9g",
      "#買1送1"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": true,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid02Bio7PbrfckWkBGAHW2YqHuN46MYaroPznZY27Duc1YUmzivzPzEa6yuGANybaL52l?__cft__[0]=AZYkfgD2PPOXtqMHFmSSKxPm2z8KUGFHDcdysiS0pvzuAhpZmG7yRswFspOpj5DBKBPnlAdocWHBr7qMUL8SmAQ6r9fB04v-N3PbzbAayFeDJSRGlp6DzBple5w8A_cAp9wQq4joZTR9i9-jKXYygcAeRatE40mtXrCcQ30g41l3dmlFG7k3F9q4PBEmTmzMfBg&__tn__=%2CO%2CP-R",
    "likeCount": 84,
    "commentCount": 13,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 79
      },
      {
        "date": "今日",
        "price": 39.5
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784240296_1794101175284189_1992333874475433152_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=f0eSLTH-wQMQ7kNvwERN2oM&_nc_oc=AdrW3pJk6zb_VnWfMiT61UL2B5tuwbUzuajA5cuhBKRIitGmmH3y4RYf7HiXoIK2aug&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIltvPYu-yEdZBI6JG9vMWgprvOpRUI_KiRYMDviwXd2A&oe=6A9A552E",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784240296_1794101175284189_1992333874475433152_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=f0eSLTH-wQMQ7kNvwERN2oM&_nc_oc=AdrW3pJk6zb_VnWfMiT61UL2B5tuwbUzuajA5cuhBKRIitGmmH3y4RYf7HiXoIK2aug&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIltvPYu-yEdZBI6JG9vMWgprvOpRUI_KiRYMDviwXd2A&oe=6A9A552E"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-2-1",
    "title": "美廉社 麻豆文旦 (450g / 2入) 特價$59",
    "subtitle": "APP隨買隨取限定，週末促銷巷口3天限定",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 29.5,
    "originalPrice": 39,
    "priceUnit": "入",
    "targetItems": [
      "麻豆文旦450g"
    ],
    "conditions": [
      "APP隨買隨取限定",
      "2入59元",
      "巷口3天限定"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#生鮮水果",
      "#麻豆文旦",
      "#450g",
      "#特價$59"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid02Bio7PbrfckWkBGAHW2YqHuN46MYaroPznZY27Duc1YUmzivzPzEa6yuGANybaL52l?__cft__[0]=AZYkfgD2PPOXtqMHFmSSKxPm2z8KUGFHDcdysiS0pvzuAhpZmG7yRswFspOpj5DBKBPnlAdocWHBr7qMUL8SmAQ6r9fB04v-N3PbzbAayFeDJSRGlp6DzBple5w8A_cAp9wQq4joZTR9i9-jKXYygcAeRatE40mtXrCcQ30g41l3dmlFG7k3F9q4PBEmTmzMfBg&__tn__=%2CO%2CP-R",
    "likeCount": 67,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 39
      },
      {
        "date": "今日",
        "price": 29.5
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788261075_2144118459835309_1024076907572013109_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=GuhU7kew3YwQ7kNvwGRnoXo&_nc_oc=AdqTW6kX-_S196BVwPWrUWGqA1fAUAhOFXYO1p2XhL-ge8tfygGVIYxkDEl72zkaURc&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIvsCsAo37Jnmm-YJWkaQcfkJ_GZf7d0m_qvXSAPCrZpQ&oe=6A9A778B",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788261075_2144118459835309_1024076907572013109_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=GuhU7kew3YwQ7kNvwGRnoXo&_nc_oc=AdqTW6kX-_S196BVwPWrUWGqA1fAUAhOFXYO1p2XhL-ge8tfygGVIYxkDEl72zkaURc&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQIvsCsAo37Jnmm-YJWkaQcfkJ_GZf7d0m_qvXSAPCrZpQ&oe=6A9A778B"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-2-2",
    "title": "美廉社 W手工豬肉水餃 (高麗菜/韭菜 720g) 任2包$149",
    "subtitle": "APP隨買隨取限定，週末促銷巷口3天限定",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 74.5,
    "originalPrice": 139,
    "priceUnit": "包",
    "targetItems": [
      "W手工豬肉水餃高麗菜720g",
      "W手工豬肉水餃韭菜720g"
    ],
    "conditions": [
      "APP隨買隨取限定",
      "任2包149元",
      "巷口3天限定"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#冷凍食品",
      "#W手工豬肉水餃",
      "#720g",
      "#任2包$149"
    ],
    "startDate": "2026-08-28",
    "endDate": "2026-08-30",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid02Bio7PbrfckWkBGAHW2YqHuN46MYaroPznZY27Duc1YUmzivzPzEa6yuGANybaL52l?__cft__[0]=AZYkfgD2PPOXtqMHFmSSKxPm2z8KUGFHDcdysiS0pvzuAhpZmG7yRswFspOpj5DBKBPnlAdocWHBr7qMUL8SmAQ6r9fB04v-N3PbzbAayFeDJSRGlp6DzBple5w8A_cAp9wQq4joZTR9i9-jKXYygcAeRatE40mtXrCcQ30g41l3dmlFG7k3F9q4PBEmTmzMfBg&__tn__=%2CO%2CP-R",
    "likeCount": 225,
    "commentCount": 21,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 139
      },
      {
        "date": "今日",
        "price": 74.5
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786060394_1798860051288673_6999405090962858454_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-2Si945LbzkQ7kNvwEAaguE&_nc_oc=AdrNmP6Km9xFSDHxQz8iyBOPtvS5CSWi1O-7PUYFmAdzLK0IJ5Dowzx_a5bw-wb_xu4&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQKSDVnDZ8RIIO8tixYHKMXVOA4_CHhLGa8TQemhkXugMw&oe=6A9A7E19",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/786060394_1798860051288673_6999405090962858454_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-2Si945LbzkQ7kNvwEAaguE&_nc_oc=AdrNmP6Km9xFSDHxQz8iyBOPtvS5CSWi1O-7PUYFmAdzLK0IJ5Dowzx_a5bw-wb_xu4&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQKSDVnDZ8RIIO8tixYHKMXVOA4_CHhLGa8TQemhkXugMw&oe=6A9A7E19"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-3-0",
    "title": "美廉社 天時莓果冷凍栽種藍莓 (400g) 特價$195",
    "subtitle": "APP隨買隨取 週週超瘋價",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 195,
    "originalPrice": 263,
    "priceUnit": "包",
    "targetItems": [
      "天時莓果冷凍栽種藍莓 400g"
    ],
    "conditions": [
      "APP隨買隨取",
      "數量有限，售完為止"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#冷凍食品",
      "#藍莓",
      "#400g",
      "#特價"
    ],
    "startDate": "2026-08-27",
    "endDate": "2026-08-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid02U8EYPF7DaA3KZZKnRoCHY9224y1TM2SaAxzAabV3fA2eNAGbJmPgCHGCvGZ56Bfml?__cft__[0]=AZbjAq4ACc1dxdraNDequmTTn3YXp7niaXBD77c_dMUfgSz2YPYNvasrLZ-7Z86uRpeatCq_I4Zcr2W_gGfKc8h7EJkT9QOGJYpI9LeroPPsR3JL22-uVnTWD2G1-GsoAXCGbaImIVCS9woAB1l33DbynZM1LpgJGuXovdLzc7sC298_R9Se6FQaT9QHQYcIjSg&__tn__=%2CO%2CP-R",
    "likeCount": 211,
    "commentCount": 22,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 195
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784197769_1879121489736405_4109587957607942291_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ZOaasXLrHwgQ7kNvwGmDwrC&_nc_oc=AdqjlyXCqqIG9LnPmiP5VfvjEPMntg5TEKXBNZ3J_cBXjtuMAk53KquOckBbDJ1kV64&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQLsXzC4h1H30bfsosaMad2HsbXYsd4ba4ecS_MH35rNxw&oe=6A9A7D6C",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/784197769_1879121489736405_4109587957607942291_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ZOaasXLrHwgQ7kNvwGmDwrC&_nc_oc=AdqjlyXCqqIG9LnPmiP5VfvjEPMntg5TEKXBNZ3J_cBXjtuMAk53KquOckBbDJ1kV64&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQLsXzC4h1H30bfsosaMad2HsbXYsd4ba4ecS_MH35rNxw&oe=6A9A7D6C"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-3-1",
    "title": "美廉社 杜老爺玉井情人果大脆冰棒 (83g*4) 特價$84",
    "subtitle": "APP隨買隨取 週週超瘋價",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 84,
    "originalPrice": 113,
    "priceUnit": "盒",
    "targetItems": [
      "杜老爺玉井情人果大脆冰棒 83g*4"
    ],
    "conditions": [
      "APP隨買隨取",
      "數量有限，售完為止"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#冰品",
      "#情人果冰棒",
      "#83g*4",
      "#特價"
    ],
    "startDate": "2026-08-27",
    "endDate": "2026-08-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid02U8EYPF7DaA3KZZKnRoCHY9224y1TM2SaAxzAabV3fA2eNAGbJmPgCHGCvGZ56Bfml?__cft__[0]=AZbjAq4ACc1dxdraNDequmTTn3YXp7niaXBD77c_dMUfgSz2YPYNvasrLZ-7Z86uRpeatCq_I4Zcr2W_gGfKc8h7EJkT9QOGJYpI9LeroPPsR3JL22-uVnTWD2G1-GsoAXCGbaImIVCS9woAB1l33DbynZM1LpgJGuXovdLzc7sC298_R9Se6FQaT9QHQYcIjSg&__tn__=%2CO%2CP-R",
    "likeCount": 95,
    "commentCount": 8,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 84
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/787310139_1610010470538886_1119128943816905735_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=svDHKPZvqZ8Q7kNvwFqqAyd&_nc_oc=Adp2sCDsc1xvYlDyZRsjoFMLF3AGHJPxA4NkIMoMOfZIbImeBODW0d9HmT20nD519jc&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQKsff1qGhTftJ0H57gAfghVz2y4yx6_gEaAAu7FSSKAUg&oe=6A9A69A0",
    "images": [
      "https://scontent-tpe5-1.xx.fbcdn.net/v/t39.99422-6/787310139_1610010470538886_1119128943816905735_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=svDHKPZvqZ8Q7kNvwFqqAyd&_nc_oc=Adp2sCDsc1xvYlDyZRsjoFMLF3AGHJPxA4NkIMoMOfZIbImeBODW0d9HmT20nD519jc&_nc_zt=14&_nc_ht=scontent-tpe5-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQKsff1qGhTftJ0H57gAfghVz2y4yx6_gEaAAu7FSSKAUg&oe=6A9A69A0"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-3-2",
    "title": "美廉社 心樸EX強氣泡水 (500ml) 特價$14",
    "subtitle": "APP隨買隨取 週週超瘋價",
    "category": "grocery",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 14,
    "originalPrice": 19,
    "priceUnit": "瓶",
    "targetItems": [
      "心樸EX強氣泡水 500ml"
    ],
    "conditions": [
      "APP隨買隨取",
      "數量有限，售完為止"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#飲料",
      "#氣泡水",
      "#500ml",
      "#特價"
    ],
    "startDate": "2026-08-27",
    "endDate": "2026-08-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid02U8EYPF7DaA3KZZKnRoCHY9224y1TM2SaAxzAabV3fA2eNAGbJmPgCHGCvGZ56Bfml?__cft__[0]=AZbjAq4ACc1dxdraNDequmTTn3YXp7niaXBD77c_dMUfgSz2YPYNvasrLZ-7Z86uRpeatCq_I4Zcr2W_gGfKc8h7EJkT9QOGJYpI9LeroPPsR3JL22-uVnTWD2G1-GsoAXCGbaImIVCS9woAB1l33DbynZM1LpgJGuXovdLzc7sC298_R9Se6FQaT9QHQYcIjSg&__tn__=%2CO%2CP-R",
    "likeCount": 229,
    "commentCount": 18,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 14
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787191166_4567977580190707_4142805914246095853_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wl4Bg0JxKqcQ7kNvwEbr5Ej&_nc_oc=Adrc5ORi94g1xUk259pxWO5xKByPMXPA8lQPlW2UmCjJSx2dRIgi-E61BmJEWNP7S4o&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQJ00YFyYiqjroRF1Wd3DlDSrnZWGRyPZ_lmx4hN6_Kl5Q&oe=6A9A5141",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/787191166_4567977580190707_4142805914246095853_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wl4Bg0JxKqcQ7kNvwEbr5Ej&_nc_oc=Adrc5ORi94g1xUk259pxWO5xKByPMXPA8lQPlW2UmCjJSx2dRIgi-E61BmJEWNP7S4o&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQJ00YFyYiqjroRF1Wd3DlDSrnZWGRyPZ_lmx4hN6_Kl5Q&oe=6A9A5141"
    ],
    "aspectRatio": "4:3"
  },
  {
    "id": "deal-simplemart-3-3",
    "title": "美廉社 龍鳳冷凍細脆薯條 (800g) 特價$99",
    "subtitle": "APP隨買隨取 週週超瘋價",
    "category": "food",
    "channelType": "offline",
    "merchant": {
      "name": "美廉社 Simple Mart",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png",
      "storeBranches": "全台實體門市"
    },
    "regions": [
      "全台門市",
      "台北市",
      "新北市",
      "台中市",
      "高雄市"
    ],
    "discountPrice": 99,
    "originalPrice": 134,
    "priceUnit": "包",
    "targetItems": [
      "龍鳳冷凍細脆薯條 800g"
    ],
    "conditions": [
      "APP隨買隨取",
      "數量有限，售完為止"
    ],
    "eligibleCards": [
      "LINE Pay (3%)",
      "台灣Pay",
      "全支付"
    ],
    "tags": [
      "#美廉社",
      "#冷凍食品",
      "#薯條",
      "#800g",
      "#特價"
    ],
    "startDate": "2026-08-27",
    "endDate": "2026-08-27",
    "isHot": false,
    "isFlashDeal": false,
    "source": "social_listening",
    "sourcePlatform": "Convenience",
    "sourceUrl": "https://www.facebook.com/simplemart1/posts/pfbid02U8EYPF7DaA3KZZKnRoCHY9224y1TM2SaAxzAabV3fA2eNAGbJmPgCHGCvGZ56Bfml?__cft__[0]=AZbjAq4ACc1dxdraNDequmTTn3YXp7niaXBD77c_dMUfgSz2YPYNvasrLZ-7Z86uRpeatCq_I4Zcr2W_gGfKc8h7EJkT9QOGJYpI9LeroPPsR3JL22-uVnTWD2G1-GsoAXCGbaImIVCS9woAB1l33DbynZM1LpgJGuXovdLzc7sC298_R9Se6FQaT9QHQYcIjSg&__tn__=%2CO%2CP-R",
    "likeCount": 111,
    "commentCount": 10,
    "priceHistory": [
      {
        "date": "昨日",
        "price": 60
      },
      {
        "date": "今日",
        "price": 99
      }
    ],
    "priceDropAlert": {
      "isLowest90Days": true,
      "isSuspiciousHike": false,
      "note": "Gemini AI 智能識別活動日期與折算均價！"
    },
    "imageUrl": "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788455280_1535938631548763_5716093351052895165_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Qxhju70_GL8Q7kNvwEUNtGB&_nc_oc=AdqQqCyya6FGvuxng5AMJdc_cC8-zzzIsSuKXLRY2xtNlvzBp3fe9Mmhu4y9AAz504E&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQI1kpdy6nJySQO9utK26Kti5gpTlRUVPguCh4MBRVQNpg&oe=6A9A7640",
    "images": [
      "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.99422-6/788455280_1535938631548763_5716093351052895165_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Qxhju70_GL8Q7kNvwEUNtGB&_nc_oc=AdqQqCyya6FGvuxng5AMJdc_cC8-zzzIsSuKXLRY2xtNlvzBp3fe9Mmhu4y9AAz504E&_nc_zt=14&_nc_ht=scontent-tpe1-1.xx&_nc_gid=fGu5rcDvYfB0Co8cnVuajQ&_nc_ss=7b289&oh=00_AQI1kpdy6nJySQO9utK26Kti5gpTlRUVPguCh4MBRVQNpg&oe=6A9A7640"
    ],
    "aspectRatio": "4:3"
  }
];
