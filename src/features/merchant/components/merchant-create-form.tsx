'use client';

import React, { useState } from 'react';
import { createMerchantDealAction } from '@/features/deals/server/deal.actions';
import { TAIWAN_REGIONS, POPULAR_CREDIT_CARDS } from '@/features/regions/data/taiwan-districts';
import { SmartDealCard } from '@/features/deals/components/smart-deal-card';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { BubbleButton } from '@/shared/components/ui/bubble-button';
import { Store, Tag, Plus, CheckCircle, Sparkles, Flame, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface MerchantCreateFormProps {
  onCreated?: () => void;
  initialMerchantName?: string;
}

export const MerchantCreateForm: React.FC<MerchantCreateFormProps> = ({ onCreated, initialMerchantName }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { triggerHaptic } = useMobileNative();

  // 即時預覽狀態
  const [formData, setFormData] = useState({
    title: '手工精品美式咖啡 + 肉桂捲 特惠午後套餐',
    merchantName: initialMerchantName || '星光甜點咖啡所',
    channelType: 'offline' as 'online' | 'offline',
    category: 'food' as any,
    city: '台北市',
    district: '信義區',
    originalPrice: '260',
    discountPrice: '180',
    targetItems: '手沖精品美式 (冰/熱)、招牌手作肉桂捲',
    conditions: '每日 14:00 - 17:00 內用供應、每人限點一份',
    eligibleCards: 'LINE Pay 滿 $150 現折 $20、國泰 CUBE 3%',
    tags: '#咖啡, #甜點, #台北信義, #下午茶, #LINEPay',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16),
    quota: '100',
    aspectRatio: '3:4' as '1:1' | '3:4' | '4:3' | '16:9' | '9:16',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  });

  const previewDeal: SmartDeal = {
    id: 'deal-preview-demo',
    title: formData.title || '（請輸入活動標題）',
    subtitle: `${formData.merchantName} 官方限時促銷`,
    category: formData.category,
    channelType: formData.channelType,
    merchant: {
      name: formData.merchantName || '店家名稱',
      storeBranches: `${formData.city} ${formData.district || ''} 門市`,
    },
    regions: [formData.city, `${formData.city} / ${formData.district}`],
    originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
    discountPrice: Number(formData.discountPrice) || 0,
    priceUnit: '套',
    targetItems: formData.targetItems.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
    conditions: formData.conditions.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean),
    eligibleCards: formData.eligibleCards.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
    tags: formData.tags.split(/[,，、\s]/).map((t) => t.startsWith('#') ? t : `#${t}`).filter((t) => t !== '#'),
    startDate: new Date(formData.startDate).toISOString(),
    endDate: new Date(formData.endDate).toISOString(),
    isHot: true,
    isFlashDeal: true,
    source: 'merchant_post',
    likeCount: 0,
    commentCount: 0,
    aspectRatio: formData.aspectRatio,
    imageUrl: formData.imageUrl,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const fData = new FormData(e.currentTarget);
    const res = await createMerchantDealAction(fData);

    setIsSubmitting(false);
    if (res.success) {
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      setStatusMessage({ type: 'success', text: res.message });
      onCreated?.();
    } else {
      triggerHaptic('warning');
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 左側：表單輸入區 */}
      <div className="lg:col-span-7 bg-white rounded-bubble-lg p-6 sm:p-8 border border-slate-100 shadow-bubble">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">商家自主促銷發布後台</h2>
            <p className="text-xs text-slate-500">上傳您的實體門市特惠，即時同步至在地情報首頁與標籤訂閱推播</p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 活動標題 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              活動標題 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              placeholder="例如：星巴克特大杯買一送一好友分享日"
            />
          </div>

          {/* 店家名稱 & 通路類別 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                門市 / 品牌名稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="merchantName"
                required
                value={formData.merchantName}
                onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                placeholder="例如：路易莎咖啡 信義門市"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                通路類型 <span className="text-rose-500">*</span>
              </label>
              <select
                name="channelType"
                value={formData.channelType}
                onChange={(e) => setFormData({ ...formData, channelType: e.target.value as any })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              >
                <option value="offline">🏪 實體門市</option>
                <option value="online">🛍️ 線上電商</option>
              </select>
            </div>
          </div>

          {/* 適用地區 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">適用縣市</label>
              <select
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              >
                {TAIWAN_REGIONS.map((r) => (
                  <option key={r.city} value={r.city}>{r.city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">行政區</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                placeholder="例如：信義區"
              />
            </div>
          </div>

          {/* 原價 vs 特價 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">原價 (參考定價)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                placeholder="260"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                特價 (實付金額) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="discountPrice"
                required
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white font-bold text-rose-600"
                placeholder="180"
              />
            </div>
          </div>

          {/* 適用品項 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              適用品項範圍 (逗號分隔) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="targetItems"
              required
              value={formData.targetItems}
              onChange={(e) => setFormData({ ...formData, targetItems: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              placeholder="例如：手沖精品美式、招牌肉桂捲"
            />
          </div>

          {/* 特惠條件 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              特價觸發條件 / 門檻 (逗號分隔) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="conditions"
              required
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              placeholder="例如：每日 14:00-17:00 內用、每人限點一份"
            />
          </div>

          {/* 信用卡與支付工具 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              適用信用卡 / 支付工具回饋
            </label>
            <input
              type="text"
              name="eligibleCards"
              value={formData.eligibleCards}
              onChange={(e) => setFormData({ ...formData, eligibleCards: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              placeholder="例如：LINE Pay 滿 $150 現折 $20、國泰 CUBE 3%"
            />
          </div>

          {/* 圖片上傳規格與比例標準 */}
          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                📸 卡片封面圖比例規格 (支援 5 種上傳標準)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { ratio: '1:1', label: '1:1 正方' },
                  { ratio: '3:4', label: '3:4 直式' },
                  { ratio: '4:3', label: '4:3 經典' },
                  { ratio: '16:9', label: '16:9 寬螢幕' },
                  { ratio: '9:16', label: '9:16 限動' },
                ].map((item) => (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setFormData({ ...formData, aspectRatio: item.ratio as any });
                    }}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all ${
                      formData.aspectRatio === item.ratio
                        ? 'bg-rose-500 text-white shadow-xs scale-[1.02]'
                        : 'bg-white text-slate-600 hover:bg-rose-50 border border-rose-200/60'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <input type="hidden" name="aspectRatio" value={formData.aspectRatio} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                圖片 URL 網址
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {/* 標籤 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              關聯標籤 (逗號分隔)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              placeholder="#咖啡, #甜點, #台北信義"
            />
          </div>

          {/* 分類 */}
          <input type="hidden" name="category" value={formData.category} />

          {/* 送出按鈕 (UI 五態: Disabled / Active) */}
          <div className="pt-4">
            <BubbleButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full text-sm font-bold"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {isSubmitting ? '正在審核並發布中...' : '確認並即時發布優惠'}
            </BubbleButton>
          </div>
        </form>
      </div>

      {/* 右側：即時泡泡卡片預覽區 */}
      <div className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <span className="font-bold flex items-center gap-1 text-slate-700">
            <Eye className="w-4 h-4 text-rose-500" />
            <span>消費者端即時卡片預覽 (Pinterest 泡泡風)</span>
          </span>
          <span className="text-[11px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium">
            Live Preview
          </span>
        </div>

        {/* 預覽卡片 */}
        <SmartDealCard deal={previewDeal} />

        <div className="p-4 bg-slate-100 rounded-2xl text-xs text-slate-600">
          💡 <strong>自動結構化保障</strong>：系統將自動為您的活動提取品項、門檻條件與折數，並推送至已訂閱該標籤的周邊消費者裝置上。
        </div>
      </div>
    </div>
  );
};
