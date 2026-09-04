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
import { BLOG_MEDIA_TARGETS } from '@/features/deals/server/blog-crawler.service';
import { getDeals } from '@/features/deals/server/deals-dal';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { isDealExpired } from '@/features/deals/utils/date-utils';
import { prisma } from '@/shared/lib/prisma';

function formatDateTimeTaiwan(date: Date): string {
  try {
    return new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date).replace(/\//g, '-');
  } catch {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }
}

/**
 * 智慧品牌推斷：依站點名稱或網址自動歸納其主品牌群組
 */
export function inferBrandGroup(name: string, url: string = ''): string | undefined {
  const lowerName = name.toLowerCase();
  const lowerUrl = url.toLowerCase();

  if (
    lowerName.includes('全家') ||
    lowerName.includes('familymart') ||
    lowerName.includes('famiport') ||
    lowerName.includes("let's café") ||
    lowerUrl.includes('family.com.tw')
  ) {
    return '全家 FamilyMart';
  }
  if (
    lowerName.includes('7-eleven') ||
    lowerName.includes('7-11') ||
    lowerName.includes('711') ||
    lowerName.includes('統一超商') ||
    lowerUrl.includes('7-11.com.tw')
  ) {
    return '7-ELEVEN';
  }
  if (lowerName.includes('萊爾富') || lowerName.includes('hi-life') || lowerUrl.includes('hilife.com.tw')) {
    return '萊爾富 Hi-Life';
  }
  if (lowerName.includes('ok超商') || lowerName.includes('okmart') || lowerUrl.includes('okmart.com.tw')) {
    return 'OK超商 OKmart';
  }
  if (lowerName.includes('全聯') || lowerName.includes('pxmart') || lowerUrl.includes('pxmart.com.tw')) {
    return '全聯福利中心';
  }
  if (lowerName.includes('家樂福') || lowerName.includes('carrefour') || lowerUrl.includes('carrefour.com.tw')) {
    return '家樂福 Carrefour';
  }
  if (lowerName.includes('好市多') || lowerName.includes('costco') || lowerUrl.includes('costco.com.tw')) {
    return 'Costco 好市多';
  }
  if (lowerName.includes('大潤發') || lowerName.includes('rt-mart') || lowerUrl.includes('rt-mart.com.tw')) {
    return '大潤發 RT-MART';
  }
  if (lowerName.includes('愛買') || lowerName.includes('a.mart') || lowerUrl.includes('fe-amart.com.tw')) {
    return '愛買 a.mart';
  }
  if (lowerName.includes('美廉社') || lowerName.includes('simple mart') || lowerUrl.includes('simplemart.com.tw')) {
    return '美廉社 Simple Mart';
  }
  if (lowerName.includes('屈臣氏') || lowerName.includes('watsons') || lowerUrl.includes('watsons.com.tw')) {
    return '屈臣氏 Watsons';
  }
  if (lowerName.includes('康是美') || lowerName.includes('cosmed') || lowerUrl.includes('cosmed.com.tw')) {
    return '康是美 COSMED';
  }
  return undefined;
}

/**
 * 取得品牌相關匹配關鍵字清單
 */
export function getBrandMatchKeywords(name: string, brandGroup?: string | null): string[] {
  const words = new Set<string>();
  if (brandGroup) words.add(brandGroup.toLowerCase());
  const cleanName = name.toLowerCase();
  words.add(cleanName);

  const KNOWN_BRANDS: string[][] = [
    ['7-11', '7-eleven', '統一超商', 'city cafe', 'city prima'],
    ['全家', 'familymart', 'famiport', "let's café", 'letscafe'],
    ['萊爾富', 'hi-life', 'hilife'],
    ['ok超商', 'okmart', 'ok mart'],
    ['全聯', 'pxmart', '全聯福利中心'],
    ['星巴克', 'starbucks'],
    ['麥當勞', 'mcdonald'],
    ['肯德基', 'kfc'],
    ['摩斯漢堡', 'mos burger', 'mosburger'],
    ['漢堡王', 'burger king', 'burgerking'],
    ['八方雲集', 'bafang'],
    ['50嵐', '50lan'],
    ['可不可', 'kebuke', '可不可熟成紅茶'],
    ['大苑子', 'dayungs'],
    ['三商巧福', '3sfans'],
    ['家樂福', 'carrefour'],
    ['大潤發', 'rt-mart', 'rtmart'],
    ['愛買', 'a.mart', 'amart'],
    ['美廉社', 'simplemart', 'simple mart'],
    ['康是美', 'cosmed'],
    ['屈臣氏', 'watsons'],
    ['寶雅', 'poya'],
    ['好市多', 'costco'],
    ['爭鮮', 'sushiexpress'],
    ['壽司郎', 'sushiro'],
    ['藏壽司', 'kurasushi'],
    ['王品', 'wanggroup'],
    ['路易莎', 'louisa'],
    ['迷客夏', 'milksha'],
    ['麻古茶坊', 'macu'],
    ['五桐號', 'wootea'],
    ['得正', 'dejeng'],
    ['多拿滋', 'misterdonut', 'mister donut'],
    ['酷聖石', 'coldstone', 'cold stone'],
    ['哈根達斯', 'haagendazs', 'häagen-dazs'],
    ['uniqlo', '優衣庫'],
    ['燦坤', 'tkec'],
    ['全國電子', 'elifemall'],
    ['六扇門', '360820'],
  ];

  for (const group of KNOWN_BRANDS) {
    if (group.some((k) => cleanName.includes(k) || (brandGroup && brandGroup.toLowerCase().includes(k)))) {
      group.forEach((k) => words.add(k));
    }
  }

  return Array.from(words);
}

/**
 * 判定情報是否來自或屬於此爬蟲站點
 */
export function matchDealToTarget(
  deal: { sourceUrl?: string | null; merchantName?: string | null; title: string },
  target: { name: string; url: string; brandGroup?: string | null }
): boolean {
  const cleanTargetUrl = target.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase();
  if (deal.sourceUrl && cleanTargetUrl && deal.sourceUrl.toLowerCase().includes(cleanTargetUrl)) {
    return true;
  }

  const keywords = getBrandMatchKeywords(target.name, target.brandGroup);
  const mName = (deal.merchantName || '').toLowerCase();
  const dTitle = (deal.title || '').toLowerCase();

  for (const k of keywords) {
    if (mName.includes(k) || dTitle.includes(k)) {
      return true;
    }
  }

  return false;
}

/**
 * 取得初始預設爬蟲目標清單
 */
function getDefaultCrawlerTargets(): Omit<CrawlerTargetConfig, 'createdAt' | 'updatedAt'>[] {
  const items = [
    ...CRAWL_TARGETS.map((t) => ({
      id: t.id,
      name: t.name,
      url: t.url,
      logo: t.logo,
      targetType: 'fanpage' as const,
      defaultCategory: t.defaultCategory,
      enabled: true,
      lastCrawledAt: undefined,
      lastStatus: 'idle' as const,
      crawledCount: 0,
      scheduleMode: 'inherit' as const,
      customScheduleTimes: [],
      customIntervalMinutes: 60,
      crawlRule: '全通路 FB 官方粉專情報與大圖萃取',
      brandGroup: inferBrandGroup(t.name, t.url),
      sortOrder: 0,
      isCustom: false,
    })),
    ...OFFICIAL_WEB_TARGETS.map((t) => ({
      id: t.id,
      name: t.name,
      url: t.url,
      logo: t.merchantLogo,
      targetType: 'official_web' as const,
      defaultCategory: t.category,
      enabled: true,
      lastCrawledAt: undefined,
      lastStatus: 'idle' as const,
      crawledCount: 0,
      scheduleMode: 'inherit' as const,
      customScheduleTimes: [],
      customIntervalMinutes: 60,
      crawlRule: '官方主題活動專題頁 DOM 結構解析',
      brandGroup: inferBrandGroup(t.name, t.url),
      sortOrder: 0,
      isCustom: false,
    })),
    ...BLOG_MEDIA_TARGETS.map((t) => ({
      id: t.id,
      name: t.name,
      url: t.url,
      logo: t.logo,
      targetType: 'blog_media' as const,
      defaultCategory: t.defaultCategory,
      enabled: true,
      lastCrawledAt: undefined,
      lastStatus: 'idle' as const,
      crawledCount: 0,
      scheduleMode: 'inherit' as const,
      customScheduleTimes: [],
      customIntervalMinutes: 60,
      crawlRule: '食尚玩家 / 美食部落格多品牌與多品類 AI 拆解',
      brandGroup: inferBrandGroup(t.name, t.url),
      sortOrder: 0,
      isCustom: false,
    })),
  ];

  return items.map((item, idx) => ({
    ...item,
    sortOrder: idx,
  }));
}

/**
 * 確保資料庫中已有爬蟲站點資料，若為空則自動種子化 (Seed)
 */
async function ensureSeedCrawlerTargets(): Promise<void> {
  try {
    const count = await prisma.crawlerTarget.count();
    if (count === 0) {
      const defaults = getDefaultCrawlerTargets();
      await prisma.crawlerTarget.createMany({
        data: defaults.map((t) => ({
          id: t.id,
          name: t.name,
          url: t.url,
          logo: t.logo || null,
          targetType: t.targetType,
          defaultCategory: t.defaultCategory,
          enabled: t.enabled,
          lastStatus: t.lastStatus,
          crawledCount: t.crawledCount,
          scheduleMode: t.scheduleMode,
          customScheduleTimes: t.customScheduleTimes || [],
          customIntervalMinutes: t.customIntervalMinutes || 60,
          crawlRule: t.crawlRule || null,
          brandGroup: t.brandGroup || null,
          sortOrder: t.sortOrder ?? 0,
          isCustom: t.isCustom ?? false,
        })),
        skipDuplicates: true,
      });
    }
  } catch (err) {
    console.error('[AdminDAL] Error seeding crawler targets:', err);
  }
}

/**
 * 確保資料庫中已有全域排程設定
 */
async function ensureSeedCrawlerSchedule(): Promise<void> {
  try {
    const existing = await prisma.crawlerSchedule.findUnique({ where: { id: 'global' } });
    if (!existing) {
      await prisma.crawlerSchedule.create({
        data: {
          id: 'global',
          enabled: true,
          goldenWindows: ['08:30', '12:00', '18:00', '21:30'],
          thursdayRushHours: ['17:00', '18:00', '19:00'],
          nightQuietStart: '01:00',
          nightQuietEnd: '07:30',
          customIntervalMinutes: 60,
        },
      });
    }
  } catch (err) {
    console.error('[AdminDAL] Error seeding crawler schedule:', err);
  }
}

/**
 * 取得所有爬蟲目標站點 (自 PostgreSQL 真實讀取)
 */
export async function getCrawlerTargets(): Promise<CrawlerTargetConfig[]> {
  await ensureSeedCrawlerTargets();

  try {
    const [records, deals] = await Promise.all([
      prisma.crawlerTarget.findMany({
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'asc' },
        ],
      }),
      prisma.deal.findMany({
        select: {
          id: true,
          title: true,
          merchantName: true,
          sourceUrl: true,
          endDate: true,
        },
      }),
    ]);

    const now = Date.now();

    return records.map((r) => {
      const matched = deals.filter((d) => matchDealToTarget(d, r));
      const activeMatched = matched.filter((d) => !d.endDate || !isDealExpired(d.endDate, now));
      const effectiveCrawledCount = Math.max(r.crawledCount, matched.length);

      return {
        id: r.id,
        name: r.name,
        url: r.url,
        logo: r.logo || undefined,
        targetType: r.targetType as any,
        defaultCategory: r.defaultCategory as any,
        enabled: r.enabled,
        lastCrawledAt: r.lastCrawledAt ? formatDateTimeTaiwan(r.lastCrawledAt) : undefined,
        lastStatus: r.lastStatus as any,
        crawledCount: effectiveCrawledCount,
        activeDealsCount: activeMatched.length,
        scheduleMode: r.scheduleMode as any,
        customScheduleTimes: r.customScheduleTimes,
        customIntervalMinutes: r.customIntervalMinutes,
        crawlRule: r.crawlRule || undefined,
        brandGroup: r.brandGroup || undefined,
        sortOrder: r.sortOrder ?? 0,
        isCustom: r.isCustom,
      };
    });
  } catch (err) {
    console.error('[AdminDAL] getCrawlerTargets error:', err);
    return getDefaultCrawlerTargets();
  }
}

/**
 * 重新排序爬蟲目標站點 (持久化拖曳順序至 PostgreSQL)
 */
export async function reorderCrawlerTargets(orderedIds: string[]): Promise<boolean> {
  if (!orderedIds || orderedIds.length === 0) return false;
  try {
    const updates = orderedIds.map((id, index) =>
      prisma.crawlerTarget.update({
        where: { id },
        data: { sortOrder: index },
      })
    );
    await prisma.$transaction(updates);
    return true;
  } catch (err) {
    console.error('[AdminDAL] reorderCrawlerTargets error:', err);
    return false;
  }
}

/**
 * 針對特定品牌群組進行一鍵啟用或停用
 */
export async function batchToggleBrandGroupTargets(brandGroup: string, enabled: boolean): Promise<number> {
  try {
    const result = await prisma.crawlerTarget.updateMany({
      where: { brandGroup },
      data: { enabled },
    });
    return result.count;
  } catch (err) {
    console.error(`[AdminDAL] batchToggleBrandGroupTargets error for ${brandGroup}:`, err);
    return 0;
  }
}

/**
 * 批量為多個站點設定品牌群組 (可指派新群組或傳入 null 解除群組)
 */
export async function batchSetBrandGroup(
  targetIds: string[],
  brandGroup: string | null
): Promise<{ count: number }> {
  if (!targetIds || targetIds.length === 0) return { count: 0 };
  try {
    const formattedBrand = brandGroup?.trim() ? brandGroup.trim() : null;
    const result = await prisma.crawlerTarget.updateMany({
      where: { id: { in: targetIds } },
      data: { brandGroup: formattedBrand },
    });
    return { count: result.count };
  } catch (err) {
    console.error('[AdminDAL] batchSetBrandGroup error:', err);
    return { count: 0 };
  }
}

/**
 * 取得特定站點的所有情報、線上在線情報與成效統計
 */
export async function getTargetDealsStats(targetId: string): Promise<{
  target: CrawlerTargetConfig | null;
  totalCrawled: number;
  activeCount: number;
  expiredCount: number;
  activeDeals: SmartDeal[];
  expiredDeals: SmartDeal[];
}> {
  const targetRecord = await prisma.crawlerTarget.findUnique({ where: { id: targetId } });
  if (!targetRecord) {
    return {
      target: null,
      totalCrawled: 0,
      activeCount: 0,
      expiredCount: 0,
      activeDeals: [],
      expiredDeals: [],
    };
  }

  const allSmartDeals = await getDeals();
  const now = Date.now();

  const matched = allSmartDeals.filter((deal) =>
    matchDealToTarget(
      {
        sourceUrl: deal.sourceUrl,
        merchantName: deal.merchant?.name,
        title: deal.title,
      },
      targetRecord
    )
  );

  const activeDeals = matched.filter((d) => !d.endDate || !isDealExpired(d.endDate, now));
  const expiredDeals = matched.filter((d) => d.endDate && isDealExpired(d.endDate, now));
  const totalCrawled = Math.max(targetRecord.crawledCount, matched.length);

  return {
    target: {
      id: targetRecord.id,
      name: targetRecord.name,
      url: targetRecord.url,
      logo: targetRecord.logo || undefined,
      targetType: targetRecord.targetType as any,
      defaultCategory: targetRecord.defaultCategory as any,
      enabled: targetRecord.enabled,
      lastCrawledAt: targetRecord.lastCrawledAt ? formatDateTimeTaiwan(targetRecord.lastCrawledAt) : undefined,
      lastStatus: targetRecord.lastStatus as any,
      crawledCount: totalCrawled,
      activeDealsCount: activeDeals.length,
      scheduleMode: targetRecord.scheduleMode as any,
      customScheduleTimes: targetRecord.customScheduleTimes,
      customIntervalMinutes: targetRecord.customIntervalMinutes,
      crawlRule: targetRecord.crawlRule || undefined,
      brandGroup: targetRecord.brandGroup || undefined,
      sortOrder: targetRecord.sortOrder ?? 0,
      isCustom: targetRecord.isCustom,
    },
    totalCrawled,
    activeCount: activeDeals.length,
    expiredCount: expiredDeals.length,
    activeDeals,
    expiredDeals,
  };
}

/**
 * 新增自訂爬蟲目標站點 (寫入 PostgreSQL)
 */
export async function createCrawlerTarget(input: CreateCrawlerTargetInput): Promise<CrawlerTargetConfig> {
  const customTimes = input.customScheduleTimes
    ? input.customScheduleTimes.split(/[,，、\s]/).filter(Boolean)
    : [];

  const id = `target-${Date.now()}`;
  const brand = input.brandGroup?.trim() ? input.brandGroup.trim() : null;

  // 取得目前最大排序權重
  const lastTarget = await prisma.crawlerTarget.findFirst({
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  const newSortOrder = input.sortOrder ?? ((lastTarget?.sortOrder ?? 0) + 1);

  const record = await prisma.crawlerTarget.create({
    data: {
      id,
      name: input.name,
      url: input.url,
      logo: input.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
      targetType: input.targetType || 'blog_media',
      defaultCategory: input.defaultCategory,
      enabled: true,
      lastStatus: 'idle',
      crawledCount: 0,
      scheduleMode: input.scheduleMode,
      customScheduleTimes: customTimes,
      customIntervalMinutes: input.customIntervalMinutes || 60,
      crawlRule: input.crawlRule || '自訂站點爬蟲規則',
      brandGroup: brand,
      sortOrder: newSortOrder,
      isCustom: true,
    },
  });

  return {
    id: record.id,
    name: record.name,
    url: record.url,
    logo: record.logo || undefined,
    targetType: record.targetType as any,
    defaultCategory: record.defaultCategory as any,
    enabled: record.enabled,
    lastCrawledAt: undefined,
    lastStatus: record.lastStatus as any,
    crawledCount: record.crawledCount,
    scheduleMode: record.scheduleMode as any,
    customScheduleTimes: record.customScheduleTimes,
    customIntervalMinutes: record.customIntervalMinutes,
    crawlRule: record.crawlRule || undefined,
    brandGroup: record.brandGroup || undefined,
    sortOrder: record.sortOrder,
    isCustom: record.isCustom,
  };
}

/**
 * 更新單一站點詳細資訊 (PostgreSQL)
 */
export async function updateCrawlerTargetDetails(
  targetId: string,
  updates: Partial<CrawlerTargetConfig>
): Promise<CrawlerTargetConfig | null> {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.logo !== undefined) updateData.logo = updates.logo;
    if (updates.targetType !== undefined) updateData.targetType = updates.targetType;
    if (updates.defaultCategory !== undefined) updateData.defaultCategory = updates.defaultCategory;
    if (updates.scheduleMode !== undefined) updateData.scheduleMode = updates.scheduleMode;
    if (updates.customScheduleTimes !== undefined) updateData.customScheduleTimes = updates.customScheduleTimes;
    if (updates.customIntervalMinutes !== undefined) updateData.customIntervalMinutes = updates.customIntervalMinutes;
    if (updates.crawlRule !== undefined) updateData.crawlRule = updates.crawlRule;
    if (updates.enabled !== undefined) updateData.enabled = updates.enabled;
    if (updates.lastStatus !== undefined) updateData.lastStatus = updates.lastStatus;
    if (updates.crawledCount !== undefined) updateData.crawledCount = updates.crawledCount;
    if (updates.brandGroup !== undefined) {
      updateData.brandGroup = updates.brandGroup?.trim() ? updates.brandGroup.trim() : null;
    }
    if (updates.sortOrder !== undefined) updateData.sortOrder = updates.sortOrder;
    if (updates.lastCrawledAt !== undefined) updateData.lastCrawledAt = updates.lastCrawledAt ? new Date(updates.lastCrawledAt) : null;

    const record = await prisma.crawlerTarget.update({
      where: { id: targetId },
      data: updateData,
    });

    return {
      id: record.id,
      name: record.name,
      url: record.url,
      logo: record.logo || undefined,
      targetType: record.targetType as any,
      defaultCategory: record.defaultCategory as any,
      enabled: record.enabled,
      lastCrawledAt: record.lastCrawledAt ? formatDateTimeTaiwan(record.lastCrawledAt) : undefined,
      lastStatus: record.lastStatus as any,
      crawledCount: record.crawledCount,
      scheduleMode: record.scheduleMode as any,
      customScheduleTimes: record.customScheduleTimes,
      customIntervalMinutes: record.customIntervalMinutes,
      crawlRule: record.crawlRule || undefined,
      brandGroup: record.brandGroup || undefined,
      sortOrder: record.sortOrder,
      isCustom: record.isCustom,
    };
  } catch (err) {
    console.error(`[AdminDAL] updateCrawlerTargetDetails error for ${targetId}:`, err);
    return null;
  }
}

/**
 * 批量更新多個站點 (PostgreSQL)
 */
export async function batchUpdateCrawlerTargets(
  targetIds: string[],
  updates: Partial<CrawlerTargetConfig>
): Promise<number> {
  if (!targetIds.length) return 0;
  try {
    const updateData: any = {};
    if (updates.enabled !== undefined) updateData.enabled = updates.enabled;
    if (updates.scheduleMode !== undefined) updateData.scheduleMode = updates.scheduleMode;
    if (updates.customScheduleTimes !== undefined) updateData.customScheduleTimes = updates.customScheduleTimes;
    if (updates.customIntervalMinutes !== undefined) updateData.customIntervalMinutes = updates.customIntervalMinutes;

    const result = await prisma.crawlerTarget.updateMany({
      where: { id: { in: targetIds } },
      data: updateData,
    });

    return result.count;
  } catch (err) {
    console.error('[AdminDAL] batchUpdateCrawlerTargets error:', err);
    return 0;
  }
}

/**
 * 刪除爬蟲目標站點 (PostgreSQL)
 */
export async function deleteCrawlerTarget(targetId: string): Promise<boolean> {
  try {
    await prisma.crawlerTarget.delete({ where: { id: targetId } });
    return true;
  } catch (err) {
    console.error(`[AdminDAL] deleteCrawlerTarget error for ${targetId}:`, err);
    return false;
  }
}

/**
 * 批量刪除多個爬蟲目標站點 (PostgreSQL)
 */
export async function batchDeleteCrawlerTargets(targetIds: string[]): Promise<number> {
  if (!targetIds || targetIds.length === 0) return 0;
  try {
    const result = await prisma.crawlerTarget.deleteMany({
      where: { id: { in: targetIds } },
    });
    return result.count;
  } catch (err) {
    console.error('[AdminDAL] batchDeleteCrawlerTargets error:', err);
    return 0;
  }
}

/**
 * 恢復預設推薦官方種子站點 (PostgreSQL)
 */
export async function restoreDefaultCrawlerTargets(): Promise<{ restoredCount: number }> {
  try {
    const defaults = getDefaultCrawlerTargets();
    let restoredCount = 0;
    for (const t of defaults) {
      const existing = await prisma.crawlerTarget.findUnique({ where: { id: t.id } });
      if (!existing) {
        await prisma.crawlerTarget.create({
          data: {
            id: t.id,
            name: t.name,
            url: t.url,
            logo: t.logo || null,
            targetType: t.targetType,
            defaultCategory: t.defaultCategory,
            enabled: t.enabled,
            lastStatus: t.lastStatus,
            crawledCount: t.crawledCount,
            scheduleMode: t.scheduleMode,
            customScheduleTimes: t.customScheduleTimes || [],
            customIntervalMinutes: t.customIntervalMinutes || 60,
            crawlRule: t.crawlRule || null,
            isCustom: false,
          },
        });
        restoredCount++;
      }
    }
    return { restoredCount };
  } catch (err) {
    console.error('[AdminDAL] restoreDefaultCrawlerTargets error:', err);
    return { restoredCount: 0 };
  }
}

/**
 * 切換特定站點啟用狀態 (PostgreSQL)
 */
export async function toggleCrawlerTarget(targetId: string, enabled: boolean): Promise<CrawlerTargetConfig | null> {
  return updateCrawlerTargetDetails(targetId, { enabled });
}

/**
 * 取得全域排程設定 (PostgreSQL)
 */
export async function getCrawlerSchedule(): Promise<CrawlerScheduleConfig> {
  await ensureSeedCrawlerSchedule();

  try {
    const record = await prisma.crawlerSchedule.findUnique({ where: { id: 'global' } });
    if (record) {
      return {
        enabled: record.enabled,
        goldenWindows: record.goldenWindows,
        thursdayRushHours: record.thursdayRushHours,
        nightQuietStart: record.nightQuietStart,
        nightQuietEnd: record.nightQuietEnd,
        customIntervalMinutes: record.customIntervalMinutes,
      };
    }
  } catch (err) {
    console.error('[AdminDAL] getCrawlerSchedule error:', err);
  }

  return {
    enabled: true,
    goldenWindows: ['08:30', '12:00', '18:00', '21:30'],
    thursdayRushHours: ['17:00', '18:00', '19:00'],
    nightQuietStart: '01:00',
    nightQuietEnd: '07:30',
    customIntervalMinutes: 60,
  };
}

/**
 * 更新全域排程設定 (PostgreSQL)
 */
export async function updateCrawlerSchedule(newSchedule: Partial<CrawlerScheduleConfig>): Promise<CrawlerScheduleConfig> {
  await ensureSeedCrawlerSchedule();

  try {
    const record = await prisma.crawlerSchedule.upsert({
      where: { id: 'global' },
      create: {
        id: 'global',
        enabled: newSchedule.enabled ?? true,
        goldenWindows: newSchedule.goldenWindows ?? ['08:30', '12:00', '18:00', '21:30'],
        thursdayRushHours: newSchedule.thursdayRushHours ?? ['17:00', '18:00', '19:00'],
        nightQuietStart: newSchedule.nightQuietStart ?? '01:00',
        nightQuietEnd: newSchedule.nightQuietEnd ?? '07:30',
        customIntervalMinutes: newSchedule.customIntervalMinutes ?? 60,
      },
      update: {
        ...(newSchedule.enabled !== undefined && { enabled: newSchedule.enabled }),
        ...(newSchedule.goldenWindows !== undefined && { goldenWindows: newSchedule.goldenWindows }),
        ...(newSchedule.thursdayRushHours !== undefined && { thursdayRushHours: newSchedule.thursdayRushHours }),
        ...(newSchedule.nightQuietStart !== undefined && { nightQuietStart: newSchedule.nightQuietStart }),
        ...(newSchedule.nightQuietEnd !== undefined && { nightQuietEnd: newSchedule.nightQuietEnd }),
        ...(newSchedule.customIntervalMinutes !== undefined && { customIntervalMinutes: newSchedule.customIntervalMinutes }),
      },
    });

    return {
      enabled: record.enabled,
      goldenWindows: record.goldenWindows,
      thursdayRushHours: record.thursdayRushHours,
      nightQuietStart: record.nightQuietStart,
      nightQuietEnd: record.nightQuietEnd,
      customIntervalMinutes: record.customIntervalMinutes,
    };
  } catch (err) {
    console.error('[AdminDAL] updateCrawlerSchedule error:', err);
    return getCrawlerSchedule();
  }
}

/**
 * 新增爬蟲日誌 (真實寫入 PostgreSQL)
 */
export async function addCrawlerLog(log: Omit<CrawlerJobLog, 'id' | 'timestamp'>): Promise<CrawlerJobLog> {
  try {
    const record = await prisma.crawlerLog.create({
      data: {
        targetId: log.targetId || null,
        targetName: log.targetName || '未知站點',
        type: log.type,
        status: log.status,
        crawledCount: log.crawledCount || 0,
        insertedCount: log.insertedCount || 0,
        message: log.message,
        details: log.details ? (log.details as any) : undefined,
      },
    });

    return {
      id: record.id,
      timestamp: formatDateTimeTaiwan(record.createdAt),
      targetId: record.targetId || undefined,
      targetName: record.targetName,
      type: record.type as any,
      status: record.status as any,
      crawledCount: record.crawledCount,
      insertedCount: record.insertedCount,
      message: record.message,
      details: record.details as any,
    };
  } catch (err) {
    console.error('[AdminDAL] addCrawlerLog error:', err);
    return {
      id: `fallback-${Date.now()}`,
      timestamp: formatDateTimeTaiwan(new Date()),
      ...log,
    };
  }
}

/**
 * 取得最新爬蟲日誌 (自 PostgreSQL 真實讀取前 100 筆)
 */
export async function getCrawlerLogs(): Promise<CrawlerJobLog[]> {
  try {
    const records = await prisma.crawlerLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return records.map((r) => ({
      id: r.id,
      timestamp: formatDateTimeTaiwan(r.createdAt),
      targetId: r.targetId || undefined,
      targetName: r.targetName,
      type: r.type as any,
      status: r.status as any,
      crawledCount: r.crawledCount,
      insertedCount: r.insertedCount,
      message: r.message,
      details: r.details as any,
    }));
  } catch (err) {
    console.error('[AdminDAL] getCrawlerLogs error:', err);
    return [];
  }
}

/**
 * 取得後台統計數據 (自 PostgreSQL 真實計算)
 */
export async function getAdminDashboardStats(): Promise<AdminStats> {
  const deals = await getDeals();
  const hotCount = deals.filter((d) => d.isHot).length;
  const flashCount = deals.filter((d) => d.isFlashDeal).length;
  const uniqueMerchants = new Set(deals.map((d) => d.merchant.name)).size;

  let totalTargets = 0;
  let enabledTargets = 0;
  try {
    await ensureSeedCrawlerTargets();
    totalTargets = await prisma.crawlerTarget.count();
    enabledTargets = await prisma.crawlerTarget.count({ where: { enabled: true } });
  } catch {
    totalTargets = 40;
    enabledTargets = 40;
  }

  const activeCampaignsCount = await prisma.adCampaign.count({ where: { status: 'active' } }).catch(() => 0);

  return {
    totalDeals: deals.length,
    hotDeals: hotCount,
    flashDeals: flashCount,
    totalMerchants: uniqueMerchants,
    activeCampaigns: activeCampaignsCount,
    crawlerTargetsCount: totalTargets,
    enabledTargetsCount: enabledTargets,
  };
}

/**
 * 從 Facebook 粉絲團網址或帳號名稱自動抓取官方大頭貼 / Logo
 */
export async function fetchFacebookAvatar(urlOrHandle: string): Promise<string | null> {
  if (!urlOrHandle) return null;

  let handle = urlOrHandle.trim();
  const match = handle.match(/facebook\.com\/([^\/\?#]+)/i);
  if (match) {
    handle = match[1];
  }
  handle = handle.replace(/\/$/, '');

  const candidates = [
    handle,
    handle.replace(/\.tw$/i, ''),
    handle.replace(/tw$/i, ''),
    handle.replace(/\.official$/i, ''),
  ].filter(Boolean);

  for (const h of candidates) {
    try {
      const res = await fetch(`https://graph.facebook.com/${h}/picture?type=large&redirect=false`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
        cache: 'no-store',
      });
      const data = await res.json();
      if (data?.data?.url) {
        return data.data.url;
      }
    } catch {}
  }

  // Fallback: 若 Graph API 限制存取，比對已知種子清單中高畫質 Logo
  const lower = handle.toLowerCase();
  for (const seed of CRAWL_TARGETS) {
    if (seed.url.toLowerCase().includes(lower) || seed.name.toLowerCase().includes(lower)) {
      return seed.logo;
    }
  }

  return null;
}

/**
 * 取得所有品牌群組的自訂 Icon 配置 (PostgreSQL)
 */
export async function getBrandGroupIcons(): Promise<Record<string, string>> {
  try {
    const records = await prisma.brandGroupConfig.findMany();
    const map: Record<string, string> = {};
    for (const r of records) {
      if (r.icon) {
        map[r.brandName] = r.icon;
      }
    }
    return map;
  } catch (err) {
    console.error('[AdminDAL] getBrandGroupIcons error:', err);
    return {};
  }
}

/**
 * 設定或更新特定品牌群組的專屬 Icon (PostgreSQL)
 */
export async function setBrandGroupIcon(brandName: string, iconUrl: string | null): Promise<boolean> {
  if (!brandName) return false;
  try {
    const formattedIcon = iconUrl?.trim() ? iconUrl.trim() : null;
    await prisma.brandGroupConfig.upsert({
      where: { brandName },
      update: { icon: formattedIcon },
      create: { brandName, icon: formattedIcon },
    });
    return true;
  } catch (err) {
    console.error('[AdminDAL] setBrandGroupIcon error:', err);
    return false;
  }
}

