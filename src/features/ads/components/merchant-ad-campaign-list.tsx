'use client';

import React, { useState } from 'react';
import { AdCampaign, AdCampaignStatus } from '../types/ad.types';
import { updateAdStatusAction } from '../server/ad.actions';
import { Megaphone, Play, Pause, TrendingUp, Eye, MousePointerClick, Calendar, DollarSign } from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';

interface MerchantAdCampaignListProps {
  brandName: string;
  campaigns: AdCampaign[];
  onRefresh?: () => void;
}

export const MerchantAdCampaignList: React.FC<MerchantAdCampaignListProps> = ({
  brandName,
  campaigns: initialCampaigns,
  onRefresh,
}) => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(initialCampaigns);
  const { triggerHaptic } = useMobileNative();

  const handleToggle = async (id: string, currentStatus: AdCampaignStatus) => {
    triggerHaptic('medium');
    const newStatus: AdCampaignStatus = currentStatus === 'active' ? 'paused' : 'active';
    const res = await updateAdStatusAction(id, newStatus);
    if (res.success && res.campaign) {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? res.campaign! : c)));
      onRefresh?.();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">
              【{brandName}】廣告活動投放管理
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            共 {campaigns.length} 檔廣告活動
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {campaigns.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              目前尚未建立任何廣告投放活動，歡迎點擊上方分頁購買廣告版面！
            </div>
          ) : (
            campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {camp.imageUrl && (
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 relative flex-shrink-0 border border-slate-200/60">
                      <Image src={camp.imageUrl} alt={camp.title} fill className="object-cover" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{camp.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        camp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {camp.status === 'active' ? '🟢 投放中' : '⏸ 已暫停'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                      <span className="font-semibold text-indigo-600 uppercase font-mono">
                        {camp.placement} ({camp.biddingModel.toUpperCase()} 模式)
                      </span>
                      <span>·</span>
                      <span>走期: {camp.startDate} ~ {camp.endDate}</span>
                      <span>·</span>
                      <span className="font-bold text-slate-800">預算: NT$ {camp.spentBudget} / {camp.totalBudget}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold pt-0.5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{camp.impressions.toLocaleString()} 曝光</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3.5 h-3.5 text-rose-500" />
                        <span>{camp.clicks} 點擊</span>
                      </span>
                      <span className="text-emerald-600 font-bold">CTR: {camp.ctr}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(camp.id, camp.status)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    {camp.status === 'active' ? '暫停投放' : '恢復投放'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
