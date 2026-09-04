'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Layers, 
  Bot, 
  Megaphone, 
  Users, 
  Settings, 
  ArrowLeft, 
  Lock, 
  RefreshCw, 
  Menu, 
  X, 
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { triggerHaptic } = useMobileNative();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const sections: NavSection[] = [
    {
      title: '情報維運中樞',
      items: [
        {
          name: '後台總覽看板',
          href: '/admin',
          icon: LayoutDashboard,
        },
        {
          name: '全域特價卡片',
          href: '/admin/deals',
          icon: Layers,
        },
        {
          name: '爬蟲站點與排程',
          href: '/admin/crawler',
          icon: Bot,
        },
        {
          name: '廣告全域監控',
          href: '/admin/ads',
          icon: Megaphone,
        },
      ],
    },
    {
      title: '管理與安全設定',
      items: [
        {
          name: '管理權限編輯',
          href: '/admin/permissions',
          icon: Users,
          badge: '新功能',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        {
          name: '系統安全設定',
          href: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ];

  const handleNavClick = (href: string) => {
    triggerHaptic('light');
    setIsMobileOpen(false);
  };

  const handleRefresh = () => {
    triggerHaptic('light');
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleLogout = () => {
    triggerHaptic('medium');
    sessionStorage.removeItem('deal_aggregator_admin_auth_token');
    window.location.href = '/admin';
  };

  const isCurrentActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // 側邊欄核心導覽列表
  const renderNavContent = () => (
    <div className="flex flex-col h-full">
      {/* 品牌標誌與身分標籤 */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-orange-400 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900 tracking-tight">特價情報站</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                ADMIN
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">中控台管理系統</span>
          </div>
        </div>

        {/* 移動端關閉按鈕 */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="關閉選單"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 節點狀態提示小卡 */}
      <div className="px-4 pt-4 pb-2">
        <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-slate-700">爬蟲節點在線中</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-all cursor-pointer ${
              isRefreshing ? 'animate-spin text-rose-500' : ''
            }`}
            title="重新整理資料"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 分組導航清單 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isCurrentActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        active ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3 h-3 transition-opacity ${active ? 'opacity-100 text-white/60' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 底部功能操作區 (鎖定後台與返回前台) */}
      <div className="p-3 border-t border-slate-100 space-y-1.5 bg-slate-50/50">
        <Link
          href="/"
          className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>返回前台首頁</span>
          <ExternalLink className="w-3 h-3 ml-auto text-slate-300" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-rose-500" />
          <span>鎖定中控台</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 桌面端固定側邊欄 (260px) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 z-30 shadow-xs">
        {renderNavContent()}
      </aside>

      {/* 移動端頂部 AppBar (漢堡選單觸發鈕) */}
      <div className="lg:hidden sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsMobileOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="開啟側邊欄"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-900">後台中控台</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all ${
              isRefreshing ? 'animate-spin text-rose-500' : ''
            }`}
            title="重新整理"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="鎖定"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 移動端抽屜 (Drawer Sheet) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* 抽屜視圖主體 (Safe-area 適配) */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};
