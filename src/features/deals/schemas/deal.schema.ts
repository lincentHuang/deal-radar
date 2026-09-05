import { z } from 'zod';

export const PriceHistoryPointSchema = z.object({
  date: z.string(),
  price: z.number().positive(),
});

export const DealAspectRatioSchema = z.enum(['1:1', '3:4', '4:3', '16:9', '9:16']);

export const SmartDealSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2, '特價標題至少需 2 個字元'),
  subtitle: z.string().optional(),
  category: z.enum(['food', 'tech', 'grocery', 'fashion', 'entertainment', 'travel']),
  channelType: z.enum(['online', 'offline']),
  merchant: z.object({
    name: z.string().min(1, '店家名稱為必填'),
    logo: z.string().url().optional().or(z.literal('')),
    storeBranches: z.string().optional(),
  }),
  regions: z.array(z.string()).min(1, '至少需指定一個適用區域'),
  
  // 價格要素
  originalPrice: z.number().nonnegative().optional(),
  discountPrice: z.number().nonnegative().optional(),
  priceUnit: z.string().optional(),
  pricingType: z.enum(['fixed_price', 'buy_x_get_y', 'percentage_discount', 'special_offer']).optional(),
  promoDisplayBadge: z.string().optional(),
  
  // 7大要素
  targetItems: z.array(z.string()).min(1, '至少需填寫一項適用品項'),
  conditions: z.array(z.string()).min(1, '至少需填寫一項特價條件'),
  eligibleCards: z.array(z.string()).default([]),
  
  // 標籤
  tags: z.array(z.string()).default([]),
  
  // 時間
  startDate: z.string(),
  endDate: z.string(),
  isHot: z.boolean().default(false),
  isFlashDeal: z.boolean().default(false),
  
  // 來源
  source: z.enum(['affiliate', 'social_listening', 'merchant_post', 'official']),
  sourcePlatform: z.enum(['Dcard', 'Momo', 'Shopee', 'PChome', 'Costco', 'Carrefour', 'PXMart', 'Convenience', 'Merchant', 'Supertaste', 'Media', 'Daybuy']).optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  likeCount: z.number().int().nonnegative().default(0),
  commentCount: z.number().int().nonnegative().default(0),
  
  priceHistory: z.array(PriceHistoryPointSchema).optional(),
  
  priceDropAlert: z.object({
    isLowest90Days: z.boolean(),
    isSuspiciousHike: z.boolean(),
    note: z.string().optional(),
  }).optional(),
  
  imageUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string()).optional(),
  aspectRatio: DealAspectRatioSchema.optional(),
});

export const MerchantCreateDealSchema = z.object({
  title: z.string().min(2, '請輸入活動標題'),
  merchantName: z.string().min(1, '請輸入店家/品牌名稱'),
  channelType: z.enum(['online', 'offline']),
  category: z.enum(['food', 'tech', 'grocery', 'fashion', 'entertainment', 'travel']),
  city: z.string().min(1, '請選擇適用縣市'),
  district: z.string().optional(),
  originalPrice: z.coerce.number().positive('原價必須大於 0').optional(),
  discountPrice: z.coerce.number().positive('特價必須大於 0'),
  targetItems: z.string().min(1, '請輸入適用品項 (逗號分隔)'),
  conditions: z.string().min(1, '請輸入特惠條件 (逗號分隔)'),
  eligibleCards: z.string().optional(),
  tags: z.string().optional(),
  startDate: z.string().min(1, '請選擇開始時間'),
  endDate: z.string().min(1, '請選擇截止時間'),
  quota: z.coerce.number().int().positive().optional(),
  aspectRatio: DealAspectRatioSchema.optional(),
  imageUrl: z.string().optional(),
});

export type MerchantCreateDealInput = z.infer<typeof MerchantCreateDealSchema>;
