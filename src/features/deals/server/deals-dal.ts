import 'server-only';
import { SmartDeal, DealFilterState } from '@/features/deals/types/deal.types';
import { INITIAL_SMART_DEALS } from '@/features/deals/server/deals-mock-data';
import { MerchantCreateDealInput } from '@/features/deals/schemas/deal.schema';
import { prisma } from '@/shared/lib/prisma';
import { filterDealsLocally } from '@/features/deals/utils/deal-filter-utils';

export { filterDealsLocally };

// 伺服器端高速記憶體快取 (減少每次 Server Action 重複請求遠端 Neon PostgreSQL 之網路延遲)
let cachedDeals: SmartDeal[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 秒記憶體快取
let hasCheckedSeed = false;
let lastPurgeTime = 0;
const PURGE_THROTTLE_MS = 10 * 60 * 1000; // 每 10 分鐘最多在背景執行一次過期清理

export function invalidateDealsCache(): void {
  cachedDeals = null;
  lastCacheTime = 0;
}

// 將 Prisma Deal 資料模型轉換為前端統一的 SmartDeal 型別契約
function mapDbDealToSmartDeal(record: any): SmartDeal {
  return {
    id: record.id,
    title: record.title,
    subtitle: record.subtitle ?? undefined,
    category: record.category as any,
    channelType: record.channelType as any,
    merchant: {
      name: record.merchantName,
      logo: record.merchantLogo ?? undefined,
      storeBranches: record.storeBranches ?? undefined,
    },
    regions: record.regions ?? [],
    originalPrice: record.originalPrice ?? undefined,
    discountPrice: record.discountPrice ?? undefined,
    priceUnit: record.priceUnit ?? undefined,
    targetItems: record.targetItems ?? [],
    conditions: record.conditions ?? [],
    eligibleCards: record.eligibleCards ?? [],
    tags: record.tags ?? [],
    startDate: record.startDate,
    endDate: record.endDate,
    isHot: record.isHot,
    isFlashDeal: record.isFlashDeal,
    source: record.source as any,
    sourcePlatform: record.sourcePlatform as any,
    sourceUrl: record.sourceUrl ?? undefined,
    likeCount: record.likeCount ?? 0,
    commentCount: record.commentCount ?? 0,
    priceHistory: record.priceHistory as any,
    priceDropAlert: record.priceDropAlert as any,
    imageUrl: record.imageUrl ?? undefined,
    images: record.images && record.images.length > 0 ? record.images : (record.imageUrl ? [record.imageUrl] : []),
    aspectRatio: record.aspectRatio as any,
  };
}

let isSeeding = false;

/**
 * 確保遠端資料庫具備基礎特惠情報（若資料庫為空，自動寫入 87 筆初始情報）
 */
async function ensureDealsSeeded(): Promise<void> {
  if (isSeeding) return;
  try {
    const count = await prisma.deal.count();
    if (count === 0) {
      isSeeding = true;
      console.log('[Deals-DAL] 📦 Remote database is empty. Auto-seeding initial deals...');
      const data = INITIAL_SMART_DEALS.map((deal) => ({
        id: deal.id,
        title: deal.title,
        subtitle: deal.subtitle || null,
        category: deal.category,
        channelType: deal.channelType,
        merchantName: deal.merchant.name,
        merchantLogo: deal.merchant.logo || null,
        storeBranches: deal.merchant.storeBranches || null,
        regions: deal.regions || [],
        originalPrice: deal.originalPrice || null,
        discountPrice: deal.discountPrice || null,
        priceUnit: deal.priceUnit || '元',
        targetItems: deal.targetItems || [],
        conditions: deal.conditions || [],
        eligibleCards: deal.eligibleCards || [],
        tags: deal.tags || [],
        startDate: deal.startDate,
        endDate: deal.endDate,
        isHot: Boolean(deal.isHot),
        isFlashDeal: Boolean(deal.isFlashDeal),
        source: deal.source || 'official',
        sourcePlatform: deal.sourcePlatform || null,
        sourceUrl: deal.sourceUrl || null,
        likeCount: deal.likeCount || 0,
        commentCount: deal.commentCount || 0,
        priceHistory: deal.priceHistory ? (deal.priceHistory as any) : undefined,
        priceDropAlert: deal.priceDropAlert ? (deal.priceDropAlert as any) : undefined,
        imageUrl: deal.imageUrl || null,
        images: deal.images || (deal.imageUrl ? [deal.imageUrl] : []),
        aspectRatio: deal.aspectRatio || null,
      }));

      await prisma.deal.createMany({
        data,
        skipDuplicates: true,
      });
      console.log(`[Deals-DAL] ✅ Successfully seeded ${data.length} deals into remote Neon PostgreSQL.`);
    }
  } catch (err) {
    console.error('[Deals-DAL] ⚠️ ensureDealsSeeded error:', err);
  } finally {
    isSeeding = false;
  }
}

export interface PaginatedDealsResult {
  deals: SmartDeal[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  offset?: number;
}

/**
 * 依據篩選條件自遠端資料庫查詢特價情報 (支援瀑布流精確 offset 與分頁動態載入)
 */
export async function getPaginatedDeals(
  filters?: Partial<DealFilterState>,
  page: number = 1,
  pageSize: number = 12,
  offset?: number
): Promise<PaginatedDealsResult> {
  const allFiltered = await getDeals(filters);
  const total = allFiltered.length;
  const safePageSize = Math.max(1, pageSize);
  const startIndex = offset !== undefined ? Math.max(0, offset) : (Math.max(1, page) - 1) * safePageSize;
  const pageDeals = allFiltered.slice(startIndex, startIndex + safePageSize);
  const hasMore = startIndex + pageDeals.length < total;

  return {
    deals: pageDeals,
    total,
    page: offset !== undefined ? Math.floor(startIndex / safePageSize) + 1 : Math.max(1, page),
    pageSize: safePageSize,
    hasMore,
    offset: startIndex,
  };
}

/**
 * 依據篩選條件自遠端資料庫查詢特價情報 (具備高速伺服器記憶體快取)
 */
export async function getDeals(filters?: Partial<DealFilterState>): Promise<SmartDeal[]> {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('[Deals-DAL] ⚠️ DATABASE_URL is not set. Using INITIAL_SMART_DEALS fallback.');
      return filterDealsLocally(INITIAL_SMART_DEALS, filters);
    }

    const now = Date.now();
    if (!hasCheckedSeed) {
      await ensureDealsSeeded();
      hasCheckedSeed = true;
    }

    // 背景節流清理過期情報 (不阻塞使用者請求)
    if (now - lastPurgeTime > PURGE_THROTTLE_MS) {
      lastPurgeTime = now;
      purgeExpiredDeals().catch(() => {});
    }

    let allDeals = cachedDeals;
    if (!allDeals || now - lastCacheTime > CACHE_TTL_MS) {
      const records = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' },
      });
      allDeals = records.map(mapDbDealToSmartDeal);
      cachedDeals = allDeals;
      lastCacheTime = now;
    }

    return filterDealsLocally(allDeals, filters);
  } catch (err) {
    console.error('[Deals-DAL] ⚠️ Database query failed, falling back to cached deals:', err);
    return filterDealsLocally(cachedDeals || INITIAL_SMART_DEALS, filters);
  }
}

/**
 * 依 ID 取得單筆特價卡片
 */
export async function getDealById(id: string): Promise<SmartDeal | null> {
  try {
    if (!process.env.DATABASE_URL) {
      return INITIAL_SMART_DEALS.find((d) => d.id === id) || null;
    }
    await ensureDealsSeeded();
    const record = await prisma.deal.findUnique({ where: { id } });
    return record ? mapDbDealToSmartDeal(record) : (INITIAL_SMART_DEALS.find((d) => d.id === id) || null);
  } catch (err) {
    console.error(`[Deals-DAL] getDealById ${id} error:`, err);
    return INITIAL_SMART_DEALS.find((d) => d.id === id) || null;
  }
}

/**
 * 商家發布新特價活動 (寫入遠端資料庫)
 */
export async function createDeal(input: MerchantCreateDealInput): Promise<SmartDeal> {
  const newDealData = {
    id: `deal-merchant-${Date.now()}`,
    title: input.title,
    category: input.category,
    channelType: input.channelType,
    merchantName: input.merchantName,
    merchantLogo: null,
    storeBranches: input.district ? `${input.city} ${input.district} 門市` : `${input.city} 指定門市`,
    regions: [input.city, input.district ? `${input.city} / ${input.district}` : input.city],
    originalPrice: input.originalPrice ?? null,
    discountPrice: input.discountPrice ?? null,
    priceUnit: '份',
    targetItems: input.targetItems.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
    conditions: input.conditions.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean),
    eligibleCards: input.eligibleCards ? input.eligibleCards.split(/[,，、]/).map((s) => s.trim()).filter(Boolean) : [],
    tags: input.tags 
      ? input.tags.split(/[,，、\s]/).map((t) => t.startsWith('#') ? t : `#${t}`).filter((t) => t !== '#')
      : [`#${input.merchantName}`, `#特價`],
    startDate: new Date(input.startDate).toISOString().split('T')[0],
    endDate: new Date(input.endDate).toISOString().split('T')[0],
    isHot: true,
    isFlashDeal: true,
    source: 'merchant_post',
    sourcePlatform: 'Merchant',
    likeCount: 1,
    commentCount: 0,
    priceHistory: [
      { date: '昨日', price: input.originalPrice || input.discountPrice * 1.5 },
      { date: '今日', price: input.discountPrice },
    ],
    priceDropAlert: {
      isLowest90Days: true,
      isSuspiciousHike: false,
      note: '店家自主官方發布破盤特惠！',
    },
    imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    images: [input.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
    aspectRatio: input.aspectRatio || null,
  };

  const created = await prisma.deal.create({
    data: newDealData,
  });

  invalidateDealsCache();
  return mapDbDealToSmartDeal(created);
}

/**
 * 核銷優惠券代碼
 */
export async function redeemVoucher(voucherCode: string, dealId: string): Promise<{
  success: boolean;
  message: string;
  dealTitle?: string;
  redeemedAt: string;
}> {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) {
    return {
      success: false,
      message: '找不到對應的優惠情報',
      redeemedAt: new Date().toISOString(),
    };
  }

  // 驗證碼防呆規則 (4 碼以上)
  if (voucherCode.length < 4) {
    return {
      success: false,
      message: '無效的核銷碼，請確認後重新輸入',
      redeemedAt: new Date().toISOString(),
    };
  }

  return {
    success: true,
    message: `核銷成功！已成功兌換【${deal.title}】`,
    dealTitle: deal.title,
    redeemedAt: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * 自動清理遠端資料庫中已過期的特惠活動 (endDate < 今日)
 */
export async function purgeExpiredDeals(): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const expiredRecords = await prisma.deal.findMany({
      where: {
        endDate: {
          lt: today,
          not: '',
        },
      },
    });

    if (expiredRecords.length > 0) {
      const expiredIds = expiredRecords.map((r) => r.id);
      const deleteRes = await prisma.deal.deleteMany({
        where: { id: { in: expiredIds } },
      });
      console.log(`[Deals-DAL] 🧹 Purged ${deleteRes.count} expired deals from remote database.`);
      return deleteRes.count;
    }
    return 0;
  } catch (err) {
    console.error('[Deals-DAL] ⚠️ purgeExpiredDeals error:', err);
    return 0;
  }
}

/**
 * 批次寫入或更新爬蟲爬取的特價情報 (遠端資料庫 upsert 去重)
 */
export async function upsertCrawledDeals(crawledDeals: SmartDeal[]): Promise<{
  insertedCount: number;
  updatedCount: number;
  totalCount: number;
  purgedCount: number;
  createdDeals: SmartDeal[];
  updatedDeals: SmartDeal[];
}> {
  const purgedCount = await purgeExpiredDeals();

  let insertedCount = 0;
  let updatedCount = 0;
  const createdDeals: SmartDeal[] = [];
  const updatedDeals: SmartDeal[] = [];
  const now = Date.now();

  for (const deal of crawledDeals) {
    if (deal.endDate) {
      const fullEndStr = deal.endDate.includes('T') ? deal.endDate : `${deal.endDate}T23:59:59`;
      const endTime = new Date(fullEndStr).getTime();
      if (!isNaN(endTime) && endTime < now) {
        continue;
      }
    }

    let existing = null;
    if (deal.sourceUrl) {
      existing = await prisma.deal.findFirst({
        where: { sourceUrl: deal.sourceUrl },
      });
    }
    if (!existing) {
      existing = await prisma.deal.findFirst({
        where: {
          merchantName: deal.merchant.name,
          title: deal.title,
        },
      });
    }

    const dealData = {
      title: deal.title,
      subtitle: deal.subtitle || null,
      category: deal.category,
      channelType: deal.channelType,
      merchantName: deal.merchant.name,
      merchantLogo: deal.merchant.logo || null,
      storeBranches: deal.merchant.storeBranches || null,
      regions: deal.regions || [],
      originalPrice: deal.originalPrice || null,
      discountPrice: deal.discountPrice || null,
      priceUnit: deal.priceUnit || '元',
      targetItems: deal.targetItems || [],
      conditions: deal.conditions || [],
      eligibleCards: deal.eligibleCards || [],
      tags: deal.tags || [],
      startDate: deal.startDate,
      endDate: deal.endDate,
      isHot: Boolean(deal.isHot),
      isFlashDeal: Boolean(deal.isFlashDeal),
      source: deal.source || 'official',
      sourcePlatform: deal.sourcePlatform || null,
      sourceUrl: deal.sourceUrl || null,
      likeCount: deal.likeCount || 0,
      commentCount: deal.commentCount || 0,
      priceHistory: deal.priceHistory ? (deal.priceHistory as any) : undefined,
      priceDropAlert: deal.priceDropAlert ? (deal.priceDropAlert as any) : undefined,
      imageUrl: deal.imageUrl || null,
      images: deal.images || (deal.imageUrl ? [deal.imageUrl] : []),
      aspectRatio: deal.aspectRatio || null,
    };

    if (existing) {
      const updated = await prisma.deal.update({
        where: { id: existing.id },
        data: dealData,
      });
      const mapped = mapDbDealToSmartDeal(updated);
      updatedDeals.push(mapped);
      updatedCount++;
    } else {
      const created = await prisma.deal.create({
        data: {
          id: deal.id || `deal-crawled-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ...dealData,
        },
      });
      const mapped = mapDbDealToSmartDeal(created);
      createdDeals.push(mapped);
      insertedCount++;
    }
  }

  const totalCount = await prisma.deal.count();
  invalidateDealsCache();

  return {
    insertedCount,
    updatedCount,
    totalCount,
    purgedCount,
    createdDeals,
    updatedDeals,
  };
}

/**
 * 更新單筆特價卡片
 */
export async function updateDeal(id: string, updates: Partial<SmartDeal>): Promise<SmartDeal | null> {
  const data: any = {};
  if (updates.title !== undefined) data.title = updates.title;
  if (updates.subtitle !== undefined) data.subtitle = updates.subtitle;
  if (updates.category !== undefined) data.category = updates.category;
  if (updates.channelType !== undefined) data.channelType = updates.channelType;
  if (updates.merchant?.name !== undefined) data.merchantName = updates.merchant.name;
  if (updates.merchant?.logo !== undefined) data.merchantLogo = updates.merchant.logo;
  if (updates.merchant?.storeBranches !== undefined) data.storeBranches = updates.merchant.storeBranches;
  if (updates.regions !== undefined) data.regions = updates.regions;
  if (updates.originalPrice !== undefined) data.originalPrice = updates.originalPrice;
  if (updates.discountPrice !== undefined) data.discountPrice = updates.discountPrice;
  if (updates.priceUnit !== undefined) data.priceUnit = updates.priceUnit;
  if (updates.targetItems !== undefined) data.targetItems = updates.targetItems;
  if (updates.conditions !== undefined) data.conditions = updates.conditions;
  if (updates.eligibleCards !== undefined) data.eligibleCards = updates.eligibleCards;
  if (updates.tags !== undefined) data.tags = updates.tags;
  if (updates.startDate !== undefined) data.startDate = updates.startDate;
  if (updates.endDate !== undefined) data.endDate = updates.endDate;
  if (updates.isHot !== undefined) data.isHot = updates.isHot;
  if (updates.isFlashDeal !== undefined) data.isFlashDeal = updates.isFlashDeal;
  if (updates.source !== undefined) data.source = updates.source;
  if (updates.sourcePlatform !== undefined) data.sourcePlatform = updates.sourcePlatform;
  if (updates.sourceUrl !== undefined) data.sourceUrl = updates.sourceUrl;
  if (updates.likeCount !== undefined) data.likeCount = updates.likeCount;
  if (updates.commentCount !== undefined) data.commentCount = updates.commentCount;
  if (updates.priceHistory !== undefined) data.priceHistory = updates.priceHistory as any;
  if (updates.priceDropAlert !== undefined) data.priceDropAlert = updates.priceDropAlert as any;
  if (updates.imageUrl !== undefined) data.imageUrl = updates.imageUrl;
  if (updates.images !== undefined) data.images = updates.images;
  if (updates.aspectRatio !== undefined) data.aspectRatio = updates.aspectRatio;

  try {
    const updated = await prisma.deal.update({
      where: { id },
      data,
    });
    invalidateDealsCache();
    return mapDbDealToSmartDeal(updated);
  } catch (err) {
    console.error(`[Deals-DAL] Update deal ${id} failed:`, err);
    return null;
  }
}

/**
 * 刪除特價卡片
 */
export async function deleteDeal(id: string): Promise<boolean> {
  try {
    await prisma.deal.delete({ where: { id } });
    invalidateDealsCache();
    return true;
  } catch (err) {
    console.error(`[Deals-DAL] Delete deal ${id} failed:`, err);
    return false;
  }
}

/**
 * 切換熱門狀態 (isHot)
 */
export async function toggleDealHot(id: string): Promise<SmartDeal | null> {
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) return null;
  const updated = await prisma.deal.update({
    where: { id },
    data: { isHot: !deal.isHot },
  });
  invalidateDealsCache();
  return mapDbDealToSmartDeal(updated);
}

/**
 * 切換破盤快閃狀態 (isFlashDeal)
 */
export async function toggleDealFlash(id: string): Promise<SmartDeal | null> {
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) return null;
  const updated = await prisma.deal.update({
    where: { id },
    data: { isFlashDeal: !deal.isFlashDeal },
  });
  invalidateDealsCache();
  return mapDbDealToSmartDeal(updated);
}

/**
 * 依據品牌名稱查詢該品牌專屬情報
 */
export async function getDealsByMerchant(merchantName: string): Promise<SmartDeal[]> {
  await ensureDealsSeeded();
  const cleanName = merchantName.toLowerCase().trim();
  const records = await prisma.deal.findMany({
    where: {
      merchantName: {
        contains: cleanName,
        mode: 'insensitive',
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return records.map(mapDbDealToSmartDeal);
}

/**
 * 批次新增特惠卡片 (DM 快速製卡批量寫入遠端資料庫)
 */
export async function batchCreateSmartDeals(deals: SmartDeal[]): Promise<SmartDeal[]> {
  const data = deals.map((deal) => ({
    id: deal.id || `deal-batch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: deal.title,
    subtitle: deal.subtitle || null,
    category: deal.category,
    channelType: deal.channelType,
    merchantName: deal.merchant.name,
    merchantLogo: deal.merchant.logo || null,
    storeBranches: deal.merchant.storeBranches || null,
    regions: deal.regions || [],
    originalPrice: deal.originalPrice || null,
    discountPrice: deal.discountPrice || null,
    priceUnit: deal.priceUnit || '元',
    targetItems: deal.targetItems || [],
    conditions: deal.conditions || [],
    eligibleCards: deal.eligibleCards || [],
    tags: deal.tags || [],
    startDate: deal.startDate,
    endDate: deal.endDate,
    isHot: Boolean(deal.isHot),
    isFlashDeal: Boolean(deal.isFlashDeal),
    source: deal.source || 'official',
    sourcePlatform: deal.sourcePlatform || null,
    sourceUrl: deal.sourceUrl || null,
    likeCount: deal.likeCount || 0,
    commentCount: deal.commentCount || 0,
    priceHistory: deal.priceHistory ? (deal.priceHistory as any) : undefined,
    priceDropAlert: deal.priceDropAlert ? (deal.priceDropAlert as any) : undefined,
    imageUrl: deal.imageUrl || null,
    images: deal.images || (deal.imageUrl ? [deal.imageUrl] : []),
    aspectRatio: deal.aspectRatio || null,
  }));

  await prisma.deal.createMany({
    data,
    skipDuplicates: true,
  });

  invalidateDealsCache();
  return deals;
}

export interface BatchUpdateDealsOptions {
  category?: string;
  channelType?: 'offline' | 'online';
  tagsToAdd?: string[];
  tagsToRemove?: string[];
  priceAdjustment?: {
    type: 'set' | 'discount_percent' | 'discount_amount';
    value: number;
  };
  addConditions?: string[];
  replaceConditions?: string[];
  isHot?: boolean;
  isFlashDeal?: boolean;
}

/**
 * 批量更新特價卡片 (遠端資料庫即時更新)
 */
export async function batchUpdateDeals(
  ids: string[],
  options: BatchUpdateDealsOptions
): Promise<{ updatedCount: number; updatedDeals: SmartDeal[] }> {
  const records = await prisma.deal.findMany({
    where: { id: { in: ids } },
  });

  const updatedDeals: SmartDeal[] = [];

  for (const record of records) {
    const deal = mapDbDealToSmartDeal(record);
    let updatedDeal = { ...deal };

    // 1. 分類修改
    if (options.category && options.category !== 'keep') {
      updatedDeal.category = options.category as any;
    }

    // 2. 通路模式修改
    if (options.channelType) {
      updatedDeal.channelType = options.channelType;
    }

    // 3. 標籤管理 (追加 / 移除)
    if (options.tagsToAdd && options.tagsToAdd.length > 0) {
      const currentTags = [...(updatedDeal.tags || [])];
      for (const t of options.tagsToAdd) {
        const cleanT = t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`;
        if (cleanT.length > 1 && !currentTags.some((existing) => existing.toLowerCase() === cleanT.toLowerCase())) {
          if (currentTags.length < 8) {
            currentTags.push(cleanT);
          }
        }
      }
      updatedDeal.tags = currentTags;
    }

    if (options.tagsToRemove && options.tagsToRemove.length > 0) {
      const removeSet = new Set(options.tagsToRemove.map((t) => t.toLowerCase().trim()));
      updatedDeal.tags = (updatedDeal.tags || []).filter(
        (t) => !removeSet.has(t.toLowerCase().trim()) && !removeSet.has(t.replace(/^#/, '').toLowerCase().trim())
      );
    }

    // 4. 價格調整
    if (options.priceAdjustment && options.priceAdjustment.value > 0) {
      const { type, value } = options.priceAdjustment;
      if (type === 'set') {
        updatedDeal.discountPrice = Math.max(1, Math.round(value));
      } else if (type === 'discount_percent') {
        const currentPrice = updatedDeal.discountPrice || updatedDeal.originalPrice || 100;
        updatedDeal.discountPrice = Math.max(1, Math.round((currentPrice * value) / 100));
      } else if (type === 'discount_amount') {
        const currentPrice = updatedDeal.discountPrice || updatedDeal.originalPrice || 100;
        updatedDeal.discountPrice = Math.max(1, currentPrice - value);
      }
    }

    // 5. 促銷條件調整
    if (options.replaceConditions && options.replaceConditions.length > 0) {
      updatedDeal.conditions = options.replaceConditions;
    } else if (options.addConditions && options.addConditions.length > 0) {
      const existingConditions = new Set(updatedDeal.conditions);
      options.addConditions.forEach((c) => {
        if (c.trim()) existingConditions.add(c.trim());
      });
      updatedDeal.conditions = Array.from(existingConditions);
    }

    // 6. 狀態標記
    if (options.isHot !== undefined) {
      updatedDeal.isHot = options.isHot;
    }
    if (options.isFlashDeal !== undefined) {
      updatedDeal.isFlashDeal = options.isFlashDeal;
    }

    await prisma.deal.update({
      where: { id: record.id },
      data: {
        category: updatedDeal.category,
        channelType: updatedDeal.channelType,
        tags: updatedDeal.tags,
        discountPrice: updatedDeal.discountPrice ?? null,
        conditions: updatedDeal.conditions,
        isHot: updatedDeal.isHot,
        isFlashDeal: updatedDeal.isFlashDeal,
      },
    });

    updatedDeals.push(updatedDeal);
  }

  invalidateDealsCache();

  return {
    updatedCount: updatedDeals.length,
    updatedDeals,
  };
}

/**
 * 批量刪除特價卡片
 */
export async function batchDeleteDeals(ids: string[]): Promise<{ deletedCount: number }> {
  const res = await prisma.deal.deleteMany({
    where: { id: { in: ids } },
  });
  invalidateDealsCache();
  return { deletedCount: res.count };
}

/**
 * 批量設定熱門標記
 */
export async function batchToggleHotDeals(
  ids: string[],
  isHot: boolean
): Promise<{ updatedCount: number; updatedDeals: SmartDeal[] }> {
  return await batchUpdateDeals(ids, { isHot });
}

/**
 * 批量設定破盤快閃標記
 */
export async function batchToggleFlashDeals(
  ids: string[],
  isFlashDeal: boolean
): Promise<{ updatedCount: number; updatedDeals: SmartDeal[] }> {
  return await batchUpdateDeals(ids, { isFlashDeal });
}



