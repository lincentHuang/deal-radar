import { z } from 'zod';

export const BatchFlyerUploadSchema = z.object({
  merchantName: z.string().min(1, '請輸入品牌名稱'),
  city: z.string().default('全台線上'),
  imageUrls: z.array(z.string().url('請提供正確的圖片網址')).min(1, '至少需要上傳一張 DM 海報圖片'),
});

export const DraftDealCardSchema = z.object({
  draftId: z.string(),
  title: z.string().min(2, '標題至少 2 個字元'),
  category: z.enum(['food', 'tech', 'grocery', 'fashion', 'entertainment', 'travel']).default('food'),
  channelType: z.enum(['online', 'offline']).default('offline'),
  merchantName: z.string().min(1),
  originalPrice: z.number().positive().optional(),
  discountPrice: z.number().positive('特價金額必須大於 0'),
  targetItems: z.string().min(1, '適用品項為必填'),
  conditions: z.string().min(1, '促銷條件為必填'),
  eligibleCards: z.string().optional(),
  tags: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  selectedForPublish: z.boolean().default(true),
});

export const BatchPublishDealsSchema = z.object({
  merchantName: z.string().min(1),
  deals: z.array(DraftDealCardSchema).min(1, '至少需選擇一筆特價卡片進行發布'),
});

export type BatchFlyerUploadInput = z.infer<typeof BatchFlyerUploadSchema>;
export type DraftDealCard = z.infer<typeof DraftDealCardSchema>;
export type BatchPublishDealsInput = z.infer<typeof BatchPublishDealsSchema>;
