'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { dealFiltersAtom, subscribedTagsAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { Sparkles, Store, Flame, Search, X, User, ShieldCheck } from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import { SubHeaderTagNav } from '@/features/subscriptions/components/sub-header-tag-nav';
import { RecommendedTagsModal } from '@/features/subscriptions/components/recommended-tags-modal';

import { UserMenuDropdown } from '@/features/auth/components/user-menu-dropdown';
import { AuthModal } from '@/features/auth/components/auth-modal';

export const AppHeader: React.FC = () => {
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [subscribedTags] = useAtom(subscribedTagsAtom);
  const [isRecommendedModalOpen, setIsRecommendedModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { triggerHaptic } = useMobileNative();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 搜尋時標籤自動切換為全部 (selectedTag: null)
    setFilters((prev) => ({ ...prev, searchQuery: value, selectedTag: null }));
    // 若在商家頁或其他頁面搜尋，自動導回首頁呈現搜尋結果
    if (pathname !== '/' && value.trim().length > 0) {
      router.push('/');
    }
  };

  const handleClearSearch = () => {
    triggerHaptic('light');
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
        {/* 第 1 行：主 Header (Logo、Pinterest 搜尋框、導覽快捷鍵) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* 1. Logo 品牌區 */}
          <Link 
            href="/" 
            onClick={() => {
              if (pathname === '/') {
                triggerHaptic('light');
              }
            }}
            className="flex items-center gap-2 group select-none flex-shrink-0"
          >
            <div className="relative h-10 w-auto flex items-center group-hover:scale-105 transition-transform duration-200">
              <Image 
                src="/brand/logo-transparent.png" 
                alt="特物情報局 Dealbureau" 
                width={160} 
                height={48} 
                className="h-9 sm:h-10 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* 2. Header 搜尋輸入框 (電腦版顯示，手機版整合至底部 Dock 與專屬 Search Modal) */}
          <div className="hidden sm:block flex-1 max-w-xl relative">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3.5 sm:left-4 w-4 h-4 text-slate-400 pointer-events-none transition-colors group-focus-within:text-rose-500" />
              <input
                type="text"
                placeholder="搜尋品項、店家、特惠條件 (如: 買1送1、星巴克)..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleClearSearch();
                  }
                }}
                className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-full border border-slate-200/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
              />
              {filters.searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="清除搜尋"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-300/80 hover:bg-slate-400 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
            </div>
          </div>

          {/* 3. 導覽快捷鍵 (已移除管理與小編按鈕，統一於會員選單維護) */}
          <nav className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* 探索標籤按鈕 (點擊彈出推薦標籤池) */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsRecommendedModalOpen(true);
              }}
              title="探索推薦標籤池"
              className="text-xs font-bold px-3 sm:px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-200/60 shadow-xs active:scale-95 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-500" />
              <span>探索標籤</span>
            </button>

            {/* 4. 會員選單與登入/註冊入口 (電腦版顯示，手機版同步支援底部 Dock) */}
            <div className="hidden sm:block">
              <UserMenuDropdown />
            </div>
          </nav>
        </div>

        {/* 第 2 行：副 Header 整合型標籤與 Filter 導覽列 */}
        <SubHeaderTagNav />
      </header>

      {/* 官方推薦標籤彈窗 */}
      <RecommendedTagsModal
        isOpen={isRecommendedModalOpen}
        onClose={() => setIsRecommendedModalOpen(false)}
      />

      {/* 全域會員登入/註冊彈窗 */}
      <AuthModal />
    </>
  );
};
