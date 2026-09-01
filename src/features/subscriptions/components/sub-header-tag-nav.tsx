'use client';

import React, { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { subscribedTagsAtom, dealFiltersAtom, isFilterModalOpenAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { 
  Sparkles, 
  SlidersHorizontal,
  Tag as TagIcon,
  Plus
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import { DealFilterModal } from '@/features/deals/components/deal-filter-modal';
import { RecommendedTagsModal } from '@/features/subscriptions/components/recommended-tags-modal';

export const SubHeaderTagNav: React.FC = () => {
  const [subscribedTags] = useAtom(subscribedTagsAtom);
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [isFilterModalOpen, setIsFilterModalOpen] = useAtom(isFilterModalOpenAtom);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { triggerHaptic } = useMobileNative();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAllActive = !filters.selectedTag;
  const isMyTagsActive = filters.selectedTag === '__MY_TAGS__';

  const handleSelectAll = () => {
    triggerHaptic('light');
    setFilters((prev) => ({ ...prev, selectedTag: null }));
    if (pathname !== '/') router.push('/');
  };

  const handleSelectMyTags = () => {
    triggerHaptic('light');
    setFilters((prev) => ({ ...prev, selectedTag: '__MY_TAGS__' }));
    if (pathname !== '/') router.push('/');
  };

  const handleSelectTag = (tag: string) => {
    triggerHaptic('light');
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    setFilters((prev) => ({
      ...prev,
      selectedTag: prev.selectedTag === cleanTag ? null : cleanTag,
    }));
    if (pathname !== '/') router.push('/');
  };

  // 計算當前自訂篩選條件數 (若有非預設條件則觸發 Active 狀態)
  const activeCustomFilterCount = [
    filters.channelType && filters.channelType !== 'all',
    (filters.selectedRegions && filters.selectedRegions.length > 0) || (filters.selectedCity && filters.selectedCity !== '全部地區'),
    filters.category && filters.category !== 'all',
    filters.sortBy && filters.sortBy !== 'latest',
    filters.selectedCard !== null && filters.selectedCard !== undefined,
  ].filter(Boolean).length;

  // 當選取的 Tab 變更時，自動將該 Tab 平滑滾動至導覽列中心
  React.useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [filters.selectedTag, subscribedTags]);

  const isFilterActive = activeCustomFilterCount > 0;

  return (
    <>
      <nav 
        aria-label="副 Header 標籤專屬導覽列" 
        className="w-full border-t border-slate-100 bg-white/95 backdrop-blur-md transition-all shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 py-2.5">
          {/* 左側：Pinterest 極簡純文字標籤橫向滑動列 (100% 聚焦標籤探索) */}
          <div 
            ref={scrollRef}
            className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar py-1 select-none scroll-smooth flex-1"
          >
            {/* 1. 全部 All */}
            <button
              type="button"
              data-active={isAllActive ? 'true' : 'false'}
              onClick={handleSelectAll}
              className={`text-xs sm:text-sm tracking-tight transition-all whitespace-nowrap py-1 relative cursor-pointer ${
                isAllActive
                  ? 'text-slate-950 font-black border-b-2 border-slate-900 -mb-[2px]'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              All 全部
            </button>

            {/* 2. 我的標籤 (聚合所有訂閱) */}
            <button
              type="button"
              data-active={isMyTagsActive ? 'true' : 'false'}
              onClick={handleSelectMyTags}
              className={`text-xs sm:text-sm tracking-tight transition-all whitespace-nowrap py-1 relative flex items-center gap-1.5 cursor-pointer ${
                isMyTagsActive
                  ? 'text-rose-600 font-black border-b-2 border-rose-600 -mb-[2px]'
                  : 'text-slate-500 hover:text-rose-600 font-medium'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>我的標籤 ({subscribedTags.length})</span>
            </button>

            {/* 3. 使用者已訂閱的個別標籤清單 (以 # 前綴加強標籤識別度) */}
            {subscribedTags.map((tag) => {
              const cleanDisplay = tag.startsWith('#') ? tag : `#${tag}`;
              const isActive = filters.selectedTag === tag || filters.selectedTag === cleanDisplay;

              return (
                <button
                  key={tag}
                  type="button"
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => handleSelectTag(tag)}
                  className={`text-xs sm:text-sm tracking-tight transition-all whitespace-nowrap py-1 relative cursor-pointer font-bold ${
                    isActive
                      ? 'text-slate-950 font-black border-b-2 border-slate-900 -mb-[2px]'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span className="text-slate-400 font-normal mr-0.5">#</span>
                  <span>{cleanDisplay.replace(/^#/, '')}</span>
                </button>
              );
            })}

            {/* 4. 若標籤數較少，提示快速探索加標籤 */}
            {subscribedTags.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setIsTagModalOpen(true);
                }}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 py-1 whitespace-nowrap"
              >
                <Plus className="w-3 h-3" />
                <span>立即探索訂閱好康標籤</span>
              </button>
            )}
          </div>

          {/* 右側：整合型進階 Filter 篩選按鈕 (電腦版顯示，手機版已整合至底部 Dock) */}
          <div className="hidden sm:flex items-center pl-3 sm:pl-4 flex-shrink-0 border-l border-slate-100">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsFilterModalOpen(true);
              }}
              title="開啟進階情報篩選 (通路、地區、分類、排序)"
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer border ${
                isFilterActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-300/70 font-black'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>篩選</span>
              {isFilterActive && (
                <span className="bg-white text-rose-600 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs leading-none">
                  {activeCustomFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* 整合型進階篩選彈窗 */}
      <DealFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* 推薦標籤彈窗 */}
      <RecommendedTagsModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
    </>
  );
};

