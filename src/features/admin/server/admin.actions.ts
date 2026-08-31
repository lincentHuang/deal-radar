'use server';

import { 
  getCrawlerTargets, 
  toggleCrawlerTarget, 
  createCrawlerTarget,
  updateCrawlerTargetDetails,
  batchUpdateCrawlerTargets,
  deleteCrawlerTarget,
  getCrawlerSchedule, 
  updateCrawlerSchedule, 
  addCrawlerLog, 
  getCrawlerLogs, 
  getAdminDashboardStats 
} from './admin-dal';
import { 
  CrawlerScheduleConfig, 
  CrawlerJobLog, 
  CrawlerTargetConfig, 
  AdminStats, 
  CreateCrawlerTargetInput 
} from '../types/admin.types';
import { CreateCrawlerTargetSchema } from '../schemas/admin.schema';
import { getDeals, updateDeal, deleteDeal, toggleDealHot, toggleDealFlash, upsertCrawledDeals } from '@/features/deals/server/deals-dal';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { crawlLiveTargets } from '@/features/deals/server/fb-crawler.service';
import { revalidatePath } from 'next/cache';

const MASTER_ADMIN_PIN = process.env.ADMIN_PIN || '8888';

/**
 * 驗證最高管理員安全 PIN 碼
 */
export async function verifyAdminPinAction(pin: string): Promise<{ success: boolean; message: string }> {
  if (pin.trim() === MASTER_ADMIN_PIN) {
    return { success: true, message: '最高管理權限驗證通過' };
  }
  return { success: false, message: 'PIN 碼錯誤，請確認後重試' };
}

/**
 * 獲取管理後台整合資料 (統計數據、站點清單、排程設定、日誌)
 */
export async function fetchAdminDashboardDataAction(): Promise<{
  stats: AdminStats;
  targets: CrawlerTargetConfig[];
  schedule: CrawlerScheduleConfig;
  logs: CrawlerJobLog[];
}> {
  const [stats, targets, schedule, logs] = await Promise.all([
    getAdminDashboardStats(),
    getCrawlerTargets(),
    getCrawlerSchedule(),
    getCrawlerLogs(),
  ]);

  return { stats, targets, schedule, logs };
}

/**
 * 新增自訂爬蟲目標站點
 */
export async function createCrawlerTargetAction(formData: FormData): Promise<{
  success: boolean;
  message: string;
  target?: CrawlerTargetConfig;
  errors?: Record<string, string[]>;
}> {
  const rawData = {
    name: formData.get('name'),
    url: formData.get('url'),
    logo: formData.get('logo') || undefined,
    defaultCategory: formData.get('defaultCategory') || 'food',
    scheduleMode: formData.get('scheduleMode') || 'inherit',
    customScheduleTimes: formData.get('customScheduleTimes') || undefined,
    customIntervalMinutes: formData.get('customIntervalMinutes') ? Number(formData.get('customIntervalMinutes')) : 60,
    crawlRule: formData.get('crawlRule') || undefined,
  };

  const parsed = CreateCrawlerTargetSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: '站點資料驗證失敗，請檢查欄位',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const created = await createCrawlerTarget(parsed.data);
    await addCrawlerLog({
      targetId: created.id,
      targetName: created.name,
      type: 'manual',
      status: 'success',
      crawledCount: 0,
      insertedCount: 0,
      message: `管理者新增了爬蟲目標站點【${created.name}】(${created.url})`,
    });

    revalidatePath('/admin');
    return {
      success: true,
      message: `🎉 已成功新增爬蟲目標站點【${created.name}】！`,
      target: created,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '新增站點失敗',
    };
  }
}

/**
 * 單獨編輯爬蟲站點排程與屬性
 */
export async function updateCrawlerTargetDetailsAction(
  targetId: string,
  updates: Partial<CrawlerTargetConfig>
): Promise<{
  success: boolean;
  message: string;
  target?: CrawlerTargetConfig;
}> {
  const updated = await updateCrawlerTargetDetails(targetId, updates);
  if (!updated) {
    return { success: false, message: '找不到欲修改的站點' };
  }

  await addCrawlerLog({
    targetId,
    targetName: updated.name,
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者更新了【${updated.name}】的排程模式為：${updated.scheduleMode}`,
  });

  revalidatePath('/admin');
  return { success: true, message: `已成功更新【${updated.name}】排程設定`, target: updated };
}

/**
 * 批量更新多個爬蟲目標站點 (批量啟用/停用、批量設定排程時段)
 */
export async function batchUpdateCrawlerTargetsAction(
  targetIds: string[],
  updates: Partial<CrawlerTargetConfig>
): Promise<{
  success: boolean;
  message: string;
  updatedCount: number;
}> {
  if (!targetIds || targetIds.length === 0) {
    return { success: false, message: '請至少選取一個站點', updatedCount: 0 };
  }

  const count = await batchUpdateCrawlerTargets(targetIds, updates);

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者批量更新了 ${count} 個爬蟲目標站點的設定`,
  });

  revalidatePath('/admin');
  return {
    success: true,
    message: `🎉 已成功批量更新 ${count} 個站點的設定！`,
    updatedCount: count,
  };
}

/**
 * 刪除自訂爬蟲目標站點
 */
export async function deleteCrawlerTargetAction(targetId: string): Promise<{
  success: boolean;
  message: string;
}> {
  const success = await deleteCrawlerTarget(targetId);
  if (!success) {
    return { success: false, message: '找不到站點或無法刪除' };
  }

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者刪除了自訂爬蟲站點 (ID: ${targetId})`,
  });

  revalidatePath('/admin');
  return { success: true, message: '已成功刪除該站點' };
}

/**
 * 切換特定爬蟲站點啟用狀態
 */
export async function updateCrawlerTargetAction(targetId: string, enabled: boolean): Promise<{
  success: boolean;
  message: string;
  target?: CrawlerTargetConfig;
}> {
  const updated = await toggleCrawlerTarget(targetId, enabled);
  if (!updated) {
    return { success: false, message: '找不到對應站點' };
  }

  await addCrawlerLog({
    targetId,
    targetName: updated.name,
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者將【${updated.name}】狀態切換為：${enabled ? '🟢 啟用' : '⚪ 停用'}`,
  });

  revalidatePath('/admin');
  return { success: true, message: `已更新 ${updated.name} 狀態`, target: updated };
}

/**
 * 更新爬蟲階梯排程配置
 */
export async function updateCrawlerScheduleAction(newSchedule: Partial<CrawlerScheduleConfig>): Promise<{
  success: boolean;
  message: string;
  schedule: CrawlerScheduleConfig;
}> {
  const updated = await updateCrawlerSchedule(newSchedule);

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者更新了全域排程設定 (黃金波段: ${updated.goldenWindows.join(', ')})`,
  });

  revalidatePath('/admin');
  return { success: true, message: '排程設定已成功儲存！', schedule: updated };
}

/**
 * 手動觸發即時爬蟲 (支援單站、多站勾選或全站全量爬取)
 */
export async function triggerManualCrawlAction(targetIds?: string | string[]): Promise<import('../types/admin.types').CrawlerExecutionResult> {
  try {
    const targets = await getCrawlerTargets();
    let selectedTargets: CrawlerTargetConfig[] = [];

    if (!targetIds || targetIds === 'all') {
      selectedTargets = targets.filter((t) => t.enabled);
    } else if (Array.isArray(targetIds)) {
      selectedTargets = targets.filter((t) => targetIds.includes(t.id));
    } else {
      selectedTargets = targets.filter((t) => t.id === targetIds);
    }

    if (selectedTargets.length === 0) {
      return {
        success: false,
        message: '未選取或無啟用的爬蟲目標站點',
        crawledCount: 0,
        insertedCount: 0,
        updatedCount: 0,
        purgedCount: 0,
        totalCount: 0,
        createdDeals: [],
        updatedDeals: [],
        targetNames: [],
      };
    }

    const targetNames = selectedTargets.map((t) => t.name);
    const targetNamesStr = targetNames.join('、');

    // 轉換為爬蟲目標配置
    const targetsToCrawl = selectedTargets.map((t) => ({
      id: t.id,
      name: t.name,
      url: t.url,
      logo: t.logo || '',
      defaultCategory: (t.defaultCategory as 'food' | 'grocery') || 'food',
    }));

    // 執行真實 Playwright + Gemini AI 即時採集與解析
    const crawledDeals = await crawlLiveTargets(targetsToCrawl);

    // 存入資料庫與更新現有資料
    const result = await upsertCrawledDeals(crawledDeals);

    await addCrawlerLog({
      targetId: Array.isArray(targetIds) ? targetIds.join(',') : (targetIds || 'all'),
      targetName: selectedTargets.length === 1 ? selectedTargets[0].name : `${selectedTargets.length} 個選取站點`,
      type: 'manual',
      status: 'success',
      crawledCount: crawledDeals.length,
      insertedCount: result.insertedCount,
      message: `真實即時抓取【${targetNamesStr}】完成：成功採集解析 ${crawledDeals.length} 筆真實特惠情報，寫入 ${result.insertedCount} 筆新卡片，更新 ${result.updatedCount} 筆，清理 ${result.purgedCount} 筆過期項目`,
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/merchant');

    return {
      success: true,
      message: `🎉 真實爬蟲抓取完成！已自 ${selectedTargets.length} 個目標站點即時採集 ${crawledDeals.length} 筆真實資料，成功建立 ${result.insertedCount} 筆特價卡片！`,
      crawledCount: crawledDeals.length,
      insertedCount: result.insertedCount,
      updatedCount: result.updatedCount,
      purgedCount: result.purgedCount,
      totalCount: result.totalCount,
      createdDeals: result.createdDeals,
      updatedDeals: result.updatedDeals,
      targetNames,
    };
  } catch (error: any) {
    await addCrawlerLog({
      type: 'manual',
      status: 'failed',
      crawledCount: 0,
      insertedCount: 0,
      message: `手動抓取失敗：${error.message}`,
    });
    return {
      success: false,
      message: error.message || '手動抓取失敗',
      crawledCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      purgedCount: 0,
      totalCount: 0,
      createdDeals: [],
      updatedDeals: [],
      targetNames: [],
    };
  }
}
