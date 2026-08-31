import { z } from 'zod';

export const AdPlacementSchema = z.enum(['hero_banner', 'feed_native', 'category_sticky']);
export const AdBiddingModelSchema = z.enum(['cpm', 'cpc']);
export const AdCampaignStatusSchema = z.enum(['active', 'pending', 'paused', 'completed']);

export const CreateAdCampaignSchema = z.object({
  merchantName: z.string().min(1, '品牌名稱為必填'),
  merchantLogo: z.string().url().optional().or(z.literal('')),
  title: z.string().min(2, '廣告標題至少 2 個字元'),
  subtitle: z.string().min(2, '宣傳副標題為必填'),
  imageUrl: z.string().url('請輸入有效的廣告海報圖片網址'),
  targetDealId: z.string().optional(),
  targetUrl: z.string().url().optional().or(z.literal('')),
  ctaText: z.string().default('立即搶購'),
  discountBadge: z.string().default('品牌獨家'),
  
  // 流量與版位模式
  placement: AdPlacementSchema.default('hero_banner'),
  biddingModel: AdBiddingModelSchema.default('cpm'),
  
  // 預算與走期
  dailyBudget: z.coerce.number().int().min(100, '每日預算最低為 NT$ 100').max(50000, '每日預算上限為 NT$ 50,000'),
  durationDays: z.coerce.number().int().min(1, '投放天數至少 1 天').max(90, '投放天數至多 90 天'),
  startDate: z.string().min(1, '請選擇開始投放日期'),
  endDate: z.string().min(1, '請選擇截止投放日期'),
  
  // 受眾定向 (Audience Targeting)
  targetCategories: z.array(z.string()).default(['all']),
  targetRegions: z.array(z.string()).default(['全部地區']),
  targetTags: z.array(z.string()).default([]),
});

export type CreateAdCampaignInput = z.infer<typeof CreateAdCampaignSchema>;
