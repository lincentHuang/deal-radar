import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '官方小編品牌工作台 | 特價情報站 Brand Editor Studio',
  description: '品牌特價卡片管理、DM 海報批量快速製卡、Google/FB 流量廣告購買系統',
};

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      {/* 官方小編獨立專屬 Header (Pinterest 簡約白底風格) */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* 左側：品牌工作台識別 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  特價情報站 · 官方小編工作台
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  OFFICIAL EDITOR
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Brand Deals Management, DM Batch Studio & Traffic Ads
              </span>
            </div>
          </div>

          {/* 右側：返回前台 */}
          <div className="flex items-center gap-3">
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

      {/* 小編主視圖 */}
      <div className="flex-1">
        {children}
      </div>

      {/* 小編獨立 Footer */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-slate-700">🏪 特價情報站 Brand Editor Studio · 官方小編行銷中樞</span>
          <span>© 2026 Deal Aggregator Merchant Studio</span>
        </div>
      </footer>
    </div>
  );
}
