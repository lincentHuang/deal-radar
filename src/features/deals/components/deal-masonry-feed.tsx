'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import { dealFiltersAtom, subscribedTagsAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { useDealsFeed } from '@/features/deals/hooks/use-deals-feed';
import { useBackendScheduleSync } from '@/features/deals/hooks/use-backend-schedule-sync';
import { SmartDealCard } from '@/features/deals/components/smart-deal-card';
import { DealMasonrySkeleton } from '@/features/deals/components/deal-skeleton';
import { RecommendedTagsModal } from '@/features/subscriptions/components/recommended-tags-modal';
import {
  RotateCcw,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  Plus,
  Check,
  Tag,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';

interface DealMasonryFeedProps {
  initialDeals: SmartDeal[];
  initialHasMore?: boolean;
  initialTotal?: number;
}

export const DealMasonryFeed: React.FC<DealMasonryFeedProps> = ({
  initialDeals,
  initialHasMore = true,
  initialTotal,
}) => {
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [subscribedTags, setSubscribedTags] = useAtom(subscribedTagsAtom);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { triggerHaptic } = useMobileNative();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 1. SWR 核心資料流：嚴格快取、未讀取顯示骨架屏、已讀取 0ms 呈現正確標籤資料
  const {
    deals,
    totalCount,
    hasMore,
    isFirstLoading,
    isLoadingMore,
    isEmpty,
    error,
    loadMore,
    refresh,
  } = useDealsFeed({
    filters,
    subscribedTags,
    initialDeals,
    initialHasMore,
    initialTotal,
  });

  // 2. 用戶端同步後台排程時段強制自動更新 Hook
  useBackendScheduleSync();

  // 響應式固定欄數偵測 (手機 2 欄、平板 3 欄、桌機 4 欄)
  const [colCount, setColCount] = useState<number>(2);

  useEffect(() => {
    const updateColCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setColCount(4);
      } else if (width >= 768) {
        setColCount(3);
      } else {
        setColCount(2);
      }
    };

    updateColCount();
    setIsMounted(true);
    window.addEventListener('resize', updateColCount);
    return () => window.removeEventListener('resize', updateColCount);
  }, []);

  // 核心：依據欄數將卡片嚴格分配至固定欄位。
  // 當新資料動態疊加時，新卡片只會往下追加到對應欄位底部，上面已經渲染的卡片完全不會移動、換欄或產生跳動！
  const columns = useMemo(() => {
    const cols: SmartDeal[][] = Array.from({ length: colCount }, () => []);
    deals.forEach((deal, idx) => {
      cols[idx % colCount].push(deal);
    });
    return cols;
  }, [deals, colCount]);

  // IntersectionObserver 哨兵監聽（提前 380px 無感加載）
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '380px',
        threshold: 0.05,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  // 滾動距離監聽（控制回到頂部按鈕顯隱）
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    triggerHaptic('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    triggerHaptic('medium');
    setFilters({
      searchQuery: '',
      selectedCity: '全部地區',
      selectedDistrict: null,
      selectedRegions: [],
      channelType: 'all',
      category: 'all',
      selectedCard: null,
      selectedTag: null,
      sortBy: 'latest',
    });
  };

  const handleToggleCurrentTagSubscription = (tag: string) => {
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    const isSubscribed = subscribedTags.includes(cleanTag);

    if (isSubscribed) {
      triggerHaptic('light');
      setSubscribedTags((prev) => prev.filter((t) => t !== cleanTag));
    } else {
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.2 },
        });
      } catch (e) {}
      setSubscribedTags((prev) => [...prev, cleanTag]);
    }
  };

  const isCurrentTagSubscribed =
    filters.selectedTag && filters.selectedTag !== '__MY_TAGS__'
      ? subscribedTags.includes(
          filters.selectedTag.startsWith('#') ? filters.selectedTag : `#${filters.selectedTag}`
        )
      : false;

  // 解析多關鍵字 / 標籤 Token
  const searchTokens = filters.searchQuery
    ? filters.searchQuery
        .split(/[\s,，、]+/)
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean)
    : [];

  const handleRemoveSearchToken = (tokenToRemove: string) => {
    triggerHaptic('light');
    const remainingTokens = searchTokens.filter((t) => t !== tokenToRemove);
    setFilters((prev) => ({
      ...prev,
      searchQuery: remainingTokens.join(' '),
      selectedTag: null,
    }));
  };

  // 建立當前有效 Tab 清單以支援手勢左右滑動切換 (All ➔ 我的標籤 ➔ 各自訂閱標籤)
  const allTabs: (string | null)[] = [null, '__MY_TAGS__', ...subscribedTags];

  const currentTabIdx =
    filters.selectedTag === null
      ? 0
      : filters.selectedTag === '__MY_TAGS__'
      ? 1
      : allTabs.indexOf(
          filters.selectedTag.startsWith('#') ? filters.selectedTag : `#${filters.selectedTag}`
        );
  const safeTabIdx = currentTabIdx >= 0 ? currentTabIdx : 0;

  // 滑動與轉場狀態
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const prevTagRef = React.useRef<string | null>(filters.selectedTag);

  // 監聽標籤切換方向（點擊 SubHeader 標籤或手勢切換時觸發平滑全螢幕滑入轉場）
  useEffect(() => {
    const prevIdx =
      prevTagRef.current === null
        ? 0
        : prevTagRef.current === '__MY_TAGS__'
        ? 1
        : allTabs.indexOf(
            prevTagRef.current.startsWith('#')
              ? prevTagRef.current
              : `#${prevTagRef.current}`
          );

    const validPrevIdx = prevIdx >= 0 ? prevIdx : 0;
    if (safeTabIdx > validPrevIdx) {
      setSlideDirection('left');
    } else if (safeTabIdx < validPrevIdx) {
      setSlideDirection('right');
    }
    prevTagRef.current = filters.selectedTag;
  }, [filters.selectedTag, safeTabIdx, allTabs]);

  // 手勢左右滑動偵測 (支援手機端左滑看下一 Tab、右滑看上一 Tab，具備跟手阻尼與滿幅滑動感)
  const touchStartRef = React.useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length === 0) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartRef.current.x;
    const deltaY = currentY - touchStartRef.current.y;

    // 水平滑動角度優先判斷 (防垂直網頁捲動干擾)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
      setIsDragging(true);
      // 首尾邊界加上彈性阻尼 (Rubber-band effect)
      if ((safeTabIdx === 0 && deltaX > 0) || (safeTabIdx === allTabs.length - 1 && deltaX < 0)) {
        setDragOffset(deltaX * 0.28);
      } else {
        setDragOffset(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const deltaTime = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    if (isDragging) {
      // 判定切換門檻 (滑動位移超過 45px 或快速甩動)
      const isFastSwipe = deltaTime < 250 && Math.abs(dragOffset) > 25;
      const isOverThreshold = Math.abs(dragOffset) > 48;

      if (isOverThreshold || isFastSwipe) {
        if (dragOffset < 0) {
          // 向左滑動 ➔ 切換至下一個 Tab (畫面由右向左滑入)
          if (safeTabIdx < allTabs.length - 1) {
            triggerHaptic('light');
            setSlideDirection('left');
            setFilters((prev) => ({ ...prev, selectedTag: allTabs[safeTabIdx + 1] }));
          }
        } else {
          // 向右滑動 ➔ 切換至上一個 Tab (畫面由左向右滑入)
          if (safeTabIdx > 0) {
            triggerHaptic('light');
            setSlideDirection('right');
            setFilters((prev) => ({ ...prev, selectedTag: allTabs[safeTabIdx - 1] }));
          }
        }
      }
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 touch-pan-y overflow-hidden select-none sm:select-auto"
    >
      {/* 支援手指實時跟手滑動與 Tab 切換全螢幕流暢轉場容器 */}
      <div
        className={`w-full will-change-transform ${
          !isDragging && slideDirection === 'left'
            ? 'animate-slide-in-right'
            : !isDragging && slideDirection === 'right'
            ? 'animate-slide-in-left'
            : ''
        }`}
        style={{
          transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
          transition: isDragging
            ? 'none'
            : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease',
          opacity: isDragging ? Math.max(0.6, 1 - Math.abs(dragOffset) / 550) : 1,
        }}
      >
        {/* 1. 當前主題/標籤畫板 Header */}
        {filters.selectedTag === '__MY_TAGS__' ? (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 rounded-3xl border border-rose-100/80 shadow-xs animate-fadeIn">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  🌟 我的訂閱情報牆
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                已追蹤 {subscribedTags.length} 個標籤（{subscribedTags.join('、') || '尚未訂閱'}）· 為您聚合專屬特惠
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setIsModalOpen(true);
                }}
                className="text-xs font-bold px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-rose-600 border border-rose-200 transition-all active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>探索更多推薦標籤</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setFilters((prev) => ({ ...prev, selectedTag: null }));
                }}
                className="text-xs font-bold px-3.5 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                返回全部
              </button>
            </div>
          </div>
        ) : filters.selectedTag ? (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {filters.selectedTag.replace(/^#/, '')}
                </h2>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-full">
                  主題情報
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">
                共 {totalCount || deals.length} 則即時特惠 · 點擊卡片查看完整情報
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* 訂閱/取消訂閱此標籤按鈕 */}
              <button
                type="button"
                onClick={() => handleToggleCurrentTagSubscription(filters.selectedTag!)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isCurrentTagSubscribed
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isCurrentTagSubscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已訂閱標籤 (點擊取消)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>⭐ 訂閱此標籤 (加入上方)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setFilters((prev) => ({ ...prev, selectedTag: null }));
                }}
                className="text-xs font-bold px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                返回全部
              </button>
            </div>
          </div>
        ) : null}

        {/* 2. 搜尋時若有對應關鍵字，顯示標籤訂閱推薦橫幅與當前搜尋多關鍵字標籤 */}
        {filters.searchQuery && !filters.selectedTag && searchTokens.length > 0 ? (
          <div className="mb-5 p-3.5 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl border border-rose-200/70 flex flex-wrap items-center justify-between gap-3 animate-fadeIn shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-1.5 text-rose-600 mr-1">
                <Tag className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>正在搜尋：</span>
              </div>

              {/* 每個關鍵字 Token 獨立晶片 */}
              {searchTokens.map((token) => (
                <span
                  key={token}
                  className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-slate-900 border border-rose-200 shadow-xs font-bold"
                >
                  <span>#{token}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSearchToken(token)}
                    className="w-3.5 h-3.5 rounded-full bg-slate-200 hover:bg-rose-200 text-slate-600 hover:text-rose-700 flex items-center justify-center text-[9px] transition-colors cursor-pointer"
                    title={`移除 #${token}`}
                  >
                    ✕
                  </button>
                </span>
              ))}

              {/* 清除全部搜尋詞按鈕 */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setFilters((prev) => ({ ...prev, searchQuery: '' }));
                }}
                className="text-xs text-slate-400 hover:text-slate-700 underline font-semibold ml-1 cursor-pointer"
              >
                清除全部
              </button>
            </div>

            {/* 快速訂閱第一個未訂閱的搜尋關鍵字至上方 */}
            {(() => {
              const firstUnsubscribedToken = searchTokens.find(
                (token) => !subscribedTags.includes(`#${token}`) && !subscribedTags.includes(token)
              );
              if (!firstUnsubscribedToken) return null;

              return (
                <button
                  type="button"
                  onClick={() => handleToggleCurrentTagSubscription(firstUnsubscribedToken)}
                  className="text-xs px-3.5 py-1.5 rounded-full font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs cursor-pointer bg-rose-500 hover:bg-rose-600 text-white"
                >
                  <Plus className="w-3 h-3" />
                  <span>⭐ 訂閱「#{firstUnsubscribedToken}」至上方</span>
                </button>
              );
            })()}
          </div>
        ) : null}

        {/* 6. 核心瀑布流列表區 (UI 五態實作：Loading / Error / Empty / Success) */}
        {/* 狀態 1: ⏳ Loading 骨架屏（未掛載或 SWR 首次讀取此標籤/篩選條件時，確實讀好後再顯示真實畫面） */}
        {!isMounted || isFirstLoading ? (
          <div className="w-full animate-fadeIn">
            <DealMasonrySkeleton />
          </div>
        ) : error ? (
          /* 狀態 3: ⚠️ Error 錯誤狀態 */
          <div className="w-full bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-bubble my-8 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">資料載入失敗</h3>
            <p className="text-sm text-slate-500 mb-6">{error?.message || '無法載入特價情報，請檢查網路連線後重試'}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refresh()}
                className="inline-flex items-center gap-2 bg-rose-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 hover:bg-rose-600 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重新整理</span>
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>重置條件</span>
              </button>
            </div>
          </div>
        ) : isEmpty ? (
          /* 狀態 2: 📭 Empty 空資料狀態 */
          <div className="w-full bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-bubble my-8 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {filters.selectedTag === '__MY_TAGS__'
                ? '尚未有符合您已訂閱標籤的特價'
                : '找不到符合條件的特價情報'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {filters.selectedTag === '__MY_TAGS__'
                ? '您可以點擊下方按鈕探索更多官方熱門推薦標籤，訂閱後即可自動在此收到即時推播與情報！'
                : '目前此區域或篩選條件下暫無特惠活動。建議切換為「全部地區」或清除搜尋字詞試試看！'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {filters.selectedTag === '__MY_TAGS__' ? (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>🔥 探索推薦標籤</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>清除所有篩選條件</span>
              </button>
            </div>
          </div>
        ) : (
          /* 狀態 4: ✅ Success 響應式穩定瀑布流排版（各欄位獨立堆疊，SWR 快取即時渲染，向下加載新資料時上方已渲染之卡片絕對不跳動） */
          <>
            <div
              className="grid gap-2.5 sm:gap-2.5 w-full animate-fadeIn items-start"
              style={{
                gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
              }}
            >
              {columns.map((columnDeals, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-2.5 w-full">
                  {columnDeals.map((deal, itemIdx) => (
                    <div key={deal.id} className="w-full">
                      <SmartDealCard
                        deal={deal}
                        priority={colIdx < 2 && itemIdx < 2}
                        onTagClick={(tag) => setFilters((prev) => ({ ...prev, selectedTag: tag }))}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* 瀑布動態載入底部哨兵 (Sentinel) */}
            {hasMore && <div ref={sentinelRef} className="h-6 w-full pointer-events-none" />}

            {/* ⏳ 動態加載中指示器 */}
            {isLoadingMore && (
              <div className="w-full py-8 flex flex-col items-center justify-center gap-2 animate-fadeIn">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 shadow-bubble border border-rose-100/90 text-rose-600 text-xs font-bold backdrop-blur-md">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  <span>⚡ 正在動態載入更多特價情報...</span>
                </div>
              </div>
            )}

            {/* ✨ 到底狀態與情報總覽提示 */}
            {!hasMore && deals.length > 0 && !isLoadingMore && (
              <div className="w-full py-10 flex flex-col items-center justify-center text-center gap-2 animate-fadeIn">
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100/90 text-slate-600 text-xs font-bold border border-slate-200/60 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    ✨ 已為您呈現所有即時特惠（共 {totalCount || deals.length} 則）· 敬請期待更多每日情報！
                  </span>
                </div>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="text-[11px] text-slate-400 hover:text-slate-700 underline font-semibold mt-1 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>回到最上方</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 浮動回到頂部按鈕 (右下角平滑飛入) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 p-3 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-md border border-white/20 flex items-center justify-center group cursor-pointer"
          title="回到最上方"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* 推薦標籤彈窗 */}
      <RecommendedTagsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
