import 'server-only';
import { 
  CrawlerTargetConfig, 
  CrawlerScheduleConfig, 
  CrawlerJobLog, 
  AdminStats, 
  CreateCrawlerTargetInput 
} from '../types/admin.types';
import { CRAWL_TARGETS } from '@/features/deals/server/fb-crawler.service';
import { OFFICIAL_WEB_TARGETS } from '@/features/deals/server/official-web-crawler.service';
import { getDeals } from '@/features/deals/server/deals-dal';

// 站點清單快取
let inMemoryTargets: CrawlerTargetConfig[] = [
  ...CRAWL_TARGETS.map((t) => ({
    id: t.id,
    name: t.name,
    url: t.url,
    logo: t.logo,
    defaultCategory: t.defaultCategory,
    enabled: true,
    lastCrawledAt: '2026-08-31 08:30:00',
    lastStatus: 'success' as const,
    crawledCount: 12,
    scheduleMode: 'inherit' as const,
    customScheduleTimes: [],
    customIntervalMinutes: 60,
    crawlRule: '全通路 FB 官方粉專情報與大圖萃取',
    isCustom: false,
  })),
  ...OFFICIAL_WEB_TARGETS.map((t) => ({
    id: t.id,
    name: t.name,
    url: t.url,
    logo: t.merchantLogo,
    defaultCategory: t.category,
    enabled: true,
    lastCrawledAt: '2026-08-31 08:30:00',
    lastStatus: 'success' as const,
    crawledCount: 8,
    scheduleMode: 'inherit' as const,
    customScheduleTimes: [],
    customIntervalMinutes: 60,
    crawlRule: '官方主題活動專題頁 DOM 結構解析',
    isCustom: false,
  })),
];

// 排程設定快取
let inMemorySchedule: CrawlerScheduleConfig = {
  enabled: true,
  goldenWindows: ['08:30', '12:00', '18:00', '21:30'],
  thursdayRushHours: ['17:00', '18:00', '19:00'],
  nightQuietStart: '01:00',
  nightQuietEnd: '07:30',
  customIntervalMinutes: 60,
};

// 爬蟲日誌快取
let inMemoryLogs: CrawlerJobLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-31 08:30:15',
    targetId: '7eleven',
    targetName: '7-ELEVEN 官方粉專',
    type: 'scheduled',
    status: 'success',
    crawledCount: 6,
    insertedCount: 4,
    message: '自動排程：成功解析 4 筆最新促銷 (買1送1、第2件5折)',
  },
  {
    id: 'log-2',
    timestamp: '2026-08-31 08:30:28',
    targetId: 'familymart',
    targetName: '全家 FamilyMart 官方粉專',
    type: 'scheduled',
    status: 'success',
    crawledCount: 8,
    insertedCount: 6,
    message: '自動排程：成功萃取 5 康康大促多項品項並更新至情報牆',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-31 08:31:02',
    targetId: 'starbucks',
    targetName: '星巴克 Starbucks Taiwan',
    type: 'scheduled',
    status: 'success',
    crawledCount: 2,
    insertedCount: 1,
    message: '自動排程：成功解析星巴克指定飲品買一送一活動',
  },
];

export async function getCrawlerTargets(): Promise<CrawlerTargetConfig[]> {
  return inMemoryTargets;
}

export async function createCrawlerTarget(input: CreateCrawlerTargetInput): Promise<CrawlerTargetConfig> {
  const customTimes = input.customScheduleTimes
    ? input.customScheduleTimes.split(/[,，、\s]/).filter(Boolean)
    : [];

  const newTarget: CrawlerTargetConfig = {
    id: `target-${Date.now()}`,
    name: input.name,
    url: input.url,
    logo: input.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
    defaultCategory: input.defaultCategory,
    enabled: true,
    lastCrawledAt: undefined,
    lastStatus: 'idle',
    crawledCount: 0,
    scheduleMode: input.scheduleMode,
    customScheduleTimes: customTimes,
    customIntervalMinutes: input.customIntervalMinutes || 60,
    crawlRule: input.crawlRule || '自訂站點爬蟲規則',
    isCustom: true,
  };

  inMemoryTargets = [newTarget, ...inMemoryTargets];
  return newTarget;
}

export async function updateCrawlerTargetDetails(
  targetId: string,
  updates: Partial<CrawlerTargetConfig>
): Promise<CrawlerTargetConfig | null> {
  const target = inMemoryTargets.find((t) => t.id === targetId);
  if (!target) return null;

  Object.assign(target, updates);
  return target;
}

export async function batchUpdateCrawlerTargets(
  targetIds: string[],
  updates: Partial<CrawlerTargetConfig>
): Promise<number> {
  let updatedCount = 0;
  inMemoryTargets = inMemoryTargets.map((target) => {
    if (targetIds.includes(target.id)) {
      updatedCount++;
      return {
        ...target,
        ...updates,
      };
    }
    return target;
  });
  return updatedCount;
}

export async function deleteCrawlerTarget(targetId: string): Promise<boolean> {
  const initialLen = inMemoryTargets.length;
  inMemoryTargets = inMemoryTargets.filter((t) => t.id !== targetId);
  return inMemoryTargets.length < initialLen;
}

export async function toggleCrawlerTarget(targetId: string, enabled: boolean): Promise<CrawlerTargetConfig | null> {
  const target = inMemoryTargets.find((t) => t.id === targetId);
  if (!target) return null;
  target.enabled = enabled;
  return target;
}

export async function getCrawlerSchedule(): Promise<CrawlerScheduleConfig> {
  return inMemorySchedule;
}

export async function updateCrawlerSchedule(newSchedule: Partial<CrawlerScheduleConfig>): Promise<CrawlerScheduleConfig> {
  inMemorySchedule = {
    ...inMemorySchedule,
    ...newSchedule,
  };
  return inMemorySchedule;
}

export async function addCrawlerLog(log: Omit<CrawlerJobLog, 'id' | 'timestamp'>): Promise<CrawlerJobLog> {
  const newLog: CrawlerJobLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
  };
  inMemoryLogs = [newLog, ...inMemoryLogs].slice(0, 100);
  return newLog;
}

export async function getCrawlerLogs(): Promise<CrawlerJobLog[]> {
  return inMemoryLogs;
}

import { prisma } from '@/shared/lib/prisma';

export async function getAdminDashboardStats(): Promise<AdminStats> {
  const deals = await getDeals();
  const hotCount = deals.filter((d) => d.isHot).length;
  const flashCount = deals.filter((d) => d.isFlashDeal).length;
  const uniqueMerchants = new Set(deals.map((d) => d.merchant.name)).size;
  const enabledCount = inMemoryTargets.filter((t) => t.enabled).length;
  const activeCampaignsCount = await prisma.adCampaign.count({ where: { status: 'active' } }).catch(() => 0);

  return {
    totalDeals: deals.length,
    hotDeals: hotCount,
    flashDeals: flashCount,
    totalMerchants: uniqueMerchants,
    activeCampaigns: activeCampaignsCount,
    crawlerTargetsCount: inMemoryTargets.length,
    enabledTargetsCount: enabledCount,
  };
}
