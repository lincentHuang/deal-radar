import 'server-only';
import { 
  getCrawlerTargets, 
  getCrawlerSchedule, 
  addCrawlerLog, 
  updateCrawlerTargetDetails 
} from '@/features/admin/server/admin-dal';
import { CrawlerTargetConfig } from '@/features/admin/types/admin.types';
import { crawlLiveTargets } from './fb-crawler.service';
import { upsertCrawledDeals, purgeExpiredDeals } from './deals-dal';
import { SmartDeal } from '../types/deal.types';

// 全域常駐單例防止 Next.js 重新載入時產生多個定時器
declare global {
  // eslint-disable-next-line no-var
  var __crawlerSchedulerTimer: NodeJS.Timeout | null;
  // eslint-disable-next-line no-var
  var __crawlerSchedulerRunning: boolean;
  // eslint-disable-next-line no-var
  var __lastScheduledMinuteKey: string;
  // eslint-disable-next-line no-var
  var __lastPurgedHourKey: string;
}

/**
 * 取得當前台灣時區 (Asia/Taipei) 時間物件資訊
 */
export function getTaiwanTimeParts(date = new Date()): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  dayOfWeek: number; // 0: 日, 1: 一, ..., 4: 四, 6: 六
  timeString: string; // "08:30"
  minuteKey: string;  // "2026-09-04_08:30"
  hourKey: string;    // "2026-09-04_08"
} {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });

  const parts = formatter.formatToParts(date);
  const findPart = (t: string) => parts.find((p) => p.type === t)?.value || '0';

  const year = parseInt(findPart('year'), 10);
  const month = parseInt(findPart('month'), 10);
  const day = parseInt(findPart('day'), 10);
  let hour = parseInt(findPart('hour'), 10);
  if (hour === 24) hour = 0;
  const minute = parseInt(findPart('minute'), 10);

  const weekdayStr = findPart('weekday');
  const dayOfWeekMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const dayOfWeek = dayOfWeekMap[weekdayStr] ?? date.getDay();

  const hh = hour.toString().padStart(2, '0');
  const mm = minute.toString().padStart(2, '0');
  const timeString = `${hh}:${mm}`;

  const minuteKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}_${hh}:${mm}`;
  const hourKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}_${hh}`;

  return { year, month, day, hour, minute, dayOfWeek, timeString, minuteKey, hourKey };
}

/**
 * 檢查是否處於深夜靜默期
 */
export function isWithinQuietHours(
  hour: number, 
  minute: number, 
  quietStart = '01:00', 
  quietEnd = '07:30'
): boolean {
  const [startH, startM] = quietStart.split(':').map((s) => parseInt(s, 10));
  const [endH, endM] = quietEnd.split(':').map((s) => parseInt(s, 10));
  const currentTotal = hour * 60 + minute;
  const startTotal = (startH || 1) * 60 + (startM || 0);
  const endTotal = (endH || 7) * 60 + (endM || 30);

  if (startTotal <= endTotal) {
    return currentTotal >= startTotal && currentTotal < endTotal;
  }
  // 跨午夜情況 (例如 23:00 ~ 06:00)
  return currentTotal >= startTotal || currentTotal < endTotal;
}

/**
 * 比對並篩選出當前時間點應運行的目標站點
 */
export async function getDueCrawlerTargets(now = new Date()): Promise<{
  dueTargets: CrawlerTargetConfig[];
  triggerReason: string;
}> {
  const schedule = await getCrawlerSchedule();
  if (!schedule.enabled) {
    return { dueTargets: [], triggerReason: 'schedule_disabled' };
  }

  const { hour, minute, dayOfWeek, timeString } = getTaiwanTimeParts(now);

  // 1. 深夜靜默期檢查
  const isQuiet = isWithinQuietHours(hour, minute, schedule.nightQuietStart, schedule.nightQuietEnd);
  if (isQuiet) {
    return { dueTargets: [], triggerReason: 'quiet_hours' };
  }

  const targets = await getCrawlerTargets();
  const enabledTargets = targets.filter((t) => t.enabled);
  if (enabledTargets.length === 0) {
    return { dueTargets: [], triggerReason: 'no_enabled_targets' };
  }

  // 2. 判斷全域黃金波段 (08:30, 12:00, 18:00, 21:30)
  const isGoldenWindow = (schedule.goldenWindows || []).includes(timeString);

  // 3. 判斷週四超商大促衝刺波 (週四 17:00, 18:00, 19:00)
  const isThursdayRush = dayOfWeek === 4 && (schedule.thursdayRushHours || []).some((rush) => {
    const rHour = parseInt(rush.split(':')[0], 10);
    const rMin = parseInt(rush.split(':')[1] || '0', 10);
    return rHour === hour && rMin === minute;
  });

  const dueTargets: CrawlerTargetConfig[] = [];
  let reason = '';

  if (isGoldenWindow) {
    reason = `🌟 全域黃金時段自動波 (${timeString})`;
  } else if (isThursdayRush) {
    reason = `🔥 週四超商週末買一送一大促衝刺波 (${timeString})`;
  }

  for (const target of enabledTargets) {
    // 模式 A: 跟隨全域黃金波段 (inherit)
    if (target.scheduleMode === 'inherit') {
      if (isGoldenWindow || isThursdayRush) {
        dueTargets.push(target);
      }
    } 
    // 模式 B: 自訂特定時段 (custom)
    else if (target.scheduleMode === 'custom') {
      if ((target.customScheduleTimes || []).includes(timeString)) {
        dueTargets.push(target);
        if (!reason) reason = `⏱️ 站點自訂時段波 (${timeString})`;
      }
    } 
    // 模式 C: 固定間隔分鐘數 (interval)
    else if (target.scheduleMode === 'interval') {
      const intervalMs = (target.customIntervalMinutes || 60) * 60 * 1000;
      const lastCrawlTime = target.lastCrawledAt ? new Date(target.lastCrawledAt).getTime() : 0;
      if (Date.now() - lastCrawlTime >= intervalMs) {
        dueTargets.push(target);
        if (!reason) reason = `⏳ 週期巡檢波 (每 ${target.customIntervalMinutes} 分鐘)`;
      }
    }
  }

  return { dueTargets, triggerReason: reason || 'off_schedule' };
}

/**
 * 執行特定目標的爬蟲管線與入庫
 */
export async function executeCrawlPipelineForTargets(
  targets: CrawlerTargetConfig[],
  runType: 'scheduled' | 'manual' = 'scheduled',
  reasonDesc = '自動排程執行'
): Promise<{
  crawledCount: number;
  insertedCount: number;
  updatedCount: number;
  purgedCount: number;
  totalDealsCount: number;
  deals: SmartDeal[];
}> {
  if (targets.length === 0) {
    return { crawledCount: 0, insertedCount: 0, updatedCount: 0, purgedCount: 0, totalDealsCount: 0, deals: [] };
  }

  const crawledDeals: SmartDeal[] = [];
  const targetNames = targets.map((t) => t.name).join('、');

  // 分流處理部落格與粉專/官網
  const blogTargets = targets.filter((t) => t.targetType === 'blog_media' || t.url.includes('supertaste'));
  const nonBlogTargets = targets.filter((t) => t.targetType !== 'blog_media' && !t.url.includes('supertaste'));

  // 1. 部落格 / 食尚玩家目標
  if (blogTargets.length > 0) {
    const { scrapeBlogArticle, scrapeBlogCategoryList, parseBlogArticleWithGemini } = await import('./blog-crawler.service');
    const { parseTargetCrawlRule } = await import('@/features/admin/types/admin.types');

    for (const bTarget of blogTargets) {
      try {
        const ruleConfig = parseTargetCrawlRule(bTarget.crawlRule);
        const maxArticles = ruleConfig.maxItems && ruleConfig.maxItems > 0 ? ruleConfig.maxItems : 2;
        const customPrompt = ruleConfig.customPrompt;

        let articleUrls: string[] = [];
        if (bTarget.url.match(/\/\d{5,7}$/)) {
          articleUrls = [bTarget.url];
        } else {
          articleUrls = await scrapeBlogCategoryList(bTarget.url, maxArticles);
        }

        for (const aUrl of articleUrls) {
          const scraped = await scrapeBlogArticle(aUrl);
          if (scraped) {
            let deals = await parseBlogArticleWithGemini(scraped, customPrompt);

            // 依關鍵字過濾
            if (ruleConfig.includeKeywords && ruleConfig.includeKeywords.length > 0) {
              const kw = ruleConfig.includeKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
              deals = deals.filter((d) => 
                kw.some((k) => 
                  d.title.toLowerCase().includes(k) || 
                  (d.subtitle && d.subtitle.toLowerCase().includes(k)) ||
                  d.tags.some((t) => t.toLowerCase().includes(k))
                )
              );
            }
            if (ruleConfig.excludeKeywords && ruleConfig.excludeKeywords.length > 0) {
              const exKw = ruleConfig.excludeKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
              deals = deals.filter((d) => 
                !exKw.some((k) => 
                  d.title.toLowerCase().includes(k) || 
                  (d.subtitle && d.subtitle.toLowerCase().includes(k))
                )
              );
            }

            crawledDeals.push(...deals);
          }
        }
        await updateCrawlerTargetDetails(bTarget.id, {
          lastCrawledAt: new Date().toISOString(),
          lastStatus: 'success',
          crawledCount: (bTarget.crawledCount || 0) + 1,
        });
      } catch (err: any) {
        console.error(`[Scheduler] Blog crawl failed for ${bTarget.name}:`, err.message);
        await updateCrawlerTargetDetails(bTarget.id, {
          lastCrawledAt: new Date().toISOString(),
          lastStatus: 'error',
        });
      }
    }
  }

  // 2. 官方 Facebook 粉專與官網
  if (nonBlogTargets.length > 0) {
    try {
      const targetsToCrawl = nonBlogTargets.map((t) => ({
        id: t.id,
        name: t.name,
        url: t.url,
        logo: t.logo || '',
        defaultCategory: (t.defaultCategory as any) || 'food',
      }));
      const fbDeals = await crawlLiveTargets(targetsToCrawl);
      crawledDeals.push(...fbDeals);

      for (const t of nonBlogTargets) {
        await updateCrawlerTargetDetails(t.id, {
          lastCrawledAt: new Date().toISOString(),
          lastStatus: 'success',
          crawledCount: (t.crawledCount || 0) + 1,
        });
      }
    } catch (err: any) {
      console.error('[Scheduler] Live targets crawl error:', err.message);
    }
  }

  // 3. 資料庫寫入與去重
  const upsertResult = await upsertCrawledDeals(crawledDeals);

  // 4. 真實寫入日誌到 PostgreSQL
  await addCrawlerLog({
    targetId: targets.length === 1 ? targets[0].id : undefined,
    targetName: targets.length === 1 ? targets[0].name : `${targets.length} 個排程站點`,
    type: runType,
    status: 'success',
    crawledCount: crawledDeals.length,
    insertedCount: upsertResult.insertedCount,
    message: `${reasonDesc}【${targetNames}】：成功採集 ${crawledDeals.length} 筆，入庫 ${upsertResult.insertedCount} 筆新優惠，更新 ${upsertResult.updatedCount} 筆`,
    details: {
      targetIds: targets.map((t) => t.id),
      purgedCount: upsertResult.purgedCount,
      totalCount: upsertResult.totalCount,
    },
  });

  return {
    crawledCount: crawledDeals.length,
    insertedCount: upsertResult.insertedCount,
    updatedCount: upsertResult.updatedCount,
    purgedCount: upsertResult.purgedCount,
    totalDealsCount: upsertResult.totalCount,
    deals: crawledDeals,
  };
}

/**
 * 執行每小時整點過期情報自動清理
 */
export async function runHourlyAutoPurge(): Promise<void> {
  try {
    const purgeResult = await purgeExpiredDeals();
    if (purgeResult.purgedCount > 0) {
      await addCrawlerLog({
        type: 'auto_purge',
        status: 'success',
        targetName: '系統自動清理巡檢',
        crawledCount: 0,
        insertedCount: 0,
        message: `整點自動巡檢清理完成：成功刪除 ${purgeResult.purgedCount} 筆過期特惠活動與 ${purgeResult.purgedBookmarkCount} 筆孤立收藏`,
        details: purgeResult as any,
      });
      console.log(`[Hourly Purge] Purged ${purgeResult.purgedCount} expired deals.`);
    }
  } catch (err: any) {
    console.error('[Hourly Purge Error]:', err.message);
    await addCrawlerLog({
      type: 'auto_purge',
      status: 'failed',
      targetName: '系統自動清理巡檢',
      crawledCount: 0,
      insertedCount: 0,
      message: `整點過期清理作業失敗：${err.message}`,
    });
  }
}

/**
 * 伺服器排程核心檢查工作 (每分鐘由常駐 Daemon 觸發)
 */
export async function tickCrawlerScheduler(): Promise<void> {
  if (global.__crawlerSchedulerRunning) {
    return;
  }

  const now = new Date();
  const { minute, minuteKey, hourKey } = getTaiwanTimeParts(now);

  try {
    global.__crawlerSchedulerRunning = true;

    // 1. 每小時整點 (minute === 0) 執行過期情報清理
    if (minute === 0 && global.__lastPurgedHourKey !== hourKey) {
      global.__lastPurgedHourKey = hourKey;
      await runHourlyAutoPurge();
    }

    // 2. 比對當前分鐘是否有應運行的站點排程
    if (global.__lastScheduledMinuteKey !== minuteKey) {
      const { dueTargets, triggerReason } = await getDueCrawlerTargets(now);
      if (dueTargets.length > 0) {
        global.__lastScheduledMinuteKey = minuteKey;
        console.log(`[Scheduler Daemon] 🚀 Running scheduled crawl: ${triggerReason} for ${dueTargets.length} targets`);
        await executeCrawlPipelineForTargets(dueTargets, 'scheduled', triggerReason);
      }
    }
  } catch (err: any) {
    console.error('[Scheduler Daemon Error]:', err.message);
  } finally {
    global.__crawlerSchedulerRunning = false;
  }
}

/**
 * 啟動伺服器常駐排程 Daemon (單例，每分鐘執行一次)
 */
export function startCrawlerSchedulerDaemon(): void {
  if (global.__crawlerSchedulerTimer) {
    return;
  }

  console.log('----------------------------------------------------------------');
  console.log('🤖 [Next.js Server Crawler Scheduler Daemon Initialized]');
  console.log('🕒 支援每日黃金時段、週四衝刺大促與每小時自動過期清理巡檢');
  console.log('----------------------------------------------------------------');

  // 立即執行一次初始檢查
  tickCrawlerScheduler().catch((e) => console.error('[Daemon Initial Tick Error]:', e));

  // 每 60 秒定期巡檢一次
  global.__crawlerSchedulerTimer = setInterval(() => {
    tickCrawlerScheduler().catch((e) => console.error('[Daemon Interval Tick Error]:', e));
  }, 60 * 1000);
}
