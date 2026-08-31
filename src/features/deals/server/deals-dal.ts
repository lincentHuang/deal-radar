import 'server-only';
import { SmartDeal, DealFilterState } from '@/features/deals/types/deal.types';
import { INITIAL_SMART_DEALS } from '@/features/deals/server/deals-mock-data';
import { MerchantCreateDealInput } from '@/features/deals/schemas/deal.schema';

// 記憶體中的全域資料庫快取 (支援即時新增與查詢)
let inMemoryDeals: SmartDeal[] = [...INITIAL_SMART_DEALS];

export async function getDeals(filters?: Partial<DealFilterState>): Promise<SmartDeal[]> {
  // 自動清理過期活動
  purgeExpiredDeals();

  // 模擬微延遲
  await new Promise((resolve) => setTimeout(resolve, 30));

  let results = [...inMemoryDeals];

  if (!filters) return results;

  // 1. 搜尋關鍵字過濾 (標題、店家、品項、條件、標籤)
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase().trim();
    results = results.filter((deal) => {
      return (
        deal.title.toLowerCase().includes(q) ||
        deal.merchant.name.toLowerCase().includes(q) ||
        deal.targetItems.some((item) => item.toLowerCase().includes(q)) ||
        deal.conditions.some((c) => c.toLowerCase().includes(q)) ||
        deal.tags.some((t) => t.toLowerCase().includes(q)) ||
        deal.eligibleCards.some((card) => card.toLowerCase().includes(q))
      );
    });
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
        // 最大降價 / 最大降幅：打折比例（折扣率）最高的排在最前面（變得越便宜在越前面）
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

          // 1. 打折比例最高的優先（例如 5 折 / 0.5 > 7 折 / 0.3 > 0）
          if (Math.abs(rateB - rateA) > 0.0001) {
            return rateB - rateA;
          }

          // 2. 折扣比例相同時，現省金額較大者優先
          const savedA = (a.originalPrice && a.discountPrice && a.originalPrice > a.discountPrice)
            ? a.originalPrice - a.discountPrice
            : 0;
          const savedB = (b.originalPrice && b.discountPrice && b.originalPrice > b.discountPrice)
            ? b.originalPrice - b.discountPrice
            : 0;
          if (savedB !== savedA) {
            return savedB - savedA;
          }

          // 3. 次要排序：最新開始優先
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        break;
      }
      case 'expiring': {
        // 即將截止：排除無有效日期、已截止（過期）以及「即將開跑 (尚未開始)」的項目，僅保留快要到期的特惠
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

        // 過濾出符合「進行中且尚未過期」的情報
        results = results.filter((deal) => {
          const end = parseEndTime(deal.endDate);
          if (end === null || end < now) return false; // 無有效截止日期或已截止

          const start = parseStartTime(deal.startDate);
          if (start !== null && start > now) return false; // 即將開跑（尚未開始）

          return true;
        });

        // 依剩餘時間升冪排序（越快到期排越前）
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

export async function getDealById(id: string): Promise<SmartDeal | null> {
  const found = inMemoryDeals.find((d) => d.id === id);
  return found || null;
}

export async function createDeal(input: MerchantCreateDealInput): Promise<SmartDeal> {
  const newDeal: SmartDeal = {
    id: `deal-merchant-${Date.now()}`,
    title: input.title,
    category: input.category,
    channelType: input.channelType,
    merchant: {
      name: input.merchantName,
      storeBranches: input.district ? `${input.city} ${input.district} 門市` : `${input.city} 指定門市`,
    },
    regions: [input.city, input.district ? `${input.city} / ${input.district}` : input.city],
    originalPrice: input.originalPrice,
    discountPrice: input.discountPrice,
    priceUnit: '份',
    targetItems: input.targetItems.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
    conditions: input.conditions.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean),
    eligibleCards: input.eligibleCards ? input.eligibleCards.split(/[,，、]/).map((s) => s.trim()).filter(Boolean) : [],
    tags: input.tags 
      ? input.tags.split(/[,，、\s]/).map((t) => t.startsWith('#') ? t : `#${t}`).filter((t) => t !== '#')
      : [`#${input.merchantName}`, `#特價`],
    startDate: new Date(input.startDate).toISOString(),
    endDate: new Date(input.endDate).toISOString(),
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
    aspectRatio: input.aspectRatio || undefined,
  };

  inMemoryDeals = [newDeal, ...inMemoryDeals];
  return newDeal;
}

export async function redeemVoucher(voucherCode: string, dealId: string): Promise<{
  success: boolean;
  message: string;
  dealTitle?: string;
  redeemedAt: string;
}> {
  const deal = inMemoryDeals.find((d) => d.id === dealId);
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
 * 自動清理所有已過期特惠活動 (endDate < 今日)
 */
export function purgeExpiredDeals(): number {
  const now = Date.now();
  const initialLength = inMemoryDeals.length;

  inMemoryDeals = inMemoryDeals.filter((deal) => {
    if (!deal.endDate) return true; // 若無明確結束日期視為長期常態保留
    const fullEndStr = deal.endDate.includes('T') ? deal.endDate : `${deal.endDate}T23:59:59`;
    const endTime = new Date(fullEndStr).getTime();
    if (isNaN(endTime)) return true;
    return endTime >= now; // 僅保留尚未過期的活動
  });

  const removedCount = initialLength - inMemoryDeals.length;
  if (removedCount > 0) {
    console.log(`[Deals-DAL] 🧹 Auto-purged ${removedCount} expired deals. Current active deals: ${inMemoryDeals.length}`);
  }
  return removedCount;
}

/**
 * 批次寫入或更新爬蟲爬取的特價情報 (去重並前置新增，同時自動清除過期活動)
 */
export async function upsertCrawledDeals(crawledDeals: SmartDeal[]): Promise<{ insertedCount: number; totalCount: number; purgedCount: number }> {
  // 1. 先執行過期自動清理
  const purgedCount = purgeExpiredDeals();

  let insertedCount = 0;
  const now = Date.now();

  for (const deal of crawledDeals) {
    // 若抓到的本身已過期則略過
    if (deal.endDate) {
      const fullEndStr = deal.endDate.includes('T') ? deal.endDate : `${deal.endDate}T23:59:59`;
      const endTime = new Date(fullEndStr).getTime();
      if (!isNaN(endTime) && endTime < now) {
        continue;
      }
    }

    // 依據 sourceUrl 或 相似標題去重
    const existsIndex = inMemoryDeals.findIndex(
      (d) => (deal.sourceUrl && d.sourceUrl === deal.sourceUrl) || (d.merchant.name === deal.merchant.name && d.title === deal.title)
    );

    if (existsIndex >= 0) {
      // 更新現有資料
      inMemoryDeals[existsIndex] = {
        ...inMemoryDeals[existsIndex],
        ...deal,
        id: inMemoryDeals[existsIndex].id, // 保持既有 ID
      };
    } else {
      // 新增至清單頂部
      inMemoryDeals = [deal, ...inMemoryDeals];
      insertedCount++;
    }
  }

  return {
    insertedCount,
    totalCount: inMemoryDeals.length,
    purgedCount,
  };
}

/**
 * 更新特價卡片
 */
export async function updateDeal(id: string, updates: Partial<SmartDeal>): Promise<SmartDeal | null> {
  const index = inMemoryDeals.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const current = inMemoryDeals[index];
  const updated: SmartDeal = {
    ...current,
    ...updates,
    id: current.id, // 保留原 ID
    merchant: {
      ...current.merchant,
      ...(updates.merchant || {}),
    },
  };

  inMemoryDeals[index] = updated;
  return updated;
}

/**
 * 刪除特價卡片
 */
export async function deleteDeal(id: string): Promise<boolean> {
  const initialLength = inMemoryDeals.length;
  inMemoryDeals = inMemoryDeals.filter((d) => d.id !== id);
  return inMemoryDeals.length < initialLength;
}

/**
 * 切換熱門狀態 (isHot)
 */
export async function toggleDealHot(id: string): Promise<SmartDeal | null> {
  const deal = inMemoryDeals.find((d) => d.id === id);
  if (!deal) return null;
  deal.isHot = !deal.isHot;
  return deal;
}

/**
 * 切換破盤快閃狀態 (isFlashDeal)
 */
export async function toggleDealFlash(id: string): Promise<SmartDeal | null> {
  const deal = inMemoryDeals.find((d) => d.id === id);
  if (!deal) return null;
  deal.isFlashDeal = !deal.isFlashDeal;
  return deal;
}

/**
 * 依據品牌名稱查詢該品牌專屬情報
 */
export async function getDealsByMerchant(merchantName: string): Promise<SmartDeal[]> {
  purgeExpiredDeals();
  const cleanName = merchantName.toLowerCase().trim();
  return inMemoryDeals.filter((deal) => 
    deal.merchant.name.toLowerCase().includes(cleanName) ||
    cleanName.includes(deal.merchant.name.toLowerCase())
  );
}

/**
 * 批次新增特惠卡片 (DM 快速製卡批量寫入)
 */
export async function batchCreateSmartDeals(deals: SmartDeal[]): Promise<SmartDeal[]> {
  inMemoryDeals = [...deals, ...inMemoryDeals];
  return deals;
}


