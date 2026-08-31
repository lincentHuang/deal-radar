import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Activity } from 'lucide-react';

export const metadata = {
  title: '最高管理權限中控台 | 特價情報站 Super Admin',
  description: '全域特價卡片管理、爬蟲排程與站點中控台、廣告全域監控',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      {/* 最高管理後台獨立專屬 Header (Pinterest 簡約白底風格) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* 左側：後台識別 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-orange-400 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  特價情報站 · 最高管理後台
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                  SUPER ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Central Crawler & Global Operations Portal
              </span>
            </div>
          </div>

          {/* 右側：系統狀態與返回前台 */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>爬蟲節點運行中</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>返回前台首頁</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 後台主視圖 */}
      <div className="flex-1">
        {children}
      </div>

      {/* 後台獨立 Footer */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-slate-700">🛡️ 特價情報站 Super Admin 中控核心 · 最高管理權限</span>
          <span>© 2026 Deal Aggregator Control Center</span>
        </div>
      </footer>
    </div>
  );
}
