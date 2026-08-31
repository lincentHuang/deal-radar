'use client';

import React, { useState } from 'react';
import { DraftDealCard } from '../schemas/batch-flyer.schema';
import { extractDealsFromFlyersAction, batchPublishDealsAction } from '../server/batch-flyer.actions';
import { 
  FileUp, 
  Sparkles, 
  Layers, 
  Check, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Rocket, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Tag
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';
import Image from 'next/image';

interface MerchantBatchDmUploaderProps {
  brandName: string;
  onPublished?: () => void;
}

const SAMPLE_DM_POSTERS = [
  {
    name: '【超商大促】週末買1送1海報',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: '【生鮮生活】量販特惠折價目錄',
    url: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: '【美食餐飲】人氣套餐特選 DM',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  },
];

export const MerchantBatchDmUploader: React.FC<MerchantBatchDmUploaderProps> = ({
  brandName,
  onPublished,
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([SAMPLE_DM_POSTERS[0].url]);
  const [newInputUrl, setNewInputUrl] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [draftCards, setDraftCards] = useState<DraftDealCard[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { triggerHaptic } = useMobileNative();

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddImageUrl = (urlToAdd?: string) => {
    const targetUrl = urlToAdd || newInputUrl.trim();
    if (!targetUrl) return;
    triggerHaptic('light');
    if (!imageUrls.includes(targetUrl)) {
      setImageUrls([...imageUrls, targetUrl]);
    }
    if (!urlToAdd) setNewInputUrl('');
  };

  const handleRemoveImage = (index: number) => {
    triggerHaptic('light');
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleExtract = async () => {
    if (imageUrls.length === 0) {
      showFeedback('請至少加入一張 DM 海報圖片', 'error');
      return;
    }

    triggerHaptic('medium');
    setIsExtracting(true);
    try {
      const res = await extractDealsFromFlyersAction(brandName, imageUrls);
      if (res.success) {
        triggerHaptic('success');
        setDraftCards(res.extractedCards);
        showFeedback(res.message);
      } else {
        showFeedback(res.message, 'error');
      }
    } catch (err: any) {
      showFeedback(err.message || 'AI 辨識失敗', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleToggleCardSelection = (draftId: string) => {
    triggerHaptic('light');
    setDraftCards((prev) =>
      prev.map((c) => (c.draftId === draftId ? { ...c, selectedForPublish: !c.selectedForPublish } : c))
    );
  };

  const handleUpdateDraftField = (draftId: string, field: keyof DraftDealCard, value: any) => {
    setDraftCards((prev) =>
      prev.map((c) => (c.draftId === draftId ? { ...c, [field]: value } : c))
    );
  };

  const handleBatchPublish = async () => {
    const selected = draftCards.filter((c) => c.selectedForPublish);
    if (selected.length === 0) {
      showFeedback('請至少勾選一張欲發布的卡片', 'error');
      return;
    }

    triggerHaptic('warning');
    setIsPublishing(true);

    try {
      const res = await batchPublishDealsAction(brandName, selected);
      if (res.success) {
        // 放彩帶慶祝
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        triggerHaptic('success');
        showFeedback(res.message);
        setDraftCards([]);
        onPublished?.();
      } else {
        showFeedback(res.message, 'error');
      }
    } catch (err: any) {
      showFeedback(err.message || '發布失敗', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 頂部功能介紹 */}
      <div className="bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Vision 多模態多卡智能拆解</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            DM 促銷海報批量上傳 ➔ 快速特價卡片製作
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            一次上傳多張品牌促銷海報，AI 自動識別品項、優惠價格、有效走期與促銷條件，並一鍵批量生成獨立特惠情報發布至首頁情報牆！
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 步驟 1：上傳與選取 DM 圖片 */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">1</div>
            <h3 className="text-base font-black text-slate-900">步驟一：加入促銷 DM 海報圖檔</h3>
          </div>
          <span className="text-xs text-slate-400">已加入 {imageUrls.length} 張海報</span>
        </div>

        {/* 快速選取範例海報 */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500">快速載入示範促銷 DM 圖檔：</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_DM_POSTERS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddImageUrl(sample.url)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold text-slate-700 border border-slate-200/80 transition-all active:scale-95 cursor-pointer"
              >
                + {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* 自訂 URL 輸入 */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newInputUrl}
            onChange={(e) => setNewInputUrl(e.target.value)}
            placeholder="輸入海報圖片 URL 網址 (https://...)..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleAddImageUrl()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>加入</span>
          </button>
        </div>

        {/* 圖片預覽清單 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100 aspect-video">
              <Image src={url} alt={`DM ${idx + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                title="移除海報"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            disabled={isExtracting || imageUrls.length === 0}
            onClick={handleExtract}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini AI 多模態辨識萃取中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>✨ 啟動 AI 智能辨識 ➔ 批量生成草稿卡片</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 步驟 2：AI 萃取草稿卡片預覽與批量發布 */}
      {draftCards.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">2</div>
              <h3 className="text-base font-black text-slate-900">
                步驟二：確認草稿卡片並批量發布 (已萃取 {draftCards.length} 筆)
              </h3>
            </div>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handleBatchPublish}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>發布中...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>🚀 一鍵批量發布勾選卡片 ({draftCards.filter((c) => c.selectedForPublish).length})</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draftCards.map((card) => (
              <div
                key={card.draftId}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  card.selectedForPublish
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={card.selectedForPublish}
                      onChange={() => handleToggleCardSelection(card.draftId)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-black text-slate-900">勾選發布</span>
                  </label>

                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                    {card.category}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">活動標題</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateDraftField(card.draftId, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">特價金額 ($)</label>
                      <input
                        type="number"
                        value={card.discountPrice}
                        onChange={(e) => handleUpdateDraftField(card.draftId, 'discountPrice', Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-black text-rose-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">原價 ($)</label>
                      <input
                        type="number"
                        value={card.originalPrice || ''}
                        onChange={(e) => handleUpdateDraftField(card.draftId, 'originalPrice', Number(e.target.value) || undefined)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">適用品項</label>
                    <input
                      type="text"
                      value={card.targetItems}
                      onChange={(e) => handleUpdateDraftField(card.draftId, 'targetItems', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">特惠條件</label>
                    <input
                      type="text"
                      value={card.conditions}
                      onChange={(e) => handleUpdateDraftField(card.draftId, 'conditions', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
