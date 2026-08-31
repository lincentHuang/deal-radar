'use client';

import React, { useState } from 'react';
import { AdCampaign, AdCampaignStatus } from '@/features/ads/types/ad.types';
import { updateAdStatusAction } from '@/features/ads/server/ad.actions';
import { Megaphone, Play, Pause, CheckCircle2, TrendingUp, Eye, MousePointerClick, DollarSign } from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';

interface AdminAdsMonitorProps {
  initialCampaigns: AdCampaign[];
  onRefresh?: () => void;
}

export const AdminAdsMonitor: React.FC<AdminAdsMonitorProps> = ({ initialCampaigns, onRefresh }) => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(initialCampaigns);
  const { triggerHaptic } = useMobileNative();

  const handleToggleStatus = async (id: string, currentStatus: AdCampaignStatus) => {
    triggerHaptic('medium');
    const newStatus: AdCampaignStatus = currentStatus === 'active' ? 'paused' : 'active';
    const res = await updateAdStatusAction(id, newStatus);
    if (res.success && res.campaign) {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? res.campaign! : d(c))));
      onRefresh?.();
    }
  };

  const d = (c: AdCampaign) => c;

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spentBudget, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);

  return (
    <div className="space-y-6">
      {/* 廣告總量指標 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">累計廣告消耗金額</span>
            <h4 className="text-xl font-black text-slate-900">NT$ {totalSpent.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">總曝光次數 (Impressions)</span>
            <h4 className="text-xl font-black text-slate-900">{totalImpressions.toLocaleString()} 次</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">總點擊次數 (Clicks)</span>
            <h4 className="text-xl font-black text-slate-900">{totalClicks.toLocaleString()} 次</h4>
          </div>
        </div>
      </div>

      {/* 廣告活動表格 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900">全站品牌廣告活動投放清單</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">共 {campaigns.length} 個活動</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">廣告標題 / 品牌</th>
                <th className="py-3 px-4">版位與模式</th>
                <th className="py-3 px-4">走期與預算</th>
                <th className="py-3 px-4">成效 (曝光/點擊/CTR)</th>
                <th className="py-3 px-4">狀態</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      {camp.imageUrl && (
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 relative flex-shrink-0">
                          <Image src={camp.imageUrl} alt={camp.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 line-clamp-1">{camp.title}</span>
                        <span className="text-[10px] text-slate-400">{camp.merchantName}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 uppercase">{camp.placement}</span>
                      <span className="text-[10px] text-indigo-600 font-semibold uppercase">{camp.biddingModel} 模式</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">NT$ {camp.spentBudget} / {camp.totalBudget}</span>
                      <span className="text-[10px] text-slate-400">{camp.startDate} ~ {camp.endDate}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {camp.impressions.toLocaleString()} 曝 · {camp.clicks} 點
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">CTR: {camp.ctr}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      camp.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {camp.status === 'active' ? '🟢 投放中' : '⏸ 已暫停'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(camp.id, camp.status)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all active:scale-95"
                    >
                      {camp.status === 'active' ? '暫停' : '啟動'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
