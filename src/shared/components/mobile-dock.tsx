'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import {
  dealFiltersAtom,
  isSearchModalOpenAtom,
  isFilterModalOpenAtom,
  isAccountSheetOpenAtom,
} from '@/features/subscriptions/atoms/subscription-atoms';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  User,
} from 'lucide-react';

export const MobileDock: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [, setIsSearchModalOpen] = useAtom(isSearchModalOpenAtom);
  const [, setIsFilterModalOpen] = useAtom(isFilterModalOpenAtom);
  const [, setIsAccountSheetOpen] = useAtom(isAccountSheetOpenAtom);
  const { triggerHaptic } = useMobileNative();

  // 計算自訂篩選條件數量
  const activeCustomFilterCount = [
    filters.channelType && filters.channelType !== 'all',
    (filters.selectedRegions && filters.selectedRegions.length > 0) ||
      (filters.selectedCity && filters.selectedCity !== '全部地區'),
    filters.category && filters.category !== 'all',
    filters.sortBy && filters.sortBy !== 'latest',
    filters.selectedCard !== null && filters.selectedCard !== undefined,
  ].filter(Boolean).length;

  const isHomeActive = pathname === '/' && !filters.searchQuery;
  const isSearchActive = Boolean(filters.searchQuery);
  const isFilterActive = activeCustomFilterCount > 0;
  const isAccountActive = pathname === '/profile';

  const handleHomeClick = () => {
    triggerHaptic('light');
    setFilters((prev) => ({ ...prev, selectedTag: null, searchQuery: '' }));
    if (pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchClick = () => {
    triggerHaptic('medium');
    setIsSearchModalOpen(true);
  };

  const handleFilterClick = () => {
    triggerHaptic('medium');
    setIsFilterModalOpen(true);
  };

  const handleAccountClick = () => {
    triggerHaptic('light');
    if (!isAuthenticated) {
      openAuthModal('login');
    } else {
      setIsAccountSheetOpen(true);
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 sm:hidden flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="手機版底部導覽 Dock"
        className="pointer-events-auto w-full max-w-[340px] bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-full px-2 py-1.5 flex items-center justify-around ring-1 ring-slate-900/5 transition-all animate-slideUp"
      >
        {/* 1. 探索 / 首頁 */}
        <button
          type="button"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all active:scale-90 cursor-pointer ${
            isHomeActive
              ? 'text-rose-600 font-black'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isHomeActive ? 'bg-rose-50 text-rose-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight">探索</span>
        </button>

        {/* 2. 搜尋 (點擊開啟 Search Modal) */}
        <button
          type="button"
          onClick={handleSearchClick}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all active:scale-90 cursor-pointer ${
            isSearchActive
              ? 'text-rose-600 font-black'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isSearchActive ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight">
            {filters.searchQuery ? '搜尋中' : '搜尋'}
          </span>
        </button>

        {/* 3. 篩選 (點擊開啟 DealFilterModal) */}
        <button
          type="button"
          onClick={handleFilterClick}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all active:scale-90 cursor-pointer ${
            isFilterActive
              ? 'text-rose-600 font-black'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all relative ${
              isFilterActive ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isFilterActive && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                {activeCustomFilterCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">篩選</span>
        </button>

        {/* 4. 帳戶 (點擊開啟會員選單或登入彈窗) */}
        <button
          type="button"
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all active:scale-90 cursor-pointer ${
            isAccountActive
              ? 'text-rose-600 font-black'
              : 'text-slate-500 hover:text-slate-900 font-semibold'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all overflow-hidden ${
              isAccountActive ? 'ring-2 ring-rose-500' : ''
            }`}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : user ? (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center text-xs font-black shadow-xs">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
          <span className="text-[10px] tracking-tight truncate max-w-[42px]">
            {user ? '帳戶' : '登入'}
          </span>
        </button>
      </nav>
    </div>
  );
};
