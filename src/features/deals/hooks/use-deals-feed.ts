'use client';

import { useMemo, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { SmartDeal, DealFilterState } from '@/features/deals/types/deal.types';
import { fetchPaginatedDealsAction } from '@/features/deals/server/deal.actions';
import { PaginatedDealsResult } from '@/features/deals/server/deals-dal';

interface UseDealsFeedOptions {
  filters: DealFilterState;
  subscribedTags: string[];
  initialDeals: SmartDeal[];
  initialHasMore?: boolean;
  initialTotal?: number;
}

export function useDealsFeed({
  filters,
  subscribedTags,
  initialDeals,
  initialHasMore = true,
  initialTotal,
}: UseDealsFeedOptions) {
  // 判定是否為預設首頁篩選條件
  const isDefaultFilter = useMemo(() => {
    return (
      !filters.searchQuery &&
      filters.selectedCity === '全部地區' &&
      !filters.selectedDistrict &&
      (!filters.selectedRegions || filters.selectedRegions.length === 0) &&
      filters.channelType === 'all' &&
      filters.category === 'all' &&
      !filters.selectedCard &&
      !filters.selectedTag &&
      filters.sortBy === 'latest'
    );
  }, [filters]);

  // SWR Infinite 核心 Key 產生器（嚴格依據篩選條件與標籤生成唯一 Key）
  const getKey = useCallback(
    (pageIndex: number, previousPageData: PaginatedDealsResult | null) => {
      // 若已無更多資料則停止後續請求
      if (previousPageData && !previousPageData.hasMore) {
        return null;
      }

      // 序列化過濾條件
      const filterKey = JSON.stringify({
        searchQuery: filters.searchQuery || '',
        selectedCity: filters.selectedCity || '全部地區',
        selectedDistrict: filters.selectedDistrict || null,
        selectedRegions: filters.selectedRegions || [],
        channelType: filters.channelType || 'all',
        category: filters.category || 'all',
        selectedCard: filters.selectedCard || null,
        selectedTag: filters.selectedTag || null,
        sortBy: filters.sortBy || 'latest',
      });

      const tagsKey = JSON.stringify(subscribedTags || []);

      return ['deals', filterKey, tagsKey, pageIndex] as const;
    },
    [filters, subscribedTags]
  );

  // SWR Fetcher
  const fetcher = useCallback(
    async (key: readonly ['deals', string, string, number]): Promise<PaginatedDealsResult> => {
      const [, filterKeyStr, tagsKeyStr, pageIndex] = key;
      const parsedFilters = JSON.parse(filterKeyStr);
      const parsedTags = JSON.parse(tagsKeyStr);

      const page = pageIndex + 1;
      const pageSize = 12;

      return await fetchPaginatedDealsAction(
        {
          ...parsedFilters,
          subscribedTags: parsedTags,
        },
        page,
        pageSize
      );
    },
    []
  );

  // SSR 初次渲染 Fallback Data
  const fallbackData = useMemo(() => {
    if (isDefaultFilter && initialDeals && initialDeals.length > 0) {
      return [
        {
          deals: initialDeals,
          total: initialTotal ?? initialDeals.length,
          page: 1,
          pageSize: 12,
          hasMore: initialHasMore,
        },
      ];
    }
    return undefined;
  }, [isDefaultFilter, initialDeals, initialTotal, initialHasMore]);

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<PaginatedDealsResult>(getKey, fetcher, {
    fallbackData,
    revalidateFirstPage: false,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    keepPreviousData: false, // 關鍵：切換不同標籤時不保留上一標籤的殘留資料，防止誤顯
    dedupingInterval: 4000,
  });

  // 平鋪各頁卡片資料，並使用 Set 確保 deal.id 絕對不重複
  const deals = useMemo(() => {
    if (!data) return [];
    const all: SmartDeal[] = [];
    const seenIds = new Set<string>();

    for (const page of data) {
      if (page?.deals) {
        for (const deal of page.deals) {
          if (!seenIds.has(deal.id)) {
            seenIds.add(deal.id);
            all.push(deal);
          }
        }
      }
    }
    return all;
  }, [data]);

  // 狀態判斷：
  // 1. isFirstLoading: 此標籤尚未讀取過，且 SWR 正在載入第一頁（需顯示骨架屏）
  const isFirstLoading = isLoading || (!data && !error);

  // 2. isLoadingMore: 瀑布流向下拉取更多下一頁中
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  // 3. hasMore: 是否還有下一頁
  const hasMore = data ? Boolean(data[data.length - 1]?.hasMore) : (isDefaultFilter ? initialHasMore : false);

  // 4. totalCount: 當前條件總筆數
  const totalCount = data?.[0]?.total ?? (isDefaultFilter ? (initialTotal ?? initialDeals.length) : deals.length);

  // 5. isEmpty: 確實讀取完畢但為空
  const isEmpty = !isFirstLoading && deals.length === 0;

  // 瀑布流滾動載入更多
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isValidating) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [isLoadingMore, hasMore, isValidating, setSize]);

  return {
    deals,
    totalCount,
    hasMore,
    isFirstLoading,
    isLoadingMore,
    isValidating,
    isEmpty,
    error,
    loadMore,
    refresh: mutate,
  };
}
