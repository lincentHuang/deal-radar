'use client';

import React from 'react';
import Link from 'next/link';
import { 
  AdminStats, 
  CrawlerJobLog 
} from '../types/admin.types';
import { AdminUserStats } from '../types/admin-permission.types';
import { 
  Layers, 
  Flame, 
  Bot, 
  Store, 
  Users, 
  ShieldCheck, 
  Megaphone, 
  Settings, 
  ArrowRight, 
  Activity,
  Sparkles,
  Clock
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface AdminOverviewProps {
  stats: AdminStats;
  userStats: AdminUserStats;
  recentLogs: CrawlerJobLog[];
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  userStats,
  recentLogs,
}) => {
  const { triggerHaptic } = useMobileNative();

  return (
    <div className="space-y-6">
      {/* 歡迎與說明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              特價情報站 · 後台中控總覽
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
              OVERVIEW
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            全域即時指標監控、爬蟲自動化調度、使用者權限分發與商業廣告中控核心。
          </p>
        </div>
      </div>

      {/* 核心統計卡片網格 (6 格) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold">全域特價卡片</span>
            <Layers className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">{stats.totalDeals} 筆</h3>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold">熱門推薦中</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-rose-600">{stats.hotDeals} 筆</h3>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold">爬蟲站點</span>
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-indigo-600">
            {stats.enabledTargetsCount} / {stats.crawlerTargetsCount}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold">涵蓋品牌通路</span>
            <Store className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-emerald-600">{stats.totalMerchants} 家</h3>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold">註冊會員總數</span>
            <Users className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-blue-600">{userStats.totalUsers} 人</h3>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold">最高管理員</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-amber-600">{userStats.adminCount} 人</h3>
        </div>
      </div>

      {/* 快速管理捷徑卡片 (點選直接跳轉專屬分頁) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-900 tracking-tight">
          功能模組獨立頁面捷徑
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 特價卡片管理 */}
          <Link
            href="/admin/deals"
            onClick={() => triggerHaptic('light')}
            className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                全域特價卡片管理
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                檢視、批次標籤編輯、設為熱門推薦/即期促銷、手動新增與過期特惠清理。
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600 group-hover:text-rose-600 mt-4">
              <span>進入卡片管理</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 爬蟲站點與排程 */}
          <Link
            href="/admin/crawler"
            onClick={() => triggerHaptic('light')}
            className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                爬蟲站點與排程中控
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                超商、量販、美食部落格目標站點管理、每日黃金波段排程與即時爬蟲日誌。
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600 group-hover:text-indigo-600 mt-4">
              <span>進入爬蟲中控</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 廣告全域監控 */}
          <Link
            href="/admin/ads"
            onClick={() => triggerHaptic('light')}
            className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                廣告投放與成效監控
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                監看全域商家投放之 Hero Banner、點閱率 (CTR)、曝光次數與檔期預算審批。
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600 group-hover:text-amber-600 mt-4">
              <span>進入廣告監控</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 管理權限編輯 (新功能 Spotlight) */}
          <Link
            href="/admin/permissions"
            onClick={() => triggerHaptic('light')}
            className="group bg-gradient-to-br from-white to-rose-50/40 p-5 rounded-3xl border-2 border-rose-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white shadow-xs">
                NEW
              </span>
            </div>
            <div>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-rose-100">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                管理權限編輯與成員名冊
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                成員帳號名冊檢視、即時切換身分（一般會員、特約商家、最高管理員）與權限矩陣。
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-600 mt-4">
              <span>前往編輯管理權限</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 系統安全設定 */}
          <Link
            href="/admin/settings"
            onClick={() => triggerHaptic('light')}
            className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-slate-900 transition-colors">
                系統安全與管理設定
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                變更管理安全 PIN 碼、控制生產環境快速展示 8888 一鍵解鎖開關與防禦狀態。
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600 group-hover:text-slate-900 mt-4">
              <span>前往安全設定</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 近期日誌精簡清單 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-black text-slate-900">
              系統最近自動化與操作日誌
            </h3>
          </div>
          <Link
            href="/admin/crawler"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <span>檢視全部日誌</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {recentLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    log.status === 'success'
                      ? 'bg-emerald-500'
                      : log.status === 'failed'
                      ? 'bg-rose-500'
                      : 'bg-indigo-500'
                  }`}
                />
                <span className="font-semibold text-slate-800">{log.message}</span>
              </div>
              <span className="text-[10px] text-slate-400 flex-shrink-0">
                {new Date(log.timestamp).toLocaleString('zh-TW')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
