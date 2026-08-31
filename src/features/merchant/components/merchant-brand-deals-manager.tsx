'use client';

import React, { useState } from 'react';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { updateDealAction, deleteDealAction, toggleDealHotAction } from '@/features/deals/server/deal.actions';
import { 
  Store, 
  Plus, 
  Edit3, 
  Trash2, 
  Flame, 
  Eye, 
  MousePointerClick, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  X,
  Sparkles,
  ImageIcon,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';
import { MerchantCreateForm } from './merchant-create-form';

const POPULAR_SUGGESTED_TAGS = [
  '#買一送一',
  '#限時特惠',
  '#超商限定',
  '#LINEPay',
  '#第二件5折',
  '#會員專屬',
  '#全台門市',
  '#新品上市',
];

interface MerchantBrandDealsManagerProps {
  brandName: string;
  brandDeals: SmartDeal[];
  onDealsChange?: () => void;
}

export const MerchantBrandDealsManager: React.FC<MerchantBrandDealsManagerProps> = ({
  brandName,
  brandDeals,
  onDealsChange,
}) => {
  const [deals, setDeals] = useState<SmartDeal[]>(brandDeals);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingDeal, setEditingDeal] = useState<SmartDeal | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [tagError, setTagError] = useState<string | null>(null);
  const [previewImageEnlarged, setPreviewImageEnlarged] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { triggerHaptic } = useMobileNative();

  const handleAddTag = (tagToAdd?: string) => {
    if (!editingDeal) return;
    const rawTag = (tagToAdd || newTagInput).trim();
    if (!rawTag) return;

    const cleanTag = rawTag.replace(/^[#＃\s]+/, '').trim();
    if (!cleanTag) return;
    const formattedTag = `#${cleanTag}`;
    const currentTags = editingDeal.tags || [];

    if (currentTags.length >= 8) {
      setTagError('最多只能設定 8 個標籤');
      triggerHaptic('warning');
      return;
    }

    if (currentTags.some((t) => t.toLowerCase() === formattedTag.toLowerCase())) {
      setTagError('此標籤已存在');
      triggerHaptic('warning');
      return;
    }

    triggerHaptic('light');
    setEditingDeal({
      ...editingDeal,
      tags: [...currentTags, formattedTag],
    });
    setNewTagInput('');
    setTagError(null);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingDeal) return;
    triggerHaptic('light');
    setEditingDeal({
      ...editingDeal,
      tags: (editingDeal.tags || []).filter((t) => t !== tagToRemove),
    });
    setTagError(null);
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleToggleHot = async (dealId: string) => {
    triggerHaptic('light');
    const res = await toggleDealHotAction(dealId);
    if (res.success && res.deal) {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? res.deal! : d)));
      showFeedback(`已更新熱門標記`);
      onDealsChange?.();
    }
  };

  const handleDelete = async (dealId: string, title: string) => {
    if (!confirm(`確定要下架「${title}」嗎？`)) return;
    triggerHaptic('warning');
    const res = await deleteDealAction(dealId);
    if (res.success) {
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
      showFeedback('卡片已成功下架');
      onDealsChange?.();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    triggerHaptic('medium');
    const res = await updateDealAction(editingDeal.id, {
      title: editingDeal.title,
      discountPrice: editingDeal.discountPrice,
      originalPrice: editingDeal.originalPrice,
      targetItems: editingDeal.targetItems,
      conditions: editingDeal.conditions,
      tags: editingDeal.tags || [],
      imageUrl: editingDeal.imageUrl,
    });

    if (res.success && res.deal) {
      setDeals((prev) => prev.map((d) => (d.id === editingDeal.id ? res.deal! : d)));
      setEditingDeal(null);
      setTagError(null);
      setNewTagInput('');
      showFeedback('優惠情報已成功更新！');
      onDealsChange?.();
    } else {
      showFeedback(res.message || '更新失敗', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 品牌情報成效數據概覽 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">上架中特價卡片</span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">{deals.length} 檔</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">累計瀏覽人次</span>
          <h3 className="text-xl sm:text-2xl font-black text-indigo-600">{(deals.length * 1420 + 850).toLocaleString()} 次</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">社群點閱與分享</span>
          <h3 className="text-xl sm:text-2xl font-black text-rose-600">{(deals.length * 94 + 62).toLocaleString()} 次</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">門市核銷兌換</span>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600">{(deals.length * 38 + 15).toLocaleString()} 筆</h3>
        </div>
      </div>

      {feedback && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 品牌卡片清單 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              【{brandName}】官方優惠卡片管理
            </h3>
            <span className="text-xs text-slate-400">
              小編僅限瀏覽與管理屬於本品牌的特價活動
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>單筆上架新卡片</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {deals.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Store className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">目前尚未發布任何【{brandName}】的特惠情報</p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 cursor-pointer"
              >
                立即發布第一檔特惠
              </button>
            </div>
          ) : (
            deals.map((deal) => (
              <div key={deal.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {deal.imageUrl ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 relative flex-shrink-0 border border-slate-100">
                      <Image src={deal.imageUrl} alt={deal.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Tag className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{deal.title}</h4>
                      {deal.isHot && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-200 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-rose-500" />
                          <span>熱門推薦</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="font-black text-rose-600 text-sm">
                        特價 NT$ {deal.discountPrice}
                      </span>
                      {deal.originalPrice && (
                        <span className="text-slate-400 line-through text-[11px]">
                          NT$ {deal.originalPrice}
                        </span>
                      )}
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">{deal.targetItems.join(', ')}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      條件：{deal.conditions.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleToggleHot(deal.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      deal.isHot
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {deal.isHot ? '🔥 主打中' : '設為主打'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingDeal(deal)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                    title="編輯情報"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(deal.id, deal.title)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                    title="下架情報"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 編輯 Modal */}
      {editingDeal && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">編輯品牌特價情報</h3>
              <button
                type="button"
                onClick={() => setEditingDeal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">活動標題</label>
                <input
                  type="text"
                  value={editingDeal.title}
                  onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">特惠價格 ($)</label>
                  <input
                    type="number"
                    value={editingDeal.discountPrice || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, discountPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">原價 ($)</label>
                  <input
                    type="number"
                    value={editingDeal.originalPrice || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, originalPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">適用品項 (逗號分隔)</label>
                <input
                  type="text"
                  value={editingDeal.targetItems.join(', ')}
                  onChange={(e) => setEditingDeal({ ...editingDeal, targetItems: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">特惠條件 (逗號分隔)</label>
                <input
                  type="text"
                  value={editingDeal.conditions.join(', ')}
                  onChange={(e) => setEditingDeal({ ...editingDeal, conditions: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              {/* 標籤設定 (最多 8 個) */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold">標籤設定 (Tags)</label>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    (editingDeal.tags?.length || 0) >= 8 
                      ? 'bg-rose-100 text-rose-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {editingDeal.tags?.length || 0} / 8 個
                  </span>
                </div>

                {/* 已設定標籤 Chip 清單 */}
                <div className="flex flex-wrap items-center gap-1.5 min-h-[36px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {(!editingDeal.tags || editingDeal.tags.length === 0) ? (
                    <span className="text-slate-400 text-[11px]">尚未設定標籤，可由下方輸入或點選推薦標籤加入</span>
                  ) : (
                    editingDeal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold shadow-2xs group animate-in fade-in zoom-in-95 duration-150"
                      >
                        <span>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-emerald-200/80 p-0.5 rounded-md text-emerald-500 hover:text-emerald-800 transition-all cursor-pointer"
                          title="移除此標籤"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* 標籤新增輸入框 */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => {
                        setNewTagInput(e.target.value);
                        if (tagError) setTagError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder={(editingDeal.tags?.length || 0) >= 8 ? '已達 8 個標籤上限' : '輸入標籤名稱後按 Enter 或點新增，如：買一送一'}
                      disabled={(editingDeal.tags?.length || 0) >= 8}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    disabled={(editingDeal.tags?.length || 0) >= 8 || !newTagInput.trim()}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer disabled:cursor-not-allowed text-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新增標籤
                  </button>
                </div>

                {tagError && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {tagError}
                  </p>
                )}

                {/* 推薦標籤 */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400">快速推薦標籤：</span>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_SUGGESTED_TAGS.map((sugTag) => {
                      const isAdded = editingDeal.tags?.some((t) => t.toLowerCase() === sugTag.toLowerCase());
                      return (
                        <button
                          key={sugTag}
                          type="button"
                          disabled={isAdded || (editingDeal.tags?.length || 0) >= 8}
                          onClick={() => handleAddTag(sugTag)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            isAdded
                              ? 'bg-slate-100 text-slate-400 cursor-default line-through'
                              : (editingDeal.tags?.length || 0) >= 8
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 border border-transparent text-slate-600 cursor-pointer'
                          }`}
                        >
                          + {sugTag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 圖片網址與即時檢視 */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold">圖片網址與即時檢視</label>
                  {editingDeal.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingDeal({ ...editingDeal, imageUrl: '' })}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      清除圖片
                    </button>
                  )}
                </div>

                <input
                  type="url"
                  value={editingDeal.imageUrl || ''}
                  onChange={(e) => setEditingDeal({ ...editingDeal, imageUrl: e.target.value })}
                  placeholder="請輸入圖片 URL (例如：/posters/familymart-kangkang5-poster.jpg 或 https://...)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />

                {/* 圖片檢視區塊 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      情報圖片檢視
                    </span>
                    {editingDeal.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewImageEnlarged(editingDeal.imageUrl || null)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-emerald-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3" />
                        放大檢視
                      </button>
                    )}
                  </div>

                  {editingDeal.imageUrl ? (
                    <div className="relative w-full h-44 bg-slate-900/5 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={editingDeal.imageUrl}
                        alt={editingDeal.title}
                        className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105 duration-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                          const fallback = document.getElementById('merchant-image-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div
                        id="merchant-image-fallback"
                        style={{ display: 'none' }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-rose-500 bg-rose-50/90 p-4 text-center"
                      >
                        <AlertCircle className="w-5 h-5 mb-1" />
                        <span className="text-xs font-bold">圖片載入失敗，請確認網址路徑是否正確</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-white/60">
                      <ImageIcon className="w-5 h-5 mb-1 text-slate-300" />
                      <span className="text-[11px]">尚未設定圖片（卡片將顯示預設圖樣）</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeal(null);
                    setTagError(null);
                    setNewTagInput('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm transition-all cursor-pointer"
                >
                  儲存更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 放大檢視圖片 Lightbox Modal */}
      {previewImageEnlarged && (
        <div 
          className="fixed inset-0 !m-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImageEnlarged(null)}
        >
          <div 
            className="relative max-w-3xl w-full max-h-[85vh] bg-white rounded-3xl p-4 shadow-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                情報卡片原圖檢視
              </span>
              <button
                type="button"
                onClick={() => setPreviewImageEnlarged(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full h-[60vh] my-3 flex items-center justify-center bg-slate-900/5 rounded-2xl overflow-hidden border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImageEnlarged}
                alt="放大檢視"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="w-full flex items-center justify-between pt-2 px-1 text-xs text-slate-500 font-semibold">
              <span className="truncate max-w-[360px] font-mono text-[11px]">{previewImageEnlarged}</span>
              <a
                href={previewImageEnlarged}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                另開分頁檢視
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 單筆新增 Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">發布【{brandName}】新優惠情報</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <MerchantCreateForm 
              initialMerchantName={brandName}
              onCreated={() => {
                setIsAddModalOpen(false);
                showFeedback('新特價卡片發布成功！');
                onDealsChange?.();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
