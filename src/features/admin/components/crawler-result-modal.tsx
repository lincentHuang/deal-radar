'use client';

import React, { useState, useEffect } from 'react';
import { CrawlerExecutionResult } from '../types/admin.types';
import { SmartDeal, DealCategory } from '@/features/deals/types/deal.types';
import { 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  X, 
  Store, 
  Clock, 
  Tag as TagIcon, 
  Flame, 
  CreditCard,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Check,
  Target,
  Edit3,
  ImageIcon,
  Maximize2,
  Eye,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';
import Link from 'next/link';
import { calculateDiscount, formatPrice, formatRemainingTime } from '@/shared/lib/utils';
import { updateDealAction } from '@/features/deals/server/deal.actions';

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

interface CrawlerResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CrawlerExecutionResult | null;
  onViewDealsTab?: () => void;
  onDealsChange?: () => void;
}

type FilterTab = 'all' | 'created' | 'updated';

export const CrawlerResultModal: React.FC<CrawlerResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onViewDealsTab,
  onDealsChange,
}) => {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [createdDealsList, setCreatedDealsList] = useState<SmartDeal[]>([]);
  const [updatedDealsList, setUpdatedDealsList] = useState<SmartDeal[]>([]);
  const [editingDeal, setEditingDeal] = useState<SmartDeal | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [tagError, setTagError] = useState<string | null>(null);
  const [previewImageEnlarged, setPreviewImageEnlarged] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { triggerHaptic } = useMobileNative();

  useEffect(() => {
    if (result) {
      setCreatedDealsList(result.createdDeals || []);
      setUpdatedDealsList(result.updatedDeals || []);
    }
  }, [result]);

  if (!isOpen || !result) return null;

  const {
    success,
    message,
    crawledCount,
    insertedCount,
    updatedCount,
    purgedCount,
    targetNames = [],
  } = result;

  const displayDeals: SmartDeal[] = 
    filterTab === 'created'
      ? createdDealsList
      : filterTab === 'updated'
      ? updatedDealsList
      : [...createdDealsList, ...updatedDealsList];

  const handleTabChange = (tab: FilterTab) => {
    triggerHaptic('light');
    setFilterTab(tab);
  };

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  const handleCardClick = (deal: SmartDeal) => {
    triggerHaptic('light');
    setEditingDeal({ ...deal });
  };

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
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    setIsSaving(true);
    triggerHaptic('medium');

    const res = await updateDealAction(editingDeal.id, {
      title: editingDeal.title,
      subtitle: editingDeal.subtitle,
      discountPrice: editingDeal.discountPrice,
      originalPrice: editingDeal.originalPrice,
      priceUnit: editingDeal.priceUnit,
      category: editingDeal.category,
      channelType: editingDeal.channelType,
      targetItems: editingDeal.targetItems,
      conditions: editingDeal.conditions,
      tags: editingDeal.tags || [],
      imageUrl: editingDeal.imageUrl,
      isHot: editingDeal.isHot,
      isFlashDeal: editingDeal.isFlashDeal,
    });

    setIsSaving(false);

    if (res.success && res.deal) {
      const updatedItem = res.deal;
      setCreatedDealsList((prev) => prev.map((d) => (d.id === updatedItem.id ? updatedItem : d)));
      setUpdatedDealsList((prev) => prev.map((d) => (d.id === updatedItem.id ? updatedItem : d)));
      setEditingDeal(null);
      setTagError(null);
      setNewTagInput('');
      setToastMessage('🎉 卡片資料已成功更新並同步至全站！');
      triggerHaptic('success');
      onDealsChange?.();
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      setToastMessage(res.message || '更新失敗');
      triggerHaptic('warning');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 !m-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
      }}
    >
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200/90 text-slate-900 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crawler-result-title"
      >
        {/* 頂部彩色漸層 Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 relative overflow-hidden flex-shrink-0">
          <div className="absolute -right-10 -top-10 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-36 -bottom-10 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>真實爬蟲執行成果報告</span>
              </div>
              <h2 id="crawler-result-title" className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>🎉 採集完成！特惠情報卡片已同步建置</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                涵蓋站點：<span className="text-white font-bold">{targetNames.length > 0 ? targetNames.join('、') : '目標站點'}</span>
                <span className="ml-2 text-emerald-300 font-semibold">（點擊任一卡片可直接開啟編輯）</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer flex-shrink-0"
              aria-label="關閉彈窗"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 大成果指標卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
              <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ 新建立卡片</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {insertedCount} <span className="text-xs font-semibold text-slate-300">張</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
              <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>🔄 已更新情報</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {updatedCount} <span className="text-xs font-semibold text-slate-300">筆</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
              <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>🧹 清理過期</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {purgedCount} <span className="text-xs font-semibold text-slate-300">筆</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>📊 總解析特惠</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {crawledCount} <span className="text-xs font-semibold text-slate-300">筆</span>
              </div>
            </div>
          </div>
        </div>

        {/* 提示與篩選 Tab 列 */}
        <div className="px-5 sm:px-7 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleTabChange('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              全部卡片 ({createdDealsList.length + updatedDealsList.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('created')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterTab === 'created'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>新建立 ({createdDealsList.length})</span>
            </button>
            {updatedDealsList.length > 0 && (
              <button
                type="button"
                onClick={() => handleTabChange('updated')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'updated'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>已更新 ({updatedDealsList.length})</span>
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>點擊任一張卡片即可直接開啟資料編輯</span>
          </div>
        </div>

        {/* 提示訊息 Toast */}
        {toastMessage && (
          <div className="mx-5 my-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 卡片清單展示區 (依循前台卡片美感設計) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">
          {displayDeals.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-base font-black text-slate-800">
                {filterTab === 'created'
                  ? '本次掃描未產生新卡片（情報皆已為最新）'
                  : '目前無可顯示的情報卡片'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                目標站點中的特價活動已經全部為最新上線狀態，未檢測到重複或需新增之品項。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayDeals.map((deal) => {
                const isNew = createdDealsList.some((d) => d.id === deal.id);
                const discountInfo = calculateDiscount(deal.originalPrice, deal.discountPrice);
                const timeInfo = formatRemainingTime(deal.endDate, deal.startDate);
                const primaryCondition = deal.conditions?.[0] || null;
                const extraConditionCount = (deal.conditions?.length || 0) - 1;
                const primaryCard = deal.eligibleCards?.[0] || null;

                return (
                  <article
                    key={deal.id}
                    onClick={() => handleCardClick(deal)}
                    className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl p-1 border border-slate-200/90 shadow-bubble hover:shadow-bubble-hover hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none"
                  >
                    {/* 頂部狀態標記徽章 (新建立 / 已更新 + 編輯提示) */}
                    <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm backdrop-blur-md flex items-center gap-1 ${
                        isNew 
                          ? 'bg-emerald-500/95 text-white' 
                          : 'bg-indigo-600/95 text-white'
                      }`}>
                        {isNew ? <Sparkles className="w-2.5 h-2.5" /> : <RefreshCw className="w-2.5 h-2.5" />}
                        <span>{isNew ? '新卡片' : '已更新'}</span>
                      </span>
                      <span className="p-1 rounded-full bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" title="點擊編輯">
                        <Edit3 className="w-3 h-3" />
                      </span>
                    </div>

                    {/* 📸 頂部：Pinterest 質感大圖封面 (依循前台設計) */}
                    <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-2 flex items-center justify-center min-h-[140px] max-h-[220px]">
                      {deal.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={deal.imageUrl}
                          alt={deal.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-36 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 text-rose-400">
                          <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 mb-1 opacity-60" />
                          <span className="text-[10px] sm:text-[11px] font-semibold text-rose-500/80">{deal.merchant.name}</span>
                        </div>
                      )}

                      {/* 浮動在圖片上的泡泡標籤 */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                        {deal.isFlashDeal && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white bg-rose-500/95 backdrop-blur-md shadow-xs">
                            <Flame className="w-2.5 h-2.5 fill-current animate-pulse" />
                            <span>快閃</span>
                          </span>
                        )}
                        {discountInfo.percentage > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black text-rose-700 bg-white/95 backdrop-blur-md shadow-xs border border-rose-100">
                            {discountInfo.discountString}
                          </span>
                        )}
                      </div>

                      {/* 倒數計時小膠囊 */}
                      {!timeInfo.isExpired && (
                        <div className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-800 bg-white/90 backdrop-blur-md shadow-xs">
                          <Clock className="w-2.5 h-2.5 text-amber-600" />
                          <span>{timeInfo.text}</span>
                        </div>
                      )}
                    </div>

                    {/* 📌 特價標題 */}
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2 mb-1.5 px-2">
                      {deal.title}
                    </h3>

                    {/* 💰 核心價格 */}
                    <div className="flex items-baseline justify-between gap-1 px-2 mb-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-xl font-black text-rose-600 tracking-tight">
                          {formatPrice(deal.discountPrice ?? 0)}
                        </span>
                        {deal.originalPrice && deal.discountPrice && deal.originalPrice > deal.discountPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {deal.channelType === 'online' ? '線上電商' : '實體門市'}
                      </span>
                    </div>

                    {/* 🎯 條件與信用卡膠囊 */}
                    {(primaryCondition || primaryCard) && (
                      <div className="flex flex-wrap items-center gap-1 px-2 mb-2.5">
                        {primaryCondition && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-200/70 max-w-full">
                            <Target className="w-2.5 h-2.5 text-orange-500 flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{primaryCondition}</span>
                            {extraConditionCount > 0 && (
                              <span className="text-[9px] bg-orange-200/80 text-orange-800 px-1 rounded-full font-semibold">
                                +{extraConditionCount}
                              </span>
                            )}
                          </span>
                        )}
                        {primaryCard && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70 max-w-full">
                            <CreditCard className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate max-w-[100px]">{primaryCard}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* 底部：店家品牌與點擊編輯標籤 */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2 pb-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 truncate max-w-[65%]">
                        <Store className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="font-bold truncate">{deal.merchant.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 group-hover:underline flex items-center gap-0.5">
                        <Edit3 className="w-2.5 h-2.5" />
                        編輯資料
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部操作按鈕列 (Fixed Footer) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>所有特惠卡片已通過 Schema-First 驗證並即時寫入情報牆</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onViewDealsTab && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  onClose();
                  onViewDealsTab();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>前往後台卡片管理</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              onClick={() => triggerHaptic('medium')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>前往情報牆首頁查看</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 rounded-2xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="關閉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ✏️ 點擊卡片開啟之編輯資料 Modal */}
      {editingDeal && (
        <div 
          className="fixed inset-0 !m-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingDeal(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-rose-600" />
                  <span>編輯特價卡片資料</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">即時修改爬蟲抓取之特價情報與圖片資訊</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingDeal(null);
                  setTagError(null);
                  setNewTagInput('');
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">副標題 / 摘要</label>
                <input
                  type="text"
                  value={editingDeal.subtitle || ''}
                  onChange={(e) => setEditingDeal({ ...editingDeal, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">特價金額 ($)</label>
                  <input
                    type="number"
                    value={editingDeal.discountPrice ?? ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, discountPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">原價 ($)</label>
                  <input
                    type="number"
                    value={editingDeal.originalPrice ?? ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">計價單位</label>
                  <input
                    type="text"
                    value={editingDeal.priceUnit || '份'}
                    onChange={(e) => setEditingDeal({ ...editingDeal, priceUnit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">分類類別</label>
                  <select
                    value={editingDeal.category}
                    onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value as DealCategory })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="food">美食餐飲 (food)</option>
                    <option value="grocery">超商生活 (grocery)</option>
                    <option value="tech">3C 數位 (tech)</option>
                    <option value="fashion">服飾穿搭 (fashion)</option>
                    <option value="entertainment">休閒娛樂 (entertainment)</option>
                    <option value="travel">旅遊住宿 (travel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">通路模式</label>
                  <select
                    value={editingDeal.channelType}
                    onChange={(e) => setEditingDeal({ ...editingDeal, channelType: e.target.value as 'offline' | 'online' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="offline">實體門市 (offline)</option>
                    <option value="online">線上電商 (online)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">適用品項 (以逗號分隔)</label>
                <input
                  type="text"
                  value={editingDeal.targetItems.join(', ')}
                  onChange={(e) =>
                    setEditingDeal({
                      ...editingDeal,
                      targetItems: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">促銷條件 (以逗號分隔)</label>
                <input
                  type="text"
                  value={editingDeal.conditions.join(', ')}
                  onChange={(e) =>
                    setEditingDeal({
                      ...editingDeal,
                      conditions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* 🏷️ 標籤管理區塊 */}
              <div className="space-y-2">
                <label className="block text-slate-700">特惠標籤 (上限 8 個)</label>
                
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {(editingDeal.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      <TagIcon className="w-3 h-3 text-rose-500" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-900 ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!editingDeal.tags || editingDeal.tags.length === 0) && (
                    <span className="text-xs text-slate-400 py-0.5">尚未設定任何標籤</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => {
                      setNewTagInput(e.target.value);
                      setTagError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="輸入標籤名稱後點選新增 (例如：買一送一)"
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-all"
                  >
                    新增標籤
                  </button>
                </div>

                {tagError && <p className="text-xs text-rose-600 font-bold">{tagError}</p>}

                {/* 常用推薦標籤快速點選 */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block mb-1">常用推薦標籤（點擊直接加入）：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SUGGESTED_TAGS.map((sugTag) => {
                      const isSelected = (editingDeal.tags || []).includes(sugTag);
                      return (
                        <button
                          key={sugTag}
                          type="button"
                          disabled={isSelected}
                          onClick={() => handleAddTag(sugTag)}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border transition-all ${
                            isSelected
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-600 hover:text-rose-600 hover:border-rose-300 border-slate-200 cursor-pointer shadow-2xs'
                          }`}
                        >
                          {sugTag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 圖片管理與預覽 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700">圖片 URL (支援官網 / FB CDN 原圖)</label>
                  {editingDeal.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingDeal({ ...editingDeal, imageUrl: undefined })}
                      className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                    >
                      移除圖片
                    </button>
                  )}
                </div>

                <input
                  type="url"
                  value={editingDeal.imageUrl || ''}
                  onChange={(e) => setEditingDeal({ ...editingDeal, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none font-mono text-[11px]"
                />

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
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-rose-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-300 shadow-2xs transition-all cursor-pointer"
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
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-20 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-white/60">
                      <ImageIcon className="w-5 h-5 mb-1 text-slate-300" />
                      <span className="text-[11px]">尚未設定圖片（卡片將顯示預設圖樣）</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 狀態切換開關 */}
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingDeal.isHot || false}
                    onChange={(e) => setEditingDeal({ ...editingDeal, isHot: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    設為熱門主打
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingDeal.isFlashDeal || false}
                    onChange={(e) => setEditingDeal({ ...editingDeal, isFlashDeal: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    設為破盤快閃
                  </span>
                </label>
              </div>

              {/* 操作按鈕 */}
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
                  disabled={isSaving}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isSaving ? '儲存中...' : '儲存更新'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 放大檢視圖片 Lightbox Modal */}
      {previewImageEnlarged && (
        <div 
          className="fixed inset-0 !m-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImageEnlarged(null)}
        >
          <div 
            className="relative max-w-3xl w-full max-h-[85vh] bg-white rounded-3xl p-4 shadow-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-rose-600" />
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
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                另開分頁檢視
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
