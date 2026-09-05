import { SmartDeal, DealFilterState } from '@/features/deals/types/deal.types';
import { parseDealEndTimestamp, parseDealStartTimestamp, isDealExpired } from './date-utils';

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
          const syns = [term];
          if (term === '買一送一') syns.push('買1送1');
          if (term === '買1送1') syns.push('買一送一');

          return syns.some((syn) => (
            deal.title.toLowerCase().includes(syn) ||
            (deal.subtitle && deal.subtitle.toLowerCase().includes(syn)) ||
            deal.merchant.name.toLowerCase().includes(syn) ||
            (deal.merchant.storeBranches && deal.merchant.storeBranches.toLowerCase().includes(syn)) ||
            deal.targetItems.some((item) => item.toLowerCase().includes(syn)) ||
            deal.conditions.some((c) => c.toLowerCase().includes(syn)) ||
            deal.tags.some((t) => t.toLowerCase().replace(/^#/, '').includes(syn)) ||
            deal.eligibleCards.some((card) => card.toLowerCase().includes(syn)) ||
            (deal.category && deal.category.toLowerCase().includes(syn)) ||
            deal.regions.some((r) => r.toLowerCase().includes(syn))
          ));
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
      const synonyms = [cleanTarget];
      if (cleanTarget === '買一送一') synonyms.push('買1送1');
      if (cleanTarget === '買1送1') synonyms.push('買一送一');

      results = results.filter((deal) => 
        deal.tags.some((t) => {
          const ct = t.toLowerCase().replace(/^#/, '');
          return synonyms.includes(ct);
        }) ||
        synonyms.some((syn) => deal.title.toLowerCase().includes(syn))
      );
    }
  }

  // 7. 排序與截止狀態處理 (包含確定性 Tie-breaker)
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

          const timeDiff = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          if (timeDiff !== 0) return timeDiff;
          return b.id.localeCompare(a.id);
        });
        break;
      }
      case 'expiring': {
        const now = Date.now();

        results = results.filter((deal) => {
          const end = parseDealEndTimestamp(deal.endDate);
          if (end === null || end < now) return false;

          const start = parseDealStartTimestamp(deal.startDate);
          if (start !== null && start > now) return false;

          return true;
        });

        results.sort((a, b) => {
          const endA = parseDealEndTimestamp(a.endDate) ?? Infinity;
          const endB = parseDealEndTimestamp(b.endDate) ?? Infinity;
          if (endA !== endB) {
            return endA - endB;
          }
          const timeDiff = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          if (timeDiff !== 0) return timeDiff;
          return b.id.localeCompare(a.id);
        });
        break;
      }
      case 'popular':
        results.sort((a, b) => {
          if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount;
          const timeDiff = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          if (timeDiff !== 0) return timeDiff;
          return b.id.localeCompare(a.id);
        });
        break;
      case 'latest':
      default:
        results.sort((a, b) => {
          const timeDiff = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          if (timeDiff !== 0) return timeDiff;
          return b.id.localeCompare(a.id);
        });
        break;
    }
  }

  return results;
}
