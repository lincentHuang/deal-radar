'use server';

import { 
  getCrawlerTargets, 
  toggleCrawlerTarget, 
  createCrawlerTarget,
  updateCrawlerTargetDetails,
  batchUpdateCrawlerTargets,
  deleteCrawlerTarget,
  batchDeleteCrawlerTargets,
  restoreDefaultCrawlerTargets,
  reorderCrawlerTargets,
  batchToggleBrandGroupTargets,
  batchSetBrandGroup,
  getTargetDealsStats,
  getBrandGroupIcons,
  setBrandGroupIcon,
  fetchFacebookAvatar,
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
import { getDeals, updateDeal, deleteDeal, toggleDealHot, toggleDealFlash, upsertCrawledDeals, purgeExpiredDeals } from '@/features/deals/server/deals-dal';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { crawlLiveTargets } from '@/features/deals/server/fb-crawler.service';
import { revalidatePath } from 'next/cache';

import { verifyAdminPinFromDb, getAdminSecurityConfigFromDb } from './admin-permission-dal';

const MASTER_ADMIN_PIN = process.env.ADMIN_PIN || '8888';

/**
 * 驗證最高管理員安全 PIN 碼 (優先檢驗自訂持久化 PIN 碼)
 */
export async function verifyAdminPinAction(pin: string): Promise<{ success: boolean; message: string }> {
  const trimmed = pin.trim();
  
  // 檢查是否為演示 8888
  if (trimmed === '8888') {
    const config = await getAdminSecurityConfigFromDb();
    if (config.quickDemoUnlockEnabled) {
      return { success: true, message: '最高管理權限驗證通過 (快速展示模式)' };
    }
  }

  const isValid = await verifyAdminPinFromDb(trimmed);
  if (isValid || trimmed === MASTER_ADMIN_PIN) {
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
    targetType: formData.get('targetType') || 'blog_media',
    defaultCategory: formData.get('defaultCategory') || 'food',
    scheduleMode: formData.get('scheduleMode') || 'inherit',
    customScheduleTimes: formData.get('customScheduleTimes') || undefined,
    customIntervalMinutes: formData.get('customIntervalMinutes') ? Number(formData.get('customIntervalMinutes')) : 60,
    crawlRule: formData.get('crawlRule') || undefined,
    brandGroup: formData.get('brandGroup') || undefined,
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
    message: `管理者更新了【${updated.name}】的爬蟲設定與邏輯規則`,
  });

  revalidatePath('/admin');
  return { success: true, message: `已成功儲存【${updated.name}】詳細設定與爬蟲邏輯`, target: updated };
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
 * 刪除爬蟲目標站點 (支援全站點刪除)
 */
export async function deleteCrawlerTargetAction(targetId: string, name?: string): Promise<{
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
    message: `管理者刪除了爬蟲目標站點【${name || targetId}】`,
  });

  revalidatePath('/admin');
  return { success: true, message: `已成功刪除站點【${name || targetId}】` };
}

/**
 * 批量刪除多個爬蟲目標站點
 */
export async function batchDeleteCrawlerTargetsAction(targetIds: string[]): Promise<{
  success: boolean;
  message: string;
  deletedCount: number;
}> {
  if (!targetIds || targetIds.length === 0) {
    return { success: false, message: '請至少選取一個欲刪除的站點', deletedCount: 0 };
  }

  const count = await batchDeleteCrawlerTargets(targetIds);

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者批量刪除了 ${count} 個爬蟲目標站點`,
  });

  revalidatePath('/admin');
  return {
    success: true,
    message: `已成功批量刪除 ${count} 個爬蟲站點`,
    deletedCount: count,
  };
}

/**
 * 重新排序爬蟲目標站點 (持久化拖曳順序)
 */
export async function reorderCrawlerTargetsAction(orderedIds: string[]): Promise<{
  success: boolean;
  message: string;
}> {
  const ok = await reorderCrawlerTargets(orderedIds);
  if (ok) {
    revalidatePath('/admin');
    return { success: true, message: '站點順序已更新！' };
  }
  return { success: false, message: '儲存站點順序失敗' };
}

/**
 * 針對特定品牌群組進行一鍵啟用或停用
 */
export async function batchToggleBrandGroupAction(
  brandGroup: string,
  enabled: boolean
): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  const count = await batchToggleBrandGroupTargets(brandGroup, enabled);

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者一鍵將【${brandGroup}】共 ${count} 個來源設定為：${enabled ? '啟用' : '停用'}`,
  });

  revalidatePath('/admin');
  return {
    success: true,
    message: `已將【${brandGroup}】共 ${count} 個來源管道設為：${enabled ? '啟用' : '暫停'}`,
    count,
  };
}

/**
 * 批量為多個爬蟲站點設定品牌群組 (可批量指派群組或批量解除群組)
 */
export async function batchSetBrandGroupAction(
  targetIds: string[],
  brandGroup: string | null
): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  if (!targetIds || targetIds.length === 0) {
    return { success: false, message: '請至少選取一個站點', count: 0 };
  }

  const { count } = await batchSetBrandGroup(targetIds, brandGroup);

  const groupDesc = brandGroup?.trim() ? `【${brandGroup.trim()}】` : '獨立站點 (無群組)';
  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者批量將 ${count} 個爬蟲目標站點設定為：${groupDesc}`,
  });

  revalidatePath('/admin');
  return {
    success: true,
    message: brandGroup?.trim()
      ? `已成功將 ${count} 個站點指派為群組【${brandGroup.trim()}】！`
      : `已成功為 ${count} 個站點解除群組（變更為獨立站點）！`,
    count,
  };
}

/**
 * 取得特定爬蟲站點的所有優惠情報、在線情報與成效統計指標
 */
export async function getTargetDealsStatsAction(targetId: string): Promise<{
  success: boolean;
  message: string;
  data?: {
    target: CrawlerTargetConfig | null;
    totalCrawled: number;
    activeCount: number;
    expiredCount: number;
    activeDeals: SmartDeal[];
    expiredDeals: SmartDeal[];
  };
}> {
  try {
    const data = await getTargetDealsStats(targetId);
    return { success: true, message: '成功取得站點情報數據', data };
  } catch (err: any) {
    console.error('[AdminAction] getTargetDealsStatsAction error:', err);
    return { success: false, message: err?.message || '取得情報數據失敗' };
  }
}

/**
 * 取得所有品牌群組的自訂 Icon 配置
 */
export async function getBrandGroupIconsAction(): Promise<Record<string, string>> {
  return getBrandGroupIcons();
}

/**
 * 更新特定品牌群組的專屬 Icon (PostgreSQL)
 */
export async function updateBrandGroupIconAction(
  brandName: string,
  iconUrl: string | null
): Promise<{ success: boolean; message: string }> {
  const ok = await setBrandGroupIcon(brandName, iconUrl);
  if (ok) {
    revalidatePath('/admin');
    return {
      success: true,
      message: iconUrl ? `已成功更新【${brandName}】群組專屬 Icon！` : `已清除【${brandName}】群組自訂 Icon`,
    };
  }
  return { success: false, message: '儲存群組 Icon 失敗' };
}

/**
 * 從 Facebook 粉絲專頁網址自動抓取官方最新頭像 / 大頭貼
 */
export async function fetchFacebookAvatarAction(
  urlOrHandle: string
): Promise<{ success: boolean; avatarUrl?: string; message: string }> {
  try {
    const avatarUrl = await fetchFacebookAvatar(urlOrHandle);
    if (avatarUrl) {
      return { success: true, avatarUrl, message: '成功擷取 FB 官方大頭貼！' };
    }
    return { success: false, message: '無法從該 Facebook 粉絲專頁取得頭像，請確認網址或手動輸入圖檔 URL' };
  } catch (err: any) {
    return { success: false, message: err?.message || '抓取 FB 頭像失敗' };
  }
}

/**
 * 一鍵恢復官方預設推薦種子站點
 */
export async function restoreDefaultCrawlerTargetsAction(): Promise<{
  success: boolean;
  message: string;
  restoredCount: number;
}> {
  const { restoredCount } = await restoreDefaultCrawlerTargets();

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `管理者執行了恢復預設站點操作，共補齊 ${restoredCount} 個推薦站點`,
  });

  revalidatePath('/admin');
  return {
    success: true,
    message: restoredCount > 0 
      ? `🎉 已成功補齊 ${restoredCount} 個官方預設推薦站點！` 
      : '官方預設推薦站點皆已存在，無須補齊。',
    restoredCount,
  };
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

    const crawledDeals: SmartDeal[] = [];

    // 依站點類型分流抓取
    const blogTargets = selectedTargets.filter((t) => t.targetType === 'blog_media' || t.url.includes('supertaste'));
    const nonBlogTargets = selectedTargets.filter((t) => t.targetType !== 'blog_media' && !t.url.includes('supertaste'));

    // 1. 抓取部落格 / 食尚玩家目標
    if (blogTargets.length > 0) {
      const { scrapeBlogArticle, scrapeBlogCategoryList, parseBlogArticleWithGemini } = await import('@/features/deals/server/blog-crawler.service');
      for (const bTarget of blogTargets) {
        try {
          if (bTarget.url.match(/\/\d{5,7}$/)) {
            // 單篇文章網址 (例如 /food/360820)
            const scraped = await scrapeBlogArticle(bTarget.url);
            if (scraped) {
              const deals = await parseBlogArticleWithGemini(scraped);
              crawledDeals.push(...deals);
            }
          } else {
            // 分類列表頁 (例如 /category/food/all/convenience-store)
            const articleUrls = await scrapeBlogCategoryList(bTarget.url, 3);
            for (const aUrl of articleUrls) {
              const scraped = await scrapeBlogArticle(aUrl);
              if (scraped) {
                const deals = await parseBlogArticleWithGemini(scraped);
                crawledDeals.push(...deals);
              }
            }
          }
        } catch (bErr) {
          console.error(`[Admin] Blog target crawl error (${bTarget.name}):`, bErr);
        }
      }
    }

    // 2. 抓取官方 Facebook 粉專與官網
    if (nonBlogTargets.length > 0) {
      const targetsToCrawl = nonBlogTargets.map((t) => ({
        id: t.id,
        name: t.name,
        url: t.url,
        logo: t.logo || '',
        defaultCategory: (t.defaultCategory as 'food' | 'grocery') || 'food',
      }));
      const fbDeals = await crawlLiveTargets(targetsToCrawl);
      crawledDeals.push(...fbDeals);
    }

    // 存入資料庫與更新現有資料 (遵守粉專優先原則)
    const result = await upsertCrawledDeals(crawledDeals);

    await addCrawlerLog({
      targetId: Array.isArray(targetIds) ? targetIds.join(',') : (targetIds || 'all'),
      targetName: selectedTargets.length === 1 ? selectedTargets[0].name : `${selectedTargets.length} 個選取站點`,
      type: 'manual',
      status: 'success',
      crawledCount: crawledDeals.length,
      insertedCount: result.insertedCount,
      message: `即時抓取【${targetNamesStr}】完成：成功採集解析 ${crawledDeals.length} 筆特惠情報，寫入 ${result.insertedCount} 筆新卡片，更新 ${result.updatedCount} 筆，清理 ${result.purgedCount} 筆過期項目`,
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/merchant');

    return {
      success: true,
      message: `🎉 爬蟲抓取完成！已自 ${selectedTargets.length} 個目標站點即時採集 ${crawledDeals.length} 筆情報資料，成功建立 ${result.insertedCount} 筆特價卡片！`,
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

/**
 * 管理者手動輸入單篇食尚玩家 / 綜合部落格文章 URL 即時爬取入庫
 */
export async function crawlSingleBlogArticleAction(url: string): Promise<{
  success: boolean;
  message: string;
  deals: SmartDeal[];
  insertedCount: number;
}> {
  try {
    const { crawlAndSaveSingleBlogArticle } = await import('@/features/deals/server/blog-crawler.service');
    const result = await crawlAndSaveSingleBlogArticle(url);

    if (result.success) {
      await addCrawlerLog({
        type: 'manual',
        status: 'success',
        crawledCount: result.deals.length,
        insertedCount: result.insertedCount,
        message: `單篇部落格即時採集成功：${url} 萃取出 ${result.deals.length} 筆情報卡片`,
      });
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/merchant');
    }

    return {
      success: result.success,
      message: result.message,
      deals: result.deals,
      insertedCount: result.insertedCount,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || '單篇文章抓取失敗',
      deals: [],
      insertedCount: 0,
    };
  }
}

/**
 * 管理者一鍵觸發過期特價活動與孤立收藏自動清理
 */
export async function adminPurgeExpiredDealsAction(): Promise<{
  success: boolean;
  message: string;
  purgedCount: number;
  purgedBookmarkCount: number;
  purgedDeals: { id: string; title: string; endDate: string }[];
}> {
  try {
    const result = await purgeExpiredDeals();

    await addCrawlerLog({
      type: 'manual',
      status: 'success',
      crawledCount: 0,
      insertedCount: 0,
      message: result.purgedCount > 0
        ? `系統自動化清理作業完成：成功刪除 ${result.purgedCount} 筆已過期活動及 ${result.purgedBookmarkCount} 筆孤立收藏記錄`
        : '執行過期巡檢：資料庫目前無已過期之情報項目',
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/merchant');

    return {
      success: true,
      message: result.purgedCount > 0
        ? `🎉 成功清理 ${result.purgedCount} 筆過期特惠活動（包含 ${result.purgedBookmarkCount} 筆孤立收藏）！`
        : '✨ 目前資料庫無過期特價情報，所有項目皆在有效期限內！',
      purgedCount: result.purgedCount,
      purgedBookmarkCount: result.purgedBookmarkCount,
      purgedDeals: result.purgedDeals,
    };
  } catch (error: any) {
    await addCrawlerLog({
      type: 'manual',
      status: 'failed',
      crawledCount: 0,
      insertedCount: 0,
      message: `過期清理作業失敗：${error.message}`,
    });

    return {
      success: false,
      message: error.message || '清理過期活動時發生錯誤',
      purgedCount: 0,
      purgedBookmarkCount: 0,
      purgedDeals: [],
    };
  }
}
