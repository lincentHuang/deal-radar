import { z } from 'zod';
import { SmartDealSchema } from '@/features/deals/schemas/deal.schema';

export const AdminPinVerifySchema = z.object({
  pin: z.string().min(4, '請輸入 4-8 位數字安全 PIN 碼'),
});

export const CrawlerScheduleModeSchema = z.enum(['inherit', 'custom', 'interval']);

export const CrawlerTargetTypeSchema = z.enum(['fanpage', 'official_web', 'blog_media', 'community']);

export const CrawlerTargetConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '通路名稱必填'),
  url: z.string().url('請輸入合法的 URL'),
  logo: z.string().url().optional().or(z.literal('')),
  targetType: CrawlerTargetTypeSchema.default('official_web'),
  defaultCategory: z.enum(['food', 'grocery', 'tech', 'fashion', 'entertainment', 'travel']),
  enabled: z.boolean().default(true),
  lastCrawledAt: z.string().optional(),
  lastStatus: z.enum(['success', 'idle', 'running', 'error']).default('idle'),
  crawledCount: z.number().int().nonnegative().default(0),
  activeDealsCount: z.number().int().nonnegative().optional(),
  
  // 個別排程配置
  scheduleMode: CrawlerScheduleModeSchema.default('inherit'),
  customScheduleTimes: z.array(z.string()).default([]),
  customIntervalMinutes: z.number().int().min(5).max(1440).default(60),
  crawlRule: z.string().optional(),
  brandGroup: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isCustom: z.boolean().default(false),
});

export const CreateCrawlerTargetSchema = z.object({
  name: z.string().min(1, '請輸入通路/網站名稱'),
  url: z.string().url('請輸入有效的網站 URL'),
  logo: z.string().url().optional().or(z.literal('')),
  targetType: CrawlerTargetTypeSchema.default('blog_media'),
  defaultCategory: z.enum(['food', 'grocery', 'tech', 'fashion', 'entertainment', 'travel']).default('food'),
  scheduleMode: CrawlerScheduleModeSchema.default('inherit'),
  customScheduleTimes: z.string().optional(),
  customIntervalMinutes: z.coerce.number().int().min(5).max(1440).default(60),
  crawlRule: z.string().optional(),
  brandGroup: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const BatchUpdateCrawlerScheduleSchema = z.object({
  targetIds: z.array(z.string()).min(1, '請至少選取一個目標站點'),
  enabled: z.boolean().optional(),
  scheduleMode: CrawlerScheduleModeSchema.optional(),
  customScheduleTimes: z.array(z.string()).optional(),
  customIntervalMinutes: z.number().int().min(5).max(1440).optional(),
  brandGroup: z.string().optional(),
});

export const CrawlerScheduleConfigSchema = z.object({
  enabled: z.boolean().default(true),
  goldenWindows: z.array(z.string()).default(['08:30', '12:00', '18:00', '21:30']),
  thursdayRushHours: z.array(z.string()).default(['17:00', '18:00', '19:00']),
  nightQuietStart: z.string().default('01:00'),
  nightQuietEnd: z.string().default('07:30'),
  customIntervalMinutes: z.number().int().min(15).max(1440).default(60),
});

export const AdminUpdateDealSchema = SmartDealSchema.partial().extend({
  id: z.string().min(1),
});

export type CrawlerScheduleMode = z.infer<typeof CrawlerScheduleModeSchema>;
export type CrawlerTargetConfigInput = z.infer<typeof CrawlerTargetConfigSchema>;
export type CreateCrawlerTargetInput = z.infer<typeof CreateCrawlerTargetSchema>;
export type BatchUpdateCrawlerScheduleInput = z.infer<typeof BatchUpdateCrawlerScheduleSchema>;
export type CrawlerScheduleConfigInput = z.infer<typeof CrawlerScheduleConfigSchema>;
export type AdminUpdateDealInput = z.infer<typeof AdminUpdateDealSchema>;
