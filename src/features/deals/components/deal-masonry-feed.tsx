'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useAtom } from 'jotai';
import { dealFiltersAtom, subscribedTagsAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { fetchDealsAction } from '@/features/deals/server/deal.actions';
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
  Tag
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';

interface DealMasonryFeedProps {
  initialDeals: SmartDeal[];
}

export const DealMasonryFeed: React.FC<DealMasonryFeedProps> = ({ initialDeals }) => {
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [subscribedTags, setSubscribedTags] = useAtom(subscribedTagsAtom);
  const [deals, setDeals] = useState<SmartDeal[]>(initialDeals);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { triggerHaptic } = useMobileNative();

  // 監聽篩選器或訂閱標籤變更並動態調用 Server Action
  useEffect(() => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await fetchDealsAction({
          ...filters,
          subscribedTags,
        });
        setDeals(result);
      } catch (err: any) {
        setError('無法載入特價情報，請檢查網路連線後重試');
      }
    });
  }, [filters, subscribedTags]);

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
      } catch (e) { }
      setSubscribedTags((prev) => [...prev, cleanTag]);
    }
  };

  const isCurrentTagSubscribed = filters.selectedTag && filters.selectedTag !== '__MY_TAGS__'
    ? subscribedTags.includes(filters.selectedTag.startsWith('#') ? filters.selectedTag : `#${filters.selectedTag}`)
    : false;

  // 檢查搜尋詞是否可作為標籤訂閱
  const searchMatchingTag = filters.searchQuery.trim()
    ? (filters.searchQuery.startsWith('#') ? filters.searchQuery.trim() : `#${filters.searchQuery.trim()}`)
    : null;
  const isSearchTagSubscribed = searchMatchingTag ? subscribedTags.includes(searchMatchingTag) : false;

  // 建立當前有效 Tab 清單以支援手勢左右滑動切換 (All ➔ 我的標籤 ➔ 各自訂閱標籤)
  const allTabs: (string | null)[] = [null, '__MY_TAGS__', ...subscribedTags];

  const currentTabIdx = filters.selectedTag === null
    ? 0
    : filters.selectedTag === '__MY_TAGS__'
      ? 1
      : allTabs.indexOf(filters.selectedTag.startsWith('#') ? filters.selectedTag : `#${filters.selectedTag}`);
  const safeTabIdx = currentTabIdx >= 0 ? currentTabIdx : 0;

  // 手勢左右滑動偵測 (支援手機端左滑看下一 Tab、右滑看上一 Tab)
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

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // 判斷條件：水平滑動超過 40px，水平位移明顯大於垂直位移（防垂直滾動誤觸），且於 600ms 內完成手勢
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25 && deltaTime < 600) {
      if (deltaX < 0) {
        // 向左滑動 ➔ 切換至下一個 Tab
        if (safeTabIdx < allTabs.length - 1) {
          triggerHaptic('light');
          setFilters((prev) => ({ ...prev, selectedTag: allTabs[safeTabIdx + 1] }));
        }
      } else {
        // 向右滑動 ➔ 切換至上一個 Tab
        if (safeTabIdx > 0) {
          triggerHaptic('light');
          setFilters((prev) => ({ ...prev, selectedTag: allTabs[safeTabIdx - 1] }));
        }
      }
    }
  };

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 touch-pan-y"
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
              className="text-xs font-bold px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-rose-600 border border-rose-200 transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
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
              className="text-xs font-bold px-3.5 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-all active:scale-95 shadow-xs"
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
              共 {deals.length} 則即時特惠 · 點擊卡片查看完整 7 大要素
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* 訂閱/取消訂閱此標籤按鈕 */}
            <button
              type="button"
              onClick={() => handleToggleCurrentTagSubscription(filters.selectedTag!)}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${isCurrentTagSubscribed
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

      {/* 2. 搜尋時若有對應關鍵字，顯示標籤訂閱推薦橫幅與當前搜尋關鍵字標籤 */}
      {filters.searchQuery && !filters.selectedTag ? (
        <div className="mb-5 p-3.5 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl border border-rose-200/70 flex flex-wrap items-center justify-between gap-3 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Tag className="w-4 h-4 text-rose-500" />
            <span>
              正在搜尋「{filters.searchQuery}」相關情報
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setFilters((prev) => ({ ...prev, searchQuery: '' }));
              }}
              className="w-4 h-4 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-800 flex items-center justify-center text-[10px] ml-1 transition-colors cursor-pointer"
              title="清除關鍵字"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleToggleCurrentTagSubscription(searchMatchingTag!)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs cursor-pointer ${isSearchTagSubscribed
              ? 'bg-white text-rose-600 border border-rose-200'
              : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
          >
            {isSearchTagSubscribed ? (
              <>
                <Check className="w-3 h-3" />
                <span>已在上方標籤列</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>⭐ 訂閱「{searchMatchingTag}」至上方</span>
              </>
            )}
          </button>
        </div>
      ) : null}

      {/* 6. 核心瀑布流列表區 (UI 五態實作) */}
      {/* 狀態 1: ⏳ Loading 骨架屏 */}
      {isPending ? (
        <DealMasonrySkeleton />
      ) : error ? (
        /* 狀態 3: ⚠️ Error 錯誤狀態 */
        <div className="w-full bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-bubble my-8">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">資料載入失敗</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-rose-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 hover:bg-rose-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置條件並重新載入</span>
          </button>
        </div>
      ) : deals.length === 0 ? (
        /* 狀態 2: 📭 Empty 空資料狀態 */
        <div className="w-full bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-bubble my-8">
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
                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>🔥 探索推薦標籤</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>清除所有篩選條件</span>
            </button>
          </div>
        </div>
      ) : (
        /* 狀態 4: ✅ Success 響應式瀑布流排版（手機雙欄 2 欄、平板 3 欄、桌機 4 欄） */
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2.5 sm:gap-2.5 w-full animate-fadeIn">
          {deals.map((deal) => (
            <div key={deal.id} className="break-inside-avoid mb-2.5">
              <SmartDealCard
                deal={deal}
                onTagClick={(tag) => setFilters((prev) => ({ ...prev, selectedTag: tag }))}
              />
            </div>
          ))}
        </div>
      )}

      {/* 推薦標籤彈窗 */}
      <RecommendedTagsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
