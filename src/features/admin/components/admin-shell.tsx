'use client';

import React from 'react';
import { AdminAuthGuard } from './admin-auth-guard';
import { AdminSidebar } from './admin-sidebar';
import { usePathname } from 'next/navigation';
import { ChevronRight, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface AdminShellProps {
  children: React.ReactNode;
}

const ROUTE_NAMES: Record<string, { title: string; parent?: string }> = {
  '/admin': { title: '中控台總覽' },
  '/admin/deals': { title: '全域特價卡片管理', parent: '情報維運' },
  '/admin/crawler': { title: '爬蟲站點與階梯排程', parent: '情報維運' },
  '/admin/ads': { title: '廣告投放與成效全域監控', parent: '情報維運' },
  '/admin/permissions': { title: '管理權限編輯與成員名冊', parent: '管理安全' },
  '/admin/settings': { title: '系統安全與全域參數設定', parent: '管理安全' },
};

export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const pathname = usePathname();
  const currentRoute = ROUTE_NAMES[pathname] || { title: '中控台管理' };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex antialiased">
        {/* 左側邊欄 */}
        <AdminSidebar />

        {/* 右側主工作區 */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* 桌面端頂部麵包屑導航列 */}
          <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 h-14 hidden lg:flex items-center justify-between">
            {/* 麵包屑路徑 */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/admin" className="hover:text-slate-900 transition-colors">
                後台中控台
              </Link>
              {currentRoute.parent && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-slate-400">{currentRoute.parent}</span>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-slate-900">{currentRoute.title}</span>
            </div>

            {/* 右側快速環境識別標籤 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>最高管理員工作階段</span>
              </div>
            </div>
          </header>

          {/* 頁面內容載入區 */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* 簡約版權 Footer */}
          <footer className="w-full bg-transparent py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-auto px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-semibold text-slate-600">
                🛡️ 特價情報站 · Central Admin Operations & Permissions System
              </span>
              <span>© 2026 Deal Radar Control Portal</span>
            </div>
          </footer>
        </div>
      </div>
    </AdminAuthGuard>
  );
};
