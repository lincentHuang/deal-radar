import 'server-only';
import { SmartDeal, DealFilterState } from '@/features/deals/types/deal.types';
import { INITIAL_SMART_DEALS } from '@/features/deals/server/deals-mock-data';
import { MerchantCreateDealInput } from '@/features/deals/schemas/deal.schema';
import { prisma } from '@/shared/lib/prisma';

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

export function filterDealsLocally(deals: SmartDeal[], filters?: Partial<DealFilterState>): SmartDeal[] {
  let results = [...deals];

  if (!filters) return results;

  // 1. 多標籤 / 多關鍵字搜尋過濾 (支援空格、逗號區隔，支援標題、店家、品項、條件、標籤、卡片、地區、分類)
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const terms = filters.searchQuery
      .split(/[\s,，、]+/)
      .map((t) => t.trim().replace(/^#/, '').toLowerCase())
      .filter(Boolean);

    if (terms.length > 0) {
      results = results.filter((deal) => {
        // 多關鍵字採用 AND 邏輯：情報需滿足所有搜尋詞
        return terms.every((term) => {
          return (
            deal.title.toLowerCase().includes(term) ||
            (deal.subtitle && deal.subtitle.toLowerCase().includes(term)) ||
            deal.merchant.name.toLowerCase().includes(term) ||
            (deal.merchant.storeBranches && deal.merchant.storeBranches.toLowerCase().includes(term)) ||
            deal.targetItems.some((item) => item.toLowerCase().includes(term)) ||
            deal.conditions.some((c) => c.toLowerCase().includes(term)) ||
            deal.tags.some((t) => t.toLowerCase().replace(/^#/, '').includes(term)) ||
            deal.eligibleCards.some((card) => card.toLowerCase().includes(term)) ||
            (deal.category && deal.category.toLowerCase().includes(term)) ||
            deal.regions.some((r) => r.toLowerCase().includes(term))
          );
        });
      });
    }
  }

  // 2. 通路類型過濾 (線上 / 實體)
  if (filters.channelType && filters.channelType !== 'all') {
    results = results.filter((deal) => deal.channelType === filters.channelType);
  }

  // 3. 分類過濾
  if (filters.category && filters.category !== 'all') {
    results = results.filter((deal) => deal.category === filters.category);
  }

  // 4. 區域過濾 (支援多選標籤商圈與單一地區相容)
  if (filters.selectedRegions && filters.selectedRegions.length > 0) {
    results = results.filter((deal) => {
      return filters.selectedRegions!.some((reg) => {
        if (reg.city === '全部地區') return true;
        if (reg.city === '全台線上') {
          return deal.channelType === 'online' || deal.regions.some((r) => r.includes('線上') || r.includes('全台'));
        }
        const matchesCity = deal.regions.some((r) => r.includes('全台') || r.includes(reg.city));
        if (!reg.district) return matchesCity;
        return deal.regions.some((r) => r.includes('全台') || r.includes(reg.district!));
      });
    });
  } else if (filters.selectedCity && filters.selectedCity !== '全部地區') {
    if (filters.selectedCity === '全台線上') {
      results = results.filter((deal) => 
        deal.channelType === 'online' || deal.regions.some((r) => r.includes('線上') || r.includes('全台'))
      );
    } else {
      results = results.filter((deal) => {
        const matchesCity = deal.regions.some((r) => 
          r.includes('全台') || r.includes(filters.selectedCity!)
        );
        if (!filters.selectedDistrict) return matchesCity;
        return deal.regions.some((r) => 
          r.includes('全台') || r.includes(filters.selectedDistrict!)
        );
      });
    }
  }

  // 5. 信用卡過濾
  if (filters.selectedCard) {
    results = results.filter((deal) => 
      deal.eligibleCards.some((card) => card.includes(filters.selectedCard!)) ||
      deal.tags.some((tag) => tag.includes(filters.selectedCard!.replace(' 卡', '')))
    );
  }

  // 6. 標籤精確/模糊過濾（支援個別標籤與我的標籤 __MY_TAGS__）
  if (filters.selectedTag) {
    if (filters.selectedTag === '__MY_TAGS__') {
      const userTags = filters.subscribedTags || [];
      if (userTags.length === 0) {
        results = [];
      } else {
        const cleanUserTags = userTags.map((t) => t.toLowerCase().replace(/^#/, '').trim());
        results = results.filter((deal) => {
          return deal.tags.some((t) => cleanUserTags.includes(t.toLowerCase().replace(/^#/, ''))) ||
                 cleanUserTags.some((ut) => deal.title.toLowerCase().includes(ut));
        });
      }
    } else {
      const targetTag = filters.selectedTag.startsWith('#') 
        ? filters.selectedTag 
        : `#${filters.selectedTag}`;
      const cleanTarget = targetTag.replace(/^#/, '').toLowerCase();
      results = results.filter((deal) => 
        deal.tags.some((t) => t.toLowerCase() === targetTag.toLowerCase()) ||
        deal.title.toLowerCase().includes(cleanTarget)
      );
    }
  }

  // 7. 排序與截止狀態處理
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'discount': {
        const getDiscountRate = (deal: SmartDeal): number => {
          if (
            deal.originalPrice &&
            deal.discountPrice &&
            deal.originalPrice > 0 &&
            deal.originalPrice > deal.discountPrice
          ) {
            return (deal.originalPrice - deal.discountPrice) / deal.originalPrice;
          }
          return 0;
        };

        results.sort((a, b) => {
          const rateA = getDiscountRate(a);
          const rateB = getDiscountRate(b);

          if (Math.abs(rateB - rateA) > 0.0001) {
            return rateB - rateA;
          }

          const savedA = (a.originalPrice && a.discountPrice && a.originalPrice > a.discountPrice)
            ? a.originalPrice - a.discountPrice
            : 0;
          const savedB = (b.originalPrice && b.discountPrice && b.originalPrice > b.discountPrice)
            ? b.originalPrice - b.discountPrice
            : 0;
          if (savedB !== savedA) {
            return savedB - savedA;
          }

          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        break;
      }
      case 'expiring': {
        const now = Date.now();

        const parseEndTime = (dateStr?: string): number | null => {
          if (!dateStr) return null;
          const fullStr = dateStr.includes('T') ? dateStr : `${dateStr}T23:59:59`;
          const t = new Date(fullStr).getTime();
          return isNaN(t) ? null : t;
        };

        const parseStartTime = (dateStr?: string): number | null => {
          if (!dateStr) return null;
          const fullStr = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
          const t = new Date(fullStr).getTime();
          return isNaN(t) ? null : t;
        };

        results = results.filter((deal) => {
          const end = parseEndTime(deal.endDate);
          if (end === null || end < now) return false;

          const start = parseStartTime(deal.startDate);
          if (start !== null && start > now) return false;

          return true;
        });

        results.sort((a, b) => {
          const endA = parseEndTime(a.endDate) ?? Infinity;
          const endB = parseEndTime(b.endDate) ?? Infinity;
          if (endA !== endB) {
            return endA - endB;
          }
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        break;
      }
      case 'popular':
        results.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'latest':
      default:
        results.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
    }
  }

  return results;
}

/**
 * 依據篩選條件自遠端資料庫查詢特價情報
 */
export async function getDeals(filters?: Partial<DealFilterState>): Promise<SmartDeal[]> {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('[Deals-DAL] ⚠️ DATABASE_URL is not set. Using INITIAL_SMART_DEALS fallback.');
      return filterDealsLocally(INITIAL_SMART_DEALS, filters);
    }

    await ensureDealsSeeded();
    await purgeExpiredDeals();

    const records = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const results = records.map(mapDbDealToSmartDeal);
    return filterDealsLocally(results, filters);
  } catch (err) {
    console.error('[Deals-DAL] ⚠️ Database query failed, falling back to INITIAL_SMART_DEALS:', err);
    return filterDealsLocally(INITIAL_SMART_DEALS, filters);
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



