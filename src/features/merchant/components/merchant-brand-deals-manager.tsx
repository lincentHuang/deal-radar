'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { 
  updateDealAction, 
  deleteDealAction, 
  toggleDealHotAction,
  batchDeleteDealsAction,
  batchToggleHotDealsAction
} from '@/features/deals/server/deal.actions';
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
  ExternalLink,
  CheckSquare,
  Square,
  MinusSquare,
  SlidersHorizontal,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';
import { MerchantCreateForm } from './merchant-create-form';
import { BatchEditModal } from '@/features/deals/components/batch-edit-modal';
import { DuplicateDealsModal } from '@/features/deals/components/duplicate-deals-modal';
import { 
  findDuplicateDeals, 
  loadDismissedPairs, 
  saveDismissedPairs, 
  getAllPairKeysInGroup 
} from '@/features/deals/utils/duplicate-detector';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchEditModalOpen, setIsBatchEditModalOpen] = useState<boolean>(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingDeal, setEditingDeal] = useState<SmartDeal | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [tagError, setTagError] = useState<string | null>(null);
  const [previewImageEnlarged, setPreviewImageEnlarged] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [dismissedPairs, setDismissedPairs] = useState<Set<string>>(() => loadDismissedPairs());
  
  // 分頁狀態
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const { triggerHaptic } = useMobileNative();

  // 當外部品牌或特價卡片更新時同步
  useEffect(() => {
    setDeals(brandDeals);
  }, [brandDeals]);

  // 當品牌或每頁筆數改變時重置回第 1 頁
  useEffect(() => {
    setCurrentPage(1);
  }, [brandName, pageSize]);

  // 智慧偵測本品牌重複特價情報（排除已確認保留配對，除非出現新情報）
  const duplicateGroups = useMemo(() => findDuplicateDeals(deals, dismissedPairs), [deals, dismissedPairs]);

  const handleDismissAllDuplicates = () => {
    triggerHaptic('success');
    const allKeys: string[] = [];
    duplicateGroups.forEach((g) => {
      const keys = getAllPairKeysInGroup(g.deals.map((d) => d.id));
      allKeys.push(...keys);
    });

    const newDismissed = new Set(dismissedPairs);
    allKeys.forEach((k) => newDismissed.add(k));
    saveDismissedPairs(newDismissed);
    setDismissedPairs(newDismissed);
    setFeedback({ text: `已全部保留【${brandName}】的 ${duplicateGroups.length} 組情報，後續不再提示比對！`, type: 'success' });
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
    setTagError(null);
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // 分頁計算
  const totalItems = deals.length;
  const effectivePageSize = pageSize === 999999 ? (totalItems || 1) : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * (pageSize === 999999 ? totalItems : pageSize);
  const endIndex = pageSize === 999999 ? totalItems : Math.min(startIndex + pageSize, totalItems);
  const paginatedDeals = pageSize === 999999 ? deals : deals.slice(startIndex, endIndex);

  // 頁碼陣列計算
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (validCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (validCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages];
  }, [totalPages, validCurrentPage]);

  const isAllSelected = paginatedDeals.length > 0 && paginatedDeals.every((d) => selectedIds.includes(d.id));
  const isSomeSelected = paginatedDeals.some((d) => selectedIds.includes(d.id)) && !isAllSelected;

  const handleSelectAll = () => {
    triggerHaptic('light');
    if (isAllSelected) {
      const pageIdSet = new Set(paginatedDeals.map((d) => d.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIdSet.has(id)));
    } else {
      const newSelected = new Set([...selectedIds, ...paginatedDeals.map((d) => d.id)]);
      setSelectedIds(Array.from(newSelected));
    }
  };

  const handleToggleSelect = (id: string) => {
    triggerHaptic('light');
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchToggleHot = async (isHot: boolean) => {
    if (selectedIds.length === 0) return;
    triggerHaptic('medium');
    const res = await batchToggleHotDealsAction(selectedIds, isHot);
    if (res.success) {
      const updatedMap = new Map(res.updatedDeals.map((d) => [d.id, d]));
      setDeals((prev) => prev.map((d) => updatedMap.get(d.id) || d));
      showFeedback(res.message);
      onDealsChange?.();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`確定要批量下架選取的 ${selectedIds.length} 筆特惠情報嗎？`)) return;
    triggerHaptic('warning');
    const res = await batchDeleteDealsAction(selectedIds);
    if (res.success) {
      const deletedIdSet = new Set(selectedIds);
      setDeals((prev) => prev.filter((d) => !deletedIdSet.has(d.id)));
      setSelectedIds([]);
      showFeedback(res.message);
      onDealsChange?.();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  const handleBatchEditSuccess = (updatedDeals: SmartDeal[], message: string) => {
    const updatedMap = new Map(updatedDeals.map((d) => [d.id, d]));
    setDeals((prev) => prev.map((d) => updatedMap.get(d.id) || d));
    setSelectedIds([]);
    showFeedback(message);
    onDealsChange?.();
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
      setSelectedIds((prev) => prev.filter((id) => id !== dealId));
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
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[60px]">
          <div className="flex items-center gap-3">
            {deals.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-all"
                title={isAllSelected ? '取消全選本頁' : '全選本頁卡片'}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : isSomeSelected ? (
                  <MinusSquare className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>全選</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  【{brandName}】官方優惠卡片管理
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  共 {totalItems} 筆
                </span>
                {selectedIds.length > 0 && (
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 animate-in fade-in">
                    已選取 {selectedIds.length} 筆
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                小編僅限瀏覽與管理屬於本品牌的特價活動
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap min-h-[36px]">
            {duplicateGroups.length > 0 && (
              <button
                type="button"
                onClick={() => setIsDuplicateModalOpen(true)}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                title="比對並清理重複情報"
              >
                <Copy className="w-3.5 h-3.5 text-amber-600" />
                <span>比對重複 ({duplicateGroups.length})</span>
              </button>
            )}

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBatchEditModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>批量編輯 ({selectedIds.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>單筆上架新卡片</span>
            </button>
          </div>
        </div>

        {/* 品牌重複情報提醒橫幅 */}
        {duplicateGroups.length > 0 && (
          <div className="mx-5 my-3 p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white font-bold flex-shrink-0 shadow-xs">
                <Copy className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-900">
                    偵測到【{brandName}】有 {duplicateGroups.length} 組可能重複的優惠情報
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                    小編建議處理
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  活動名稱或品項相符，可點擊「全部保留」直接忽略且不再提示，或點擊「立即比對保留」自選保留卡片
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
              <button
                type="button"
                onClick={handleDismissAllDuplicates}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-amber-300 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                title="全部保留且不再提示（直到有新的一樣情報時才再比對）"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>全部保留 (不再提示)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDuplicateModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>立即比對保留</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/25 text-[10px]">
                  {duplicateGroups.length} 組
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {paginatedDeals.length === 0 ? (
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
            paginatedDeals.map((deal) => {
              const isSelected = selectedIds.includes(deal.id);
              return (
                <div 
                  key={deal.id} 
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isSelected ? 'bg-emerald-50/40 hover:bg-emerald-50/60' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(deal.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center flex-shrink-0 mt-1 sm:mt-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>

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
              );
            })
          )}
        </div>

        {/* 分頁控制導覽列 */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* 左側：顯示目前筆數範圍 */}
          <div className="text-slate-500 font-medium">
            顯示第 <span className="font-bold text-slate-800">{totalItems === 0 ? 0 : startIndex + 1}</span> - <span className="font-bold text-slate-800">{endIndex}</span> 筆，共 <span className="font-bold text-slate-900">{totalItems}</span> 筆
          </div>

          {/* 中間：換頁按鈕組 */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={validCurrentPage === 1}
                onClick={() => {
                  triggerHaptic('light');
                  setCurrentPage(1);
                }}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 cursor-pointer disabled:cursor-not-allowed transition-all"
                title="第一頁"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={validCurrentPage === 1}
                onClick={() => {
                  triggerHaptic('light');
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 cursor-pointer disabled:cursor-not-allowed transition-all"
                title="上一頁"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {pageNumbers.map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 font-bold">
                        ...
                      </span>
                    );
                  }
                  const pageNum = Number(p);
                  const isActive = pageNum === validCurrentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setCurrentPage(pageNum);
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs scale-105'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={validCurrentPage === totalPages}
                onClick={() => {
                  triggerHaptic('light');
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 cursor-pointer disabled:cursor-not-allowed transition-all"
                title="下一頁"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={validCurrentPage === totalPages}
                onClick={() => {
                  triggerHaptic('light');
                  setCurrentPage(totalPages);
                }}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 cursor-pointer disabled:cursor-not-allowed transition-all"
                title="最後一頁"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 右側：每頁顯示筆數選擇器 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium whitespace-nowrap">每頁顯示：</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-white font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
            >
              <option value={20}>20 筆 / 頁</option>
              <option value={50}>50 筆 / 頁</option>
              <option value={100}>100 筆 / 頁</option>
              <option value={999999}>全部顯示</option>
            </select>
          </div>
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
          className="fixed inset-0 !m-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
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

      {/* 批量編輯 Modal */}
      <BatchEditModal
        isOpen={isBatchEditModalOpen}
        onClose={() => setIsBatchEditModalOpen(false)}
        selectedIds={selectedIds}
        selectedDeals={deals.filter((d) => selectedIds.includes(d.id))}
        isAdmin={false}
        onSuccess={handleBatchEditSuccess}
      />

      {/* 重複情報比對與清理 Modal */}
      <DuplicateDealsModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicateGroups={duplicateGroups}
        onResolved={(keptDeal, deletedIds, message) => {
          const deletedSet = new Set(deletedIds);
          setDeals((prev) => 
            prev
              .filter((d) => !deletedSet.has(d.id))
              .map((d) => (d.id === keptDeal.id ? keptDeal : d))
          );
          setSelectedIds((prev) => prev.filter((id) => !deletedSet.has(id)));
          showFeedback(message);
          onDealsChange?.();
        }}
        onDismissed={(newPairKeys, message) => {
          const newSet = new Set(dismissedPairs);
          newPairKeys.forEach((k) => newSet.add(k));
          setDismissedPairs(newSet);
          setFeedback({ text: message, type: 'success' });
        }}
      />

      {/* 底部浮動批量操作工具列 (Floating Batch Bar) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-wrap items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 max-w-[92vw]">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
            <span className="text-xs font-bold text-slate-300">已選取</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-slate-300">筆情報</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsBatchEditModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" />
              <span>批量編輯</span>
            </button>

            <button
              type="button"
              onClick={() => handleBatchToggleHot(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>設為熱門主打</span>
            </button>

            <button
              type="button"
              onClick={() => handleBatchToggleHot(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 border border-slate-700"
            >
              <span>取消主打</span>
            </button>

            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量下架</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer ml-1"
              title="取消選取"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

