'use client';

import React, { useState, useEffect } from 'react';
import { AdPlacement, AdBiddingModel, TrafficEstimate } from '../types/ad.types';
import { createAdCampaignAction, calculateAdEstimateAction } from '../server/ad.actions';
import { 
  Megaphone, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  Layers, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Check, 
  AlertCircle,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';

interface MerchantAdCampaignCreatorProps {
  brandName: string;
  onCampaignCreated?: () => void;
}

export const MerchantAdCampaignCreator: React.FC<MerchantAdCampaignCreatorProps> = ({
  brandName,
  onCampaignCreated,
}) => {
  const [placement, setPlacement] = useState<AdPlacement>('hero_banner');
  const [biddingModel, setBiddingModel] = useState<AdBiddingModel>('cpm');
  const [dailyBudget, setDailyBudget] = useState<number>(500);
  const [durationDays, setDurationDays] = useState<number>(5);
  
  // 廣告素材欄位
  const [title, setTitle] = useState<string>(`【${brandName}】官方獨家強檔特惠！`);
  const [subtitle, setSubtitle] = useState<string>('限時優惠倒數中，點擊即享專屬折價券');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80'
  );
  const [ctaText, setCtaText] = useState<string>('立即搶購');
  const [discountBadge, setDiscountBadge] = useState<string>('🔥 限時狂降');
  const [targetCategory, setTargetCategory] = useState<string>('food');
  const [targetRegion, setTargetRegion] = useState<string>('全部地區');

  // 即時流量推估
  const [estimate, setEstimate] = useState<TrafficEstimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { triggerHaptic } = useMobileNative();

  useEffect(() => {
    let isMounted = true;
    calculateAdEstimateAction(biddingModel, dailyBudget, durationDays).then((est) => {
      if (isMounted) setEstimate(est);
    });
    return () => {
      isMounted = false;
    };
  }, [biddingModel, dailyBudget, durationDays]);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('warning');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('merchantName', brandName);
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('imageUrl', imageUrl);
    formData.append('ctaText', ctaText);
    formData.append('discountBadge', discountBadge);
    formData.append('placement', placement);
    formData.append('biddingModel', biddingModel);
    formData.append('dailyBudget', String(dailyBudget));
    formData.append('durationDays', String(durationDays));
    
    const now = new Date();
    const end = new Date(Date.now() + 86400000 * durationDays);
    formData.append('startDate', now.toISOString().split('T')[0]);
    formData.append('endDate', end.toISOString().split('T')[0]);
    formData.append('targetCategories', targetCategory);
    formData.append('targetRegions', targetRegion);

    try {
      const res = await createAdCampaignAction(formData);
      if (res.success) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
        triggerHaptic('success');
        showFeedback(res.message);
        onCampaignCreated?.();
      } else {
        showFeedback(res.message, 'error');
      }
    } catch (err: any) {
      showFeedback(err.message || '廣告建立失敗', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 頂部 Header */}
      <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google & FB 廣告模式 · 流量競價投放系統</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            品牌專屬廣告版面購買與受眾流量投放
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            支援 CPM（每千次曝光計費）與 CPC（每次點擊計費）模式，精準將您的品牌優惠推送至首頁大橫幅、瀑布流贊助卡與專屬分類！
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：廣告參數與素材配置 (7 欄) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. 廣告版位選擇 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>1. 選擇推廣版位 (Ad Placement)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setPlacement('hero_banner');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  placement === 'hero_banner'
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <span className="font-extrabold text-xs text-slate-900 block">首頁頂部大橫幅</span>
                <span className="text-[10px] text-slate-500 mt-1 block">3:1 電腦 / 4:3 手機</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setPlacement('feed_native');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  placement === 'feed_native'
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <span className="font-extrabold text-xs text-slate-900 block">瀑布流贊助卡片</span>
                <span className="text-[10px] text-slate-500 mt-1 block">融入情報瀑布流</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setPlacement('category_sticky');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  placement === 'category_sticky'
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <span className="font-extrabold text-xs text-slate-900 block">分類專區置頂</span>
                <span className="text-[10px] text-slate-500 mt-1 block">精準鎖定分類受眾</span>
              </button>
            </div>
          </div>

          {/* 2. 計費競價模式 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>2. 計費競價模式 (Bidding Model)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setBiddingModel('cpm');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  biddingModel === 'cpm'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">CPM 曝光計費</span>
                  <span className="text-xs font-black text-emerald-700">NT$ 120 / 千次</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  適合品牌曝光、新品上市與大促廣宣
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setBiddingModel('cpc');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  biddingModel === 'cpc'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">CPC 點擊計費</span>
                  <span className="text-xs font-black text-emerald-700">NT$ 3.5 / 點擊</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  適合促銷直接導購、領券與門市核銷
                </span>
              </button>
            </div>
          </div>

          {/* 3. 預算與走期 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>3. 每日預算與投放天數</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>每日預算上限</span>
                  <span className="text-sm font-black text-indigo-600">NT$ {dailyBudget} / 天</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={100}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>投放走期天數</span>
                  <span className="text-sm font-black text-slate-900">{durationDays} 天</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 4. 素材文案填寫 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-xs font-semibold">
            <h3 className="text-sm font-black text-slate-900">4. 廣告文案與視覺圖片</h3>
            
            <div>
              <label className="block text-slate-700 mb-1">主標題</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">宣傳副標題</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">按鈕文字 (CTA)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">特惠標籤</label>
                <input
                  type="text"
                  value={discountBadge}
                  onChange={(e) => setDiscountBadge(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">橫幅大圖網址 (URL)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                required
              />
            </div>
          </div>
        </div>

        {/* 右側：即時成效試算器與下單 (5 欄) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 rounded-3xl text-white shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black">流量與預算即時試算</h3>
              </div>
              <span className="text-xs font-bold text-indigo-300">
                {biddingModel.toUpperCase()} 模式
              </span>
            </div>

            {estimate ? (
              <div className="space-y-4">
                {/* 預算總計 */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold">總投放預算 (Total Budget)</span>
                  <span className="text-xl font-black text-emerald-400">
                    NT$ {estimate.totalBudget.toLocaleString()}
                  </span>
                </div>

                {/* 預估曝光數 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>預估曝光次數 (Impressions)</span>
                    </span>
                    <span className="font-extrabold text-white">
                      {estimate.estimatedImpressions.min.toLocaleString()} ~ {estimate.estimatedImpressions.max.toLocaleString()} 次
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-4/5 rounded-full" />
                  </div>
                </div>

                {/* 預估點擊數 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MousePointerClick className="w-3.5 h-3.5 text-rose-400" />
                      <span>預估點擊次數 (Clicks)</span>
                    </span>
                    <span className="font-extrabold text-rose-400">
                      {estimate.estimatedClicks.min.toLocaleString()} ~ {estimate.estimatedClicks.max.toLocaleString()} 次
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-3/5 rounded-full" />
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>單價基準：</span>
                    <span className="font-semibold text-slate-300">
                      {biddingModel === 'cpm' ? 'NT$ 120 / 1,000 曝光' : 'NT$ 3.5 / 點擊'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>預估平均 CTR：</span>
                    <span className="font-semibold text-emerald-400">{estimate.estimatedAvgCtr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>投放走期：</span>
                    <span className="font-semibold text-slate-300">{durationDays} 天 (每日 NT$ {dailyBudget})</span>
                  </div>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-sm font-black rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>{isSubmitting ? '投放建立中...' : '確認下單並立即投放廣告'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
