'use client';

import React, { useState } from 'react';
import { SmartDeal } from '../types/deal.types';
import { 
  DuplicateDealGroup, 
  getAllPairKeysInGroup, 
  loadDismissedPairs, 
  saveDismissedPairs 
} from '../utils/duplicate-detector';
import { batchDeleteDealsAction, updateDealAction } from '../server/deal.actions';
import { 
  X, 
  Check, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Tag, 
  Store, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Layers, 
  ArrowRight,
  Flame,
  Zap,
  Combine,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';

interface DuplicateDealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateGroups: DuplicateDealGroup[];
  onResolved: (keptDeal: SmartDeal, deletedIds: string[], message: string) => void;
  onDismissed?: (dismissedPairKeys: string[], message: string) => void;
}

export const DuplicateDealsModal: React.FC<DuplicateDealsModalProps> = ({
  isOpen,
  onClose,
  duplicateGroups,
  onResolved,
  onDismissed,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedKeepIdMap, setSelectedKeepIdMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { triggerHaptic } = useMobileNative();

  if (!isOpen || duplicateGroups.length === 0) return null;

  const validIndex = Math.min(currentIndex, duplicateGroups.length - 1);
  const currentGroup = duplicateGroups[validIndex];
  if (!currentGroup) return null;

  // 取得目前群組中被選定要保留的 Deal ID (預設第一筆)
  const selectedKeepId = selectedKeepIdMap[currentGroup.id] || currentGroup.deals[0].id;
  const selectedKeepDeal = currentGroup.deals.find((d) => d.id === selectedKeepId) || currentGroup.deals[0];

  const handleSelectKeep = (dealId: string) => {
    triggerHaptic('light');
    setSelectedKeepIdMap((prev) => ({
      ...prev,
      [currentGroup.id]: dealId,
    }));
  };

  const handleNext = () => {
    triggerHaptic('light');
    if (currentIndex < duplicateGroups.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    triggerHaptic('light');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // 1. 全部保留此組 (不再提示比對，除非有新的一樣情報)
  const handleKeepAllCurrentGroup = () => {
    triggerHaptic('success');
    const pairKeys = getAllPairKeysInGroup(currentGroup.deals.map((d) => d.id));
    const currentDismissed = loadDismissedPairs();
    pairKeys.forEach((k) => currentDismissed.add(k));
    saveDismissedPairs(currentDismissed);

    const msg = `已全部保留此組 ${currentGroup.deals.length} 筆卡片，後續不再提示比對！`;
    onDismissed?.(pairKeys, msg);

    if (duplicateGroups.length <= 1) {
      onClose();
    } else if (currentIndex >= duplicateGroups.length - 1) {
      setCurrentIndex(Math.max(0, duplicateGroups.length - 2));
    }
  };

  // 2. 全部保留所有重複組 (不再提示比對)
  const handleKeepAllEveryGroup = () => {
    triggerHaptic('success');
    const allKeys: string[] = [];
    duplicateGroups.forEach((g) => {
      const keys = getAllPairKeysInGroup(g.deals.map((d) => d.id));
      allKeys.push(...keys);
    });

    const currentDismissed = loadDismissedPairs();
    allKeys.forEach((k) => currentDismissed.add(k));
    saveDismissedPairs(currentDismissed);

    const msg = `已全部保留所有 ${duplicateGroups.length} 組重複情報，後續不再提示比對！`;
    onDismissed?.(allKeys, msg);
    onClose();
  };

  // 3. 直接保留指定卡片並刪除其餘重複項目 (一鍵即時生效)
  const handleDirectKeep = async (keepDealId: string) => {
    const keepDeal = currentGroup.deals.find((d) => d.id === keepDealId) || selectedKeepDeal;
    const dealsToDelete = currentGroup.deals.filter((d) => d.id !== keepDealId);
    if (dealsToDelete.length === 0) return;

    setLoading(true);
    triggerHaptic('medium');

    const deleteIds = dealsToDelete.map((d) => d.id);
    const deleteRes = await batchDeleteDealsAction(deleteIds);

    setLoading(false);
    if (deleteRes.success) {
      triggerHaptic('success');
      onResolved(keepDeal, deleteIds, `已保留【${keepDeal.title.slice(0, 12)}...】，下架 ${deleteIds.length} 筆重複卡片！`);
      if (duplicateGroups.length <= 1) {
        onClose();
      } else if (currentIndex >= duplicateGroups.length - 1) {
        setCurrentIndex(Math.max(0, duplicateGroups.length - 2));
      }
    } else {
      triggerHaptic('warning');
    }
  };

  // 4. 保留目前所選卡片，刪除其餘重複項目
  const handleKeepSelected = async () => {
    await handleDirectKeep(selectedKeepId);
  };

  // 5. 合併標籤並保留所選卡片
  const handleMergeAndKeep = async () => {
    const dealsToDelete = currentGroup.deals.filter((d) => d.id !== selectedKeepId);
    if (dealsToDelete.length === 0) return;

    setLoading(true);
    triggerHaptic('medium');

    // 彙總所有卡片的標籤 (去重)
    const allTags = new Set<string>(selectedKeepDeal.tags || []);
    currentGroup.deals.forEach((d) => {
      (d.tags || []).forEach((t) => allTags.add(t));
    });

    const mergedTags = Array.from(allTags).slice(0, 8); // 上限 8 個

    // 更新目標卡片的標籤
    const updateRes = await updateDealAction(selectedKeepDeal.id, {
      tags: mergedTags,
    });

    // 刪除其餘重複卡片
    const deleteIds = dealsToDelete.map((d) => d.id);
    await batchDeleteDealsAction(deleteIds);

    setLoading(false);
    triggerHaptic('success');

    const updatedFinalDeal = updateRes.deal || { ...selectedKeepDeal, tags: mergedTags };
    onResolved(updatedFinalDeal, deleteIds, `已合併標籤並保留【${selectedKeepDeal.title.slice(0, 12)}...】，下架 ${deleteIds.length} 筆重複卡片！`);
    if (duplicateGroups.length <= 1) {
      onClose();
    } else if (currentIndex >= duplicateGroups.length - 1) {
      setCurrentIndex(Math.max(0, duplicateGroups.length - 2));
    }
  };

  return (
    <div className="fixed inset-0 !m-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0 gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white font-bold">
                <Copy className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-slate-900">
                重複情報比對與清理
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                第 {validIndex + 1} / {duplicateGroups.length} 組
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                {currentGroup.merchantName}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">判定依據：</span>
              {currentGroup.matchedFields.includes('name') && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-extrabold">
                  ✓ 活動名稱相符 (完全一致/容錯1字)
                </span>
              )}
              {currentGroup.matchedFields.includes('item') && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                  ✓ 商品品項相符 {currentGroup.sharedItems && currentGroup.sharedItems.length > 0 && `(${currentGroup.sharedItems.join(', ')})`} (完全一致/容錯1字)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {duplicateGroups.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={validIndex === 0}
                  className="p-1.5 rounded-xl hover:bg-white disabled:opacity-30 text-slate-700 cursor-pointer disabled:cursor-not-allowed transition-all"
                  title="上一組"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-slate-600 px-1">
                  {validIndex + 1}/{duplicateGroups.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={validIndex === duplicateGroups.length - 1}
                  className="p-1.5 rounded-xl hover:bg-white disabled:opacity-30 text-slate-700 cursor-pointer disabled:cursor-not-allowed transition-all"
                  title="下一組"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 提示導引 */}
        <div className="py-2.5 px-3.5 my-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              若需保留所有項目，請點選<strong>「全部保留」</strong>（系統將記錄並<strong>不再提示</strong>，除非有新情報）。或選定欲保留者下架其餘：
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-700 flex-shrink-0">
            共 {currentGroup.deals.length} 筆候選項目
          </span>
        </div>

        {/* 候選卡片並排比對區塊 */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentGroup.deals.map((deal, idx) => {
              const isSelected = deal.id === selectedKeepId;
              const hasImage = Boolean(deal.imageUrl);

              return (
                <div
                  key={deal.id}
                  onClick={() => handleSelectKeep(deal.id)}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-rose-50/30 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* 選取標記徽章 */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs font-black ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                        {isSelected ? '★ 選定保留此筆' : `候選項目 #${idx + 1}`}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {deal.id.slice(0, 12)}...
                    </span>
                  </div>

                  {/* 內容詳情 */}
                  <div className="py-3 space-y-3 flex-1">
                    <div className="flex items-start gap-3">
                      {deal.imageUrl ? (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-100">
                          <Image src={deal.imageUrl} alt={deal.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                          <Tag className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-black text-slate-900 text-sm line-clamp-2 leading-tight">
                          {deal.title}
                        </h4>
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-rose-600 text-base">
                            ${deal.discountPrice}
                          </span>
                          {deal.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ${deal.originalPrice}
                            </span>
                          )}
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase">
                            {deal.channelType === 'online' ? '線上' : '實體'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">
                          通路：{deal.merchant.name} · {deal.category}
                        </span>
                      </div>
                    </div>

                    {/* 品項與促銷條件 */}
                    <div className="bg-slate-50 p-2.5 rounded-2xl space-y-1 text-xs">
                      <div className="flex items-start gap-1">
                        <span className="text-slate-400 font-bold flex-shrink-0">品項：</span>
                        <span className="text-slate-800 font-semibold line-clamp-1">
                          {deal.targetItems.join(', ') || '無'}
                        </span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-slate-400 font-bold flex-shrink-0">條件：</span>
                        <span className="text-slate-600 line-clamp-1">
                          {deal.conditions.join(' · ') || '無'}
                        </span>
                      </div>
                    </div>

                    {/* 標籤清單 */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {(deal.tags || []).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {tag}
                        </span>
                      ))}
                      {(!deal.tags || deal.tags.length === 0) && (
                        <span className="text-[10px] text-slate-400">尚未設定標籤</span>
                      )}
                    </div>
                  </div>

                  {/* 來源與狀態標記 */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold">
                      來源：{deal.source === 'official' ? '🤖 官方爬蟲' : deal.source === 'merchant_post' ? '🏪 小編發布' : '💬 社群情報'}
                    </span>
                    <div className="flex items-center gap-1">
                      {deal.isHot && <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">🔥 熱門</span>}
                      {deal.isFlashDeal && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">⚡ 快閃</span>}
                    </div>
                  </div>

                  {/* 一鍵保留快捷按鈕 */}
                  <div className="pt-3 border-t border-slate-100 mt-1">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectKeep(deal.id);
                      }}
                      className={`w-full py-2 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                        isSelected
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSelected ? '★ 確定保留此筆 (下架其餘)' : '保留這筆，下架其餘'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer 操作按鈕 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={loading}
              onClick={handleKeepAllCurrentGroup}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="全部保留本組卡片，且後續不再提醒比對（除非有新情報）"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>全部保留此組 (不再提示)</span>
            </button>

            {duplicateGroups.length > 1 && (
              <button
                type="button"
                disabled={loading}
                onClick={handleKeepAllEveryGroup}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="一次將所有重複群組全部保留並忽略"
              >
                <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>全部保留全部 ({duplicateGroups.length} 組)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={handleMergeAndKeep}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="合併所有候選項目的標籤並保留此筆"
            >
              <Combine className="w-3.5 h-3.5 text-indigo-600" />
              <span>合併標籤並保留</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleKeepSelected}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>保留選定，下架其餘 ({currentGroup.deals.length - 1})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

