'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from './app-header';
import { MobileDock } from './mobile-dock';
import { SearchModal } from '@/features/deals/components/search-modal';
import { MobileAccountSheet } from '@/features/auth/components/mobile-account-sheet';

interface AppLayoutShellProps {
  children: React.ReactNode;
}

export const AppLayoutShell: React.FC<AppLayoutShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isBackoffice = pathname.startsWith('/admin') || pathname.startsWith('/merchant');

  if (isBackoffice) {
    // 後台獨立環境：不渲染前台 Header 與 Footer，由 /admin 與 /merchant 的獨立 layout 自行組織
    return (
      <main className="flex-1 w-full min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      {/* 全域前台頂部導覽列 (含 Pinterest 泡泡風搜尋列與標籤導覽) */}
      <AppHeader />

      {/* 主內容區 (手機版預留 pb-24 避免被底部 Dock 遮擋) */}
      <main className="flex-1 w-full pb-24 sm:pb-0">
        {children}
      </main>

      {/* 手機版專屬底部 Dock 導覽列 */}
      <MobileDock />

      {/* 全域搜尋 Modal */}
      <SearchModal />

      {/* 手機版專屬會員選單 Sheet */}
      <MobileAccountSheet />

      {/* 前台頁尾 */}
      <footer className="w-full bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">🛒 全通路特價情報聚合平台</span>
            <span>· Pinterest 簡約泡泡風</span>
          </div>
          <p>© 2026 特價情報站 (Deal Aggregator Platform). 契約先行 ➔ 垂直領域切片 ➔ UI 五態閉環.</p>
        </div>
      </footer>
    </>
  );
};

