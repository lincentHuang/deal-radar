'use client';

import React, { useState } from 'react';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { CrawlerTargetConfig, CrawlerScheduleConfig, CrawlerJobLog, AdminStats } from '../types/admin.types';
import { AdCampaign } from '@/features/ads/types/ad.types';
import { AdminDealManager } from './admin-deal-manager';
import { AdminCrawlerScheduler } from './admin-crawler-scheduler';
import { AdminAdsMonitor } from './admin-ads-monitor';
import { 
  ShieldCheck, 
  Layers, 
  Bot, 
  Megaphone, 
  Flame, 
  Store, 
  Sparkles, 
  Zap, 
  RefreshCw,
  Lock
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import { useRouter } from 'next/navigation';

interface AdminDashboardProps {
  initialDeals: SmartDeal[];
  initialTargets: CrawlerTargetConfig[];
  initialSchedule: CrawlerScheduleConfig;
  initialLogs: CrawlerJobLog[];
  initialStats: AdminStats;
  initialCampaigns: AdCampaign[];
}

type AdminTab = 'deals' | 'crawler' | 'ads';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialDeals,
  initialTargets,
  initialSchedule,
  initialLogs,
  initialStats,
  initialCampaigns,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('deals');
  const { triggerHaptic } = useMobileNative();
  const router = useRouter();

  const handleTabChange = (tab: AdminTab) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  const handleLogout = () => {
    triggerHaptic('medium');
    sessionStorage.removeItem('deal_aggregator_admin_auth_token');
    window.location.reload();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 快速統計數據卡片 (簡約泡泡白底風格) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">全域特惠卡片</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">{initialStats.totalDeals} 筆</h3>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">熱門推薦中</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-rose-600">{initialStats.hotDeals} 筆</h3>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">爬蟲站點 (啟用/總數)</span>
            <Bot className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-indigo-600">
            {initialStats.enabledTargetsCount} / {initialStats.crawlerTargetsCount}
          </h3>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">涵蓋實體/線上品牌</span>
            <Store className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600">{initialStats.totalMerchants} 家</h3>
        </div>
      </div>

      {/* Tab 切換器與操作列 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('deals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'deals'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-xs'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>全域特價卡片管理</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('crawler')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'crawler'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-xs'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>爬蟲站點與排程中控</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('ads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'ads'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-xs'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>廣告全域監控</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-xs transition-all cursor-pointer"
            title="重新整理資料"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 px-3.5 py-2 rounded-2xl bg-white hover:bg-rose-50 border border-slate-200/80 shadow-xs transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>鎖定後台</span>
          </button>
        </div>
      </div>

      {/* Tab 內容區 */}
      {activeTab === 'deals' && (
        <AdminDealManager
          initialDeals={initialDeals}
          onDealsChange={() => router.refresh()}
        />
      )}

      {activeTab === 'crawler' && (
        <AdminCrawlerScheduler
          initialTargets={initialTargets}
          initialSchedule={initialSchedule}
          initialLogs={initialLogs}
          onRefresh={() => router.refresh()}
          onViewDealsTab={() => handleTabChange('deals')}
        />
      )}

      {activeTab === 'ads' && (
        <AdminAdsMonitor
          initialCampaigns={initialCampaigns}
          onRefresh={() => router.refresh()}
        />
      )}
    </div>
  );
};
