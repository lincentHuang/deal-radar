'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { 
  updateDealAction, 
  deleteDealAction, 
  toggleDealHotAction, 
  toggleDealFlashAction,
  batchDeleteDealsAction,
  batchToggleHotDealsAction,
  batchToggleFlashDealsAction
} from '@/features/deals/server/deal.actions';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Flame, 
  Zap, 
  ExternalLink, 
  Check, 
  X, 
  Store, 
  Calendar, 
  Tag, 
  DollarSign,
  AlertCircle,
  ImageIcon,
  Maximize2,
  Eye,
  Sparkles,
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
import { MerchantCreateForm } from '@/features/merchant/components/merchant-create-form';
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

interface AdminDealManagerProps {
  initialDeals: SmartDeal[];
  onDealsChange?: () => void;
}

export const AdminDealManager: React.FC<AdminDealManagerProps> = ({ initialDeals, onDealsChange }) => {
  const [deals, setDeals] = useState<SmartDeal[]>(initialDeals);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchEditModalOpen, setIsBatchEditModalOpen] = useState<boolean>(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [editingDeal, setEditingDeal] = useState<SmartDeal | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [tagError, setTagError] = useState<string | null>(null);
  const [previewImageEnlarged, setPreviewImageEnlarged] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [dismissedPairs, setDismissedPairs] = useState<Set<string>>(() => loadDismissedPairs());
  
  // 分頁狀態
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const { triggerHaptic } = useMobileNative();

  // 當外部資料庫更新或 Props 變動時同步最新列表
  useEffect(() => {
    setDeals(initialDeals);
  }, [initialDeals]);

  // 當篩選條件或每頁筆數改變時重置回第 1 頁
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, sourceFilter, pageSize]);

  // 智慧偵測重複活動群組（排除已審核保留之配對，除非出現新情報）
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
    showFeedback(`已將全部 ${duplicateGroups.length} 組情報標記為保留，後續不再提示比對！`);
  };

  const handleAddTag = (tagToAdd?: string) => {
    if (!editingDeal) return;
    const rawTag = (tagToAdd || newTagInput).trim();
    if (!rawTag) return;

    // 清理標籤格式，自動補上 #，移除多餘標點符號
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
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const filteredDeals = deals.filter((d) => {
    const rawQ = searchQuery.trim();
    let matchesQuery = true;
    if (rawQ) {
      const terms = rawQ
        .split(/[\s,，、]+/)
        .map((t) => t.trim().replace(/^#/, '').toLowerCase())
        .filter(Boolean);
      
      if (terms.length > 0) {
        matchesQuery = terms.every((term) =>
          d.title.toLowerCase().includes(term) ||
          d.merchant.name.toLowerCase().includes(term) ||
          d.tags.some((t) => t.toLowerCase().replace(/^#/, '').includes(term)) ||
          d.targetItems.some((item) => item.toLowerCase().includes(term))
        );
      }
    }
    
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSource = sourceFilter === 'all' || d.source === sourceFilter;

    return matchesQuery && matchesCategory && matchesSource;
  });

  // 分頁計算
  const totalItems = filteredDeals.length;
  const effectivePageSize = pageSize === 999999 ? (totalItems || 1) : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * (pageSize === 999999 ? totalItems : pageSize);
  const endIndex = pageSize === 999999 ? totalItems : Math.min(startIndex + pageSize, totalItems);
  const paginatedDeals = pageSize === 999999 ? filteredDeals : filteredDeals.slice(startIndex, endIndex);

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

  // 全選狀態 (針對當前頁面資料)
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

  const handleBatchToggleFlash = async (isFlashDeal: boolean) => {
    if (selectedIds.length === 0) return;
    triggerHaptic('medium');
    const res = await batchToggleFlashDealsAction(selectedIds, isFlashDeal);
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
    if (!confirm(`確定要批量下架並刪除選取的 ${selectedIds.length} 筆特價卡片嗎？此操作將即時自情報站移除。`)) {
      return;
    }
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
      showFeedback(`已切換【${res.deal.title.slice(0, 10)}...】熱門推薦狀態`);
      onDealsChange?.();
    }
  };

  const handleToggleFlash = async (dealId: string) => {
    triggerHaptic('light');
    const res = await toggleDealFlashAction(dealId);
    if (res.success && res.deal) {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? res.deal! : d)));
      showFeedback(`已切換【${res.deal.title.slice(0, 10)}...】破盤快閃狀態`);
      onDealsChange?.();
    }
  };

  const handleDelete = async (dealId: string, title: string) => {
    if (!confirm(`確定要刪除「${title}」這張特價卡片嗎？此操作將即時自情報站下架。`)) {
      return;
    }
    triggerHaptic('warning');
    const res = await deleteDealAction(dealId);
    if (res.success) {
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
      setSelectedIds((prev) => prev.filter((id) => id !== dealId));
      showFeedback(`已成功下架並刪除卡片`);
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
      originalPrice: editingDeal.originalPrice,
      discountPrice: editingDeal.discountPrice,
      category: editingDeal.category,
      channelType: editingDeal.channelType,
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
      showFeedback('卡片資料已成功更新並同步！');
      onDealsChange?.();
    } else {
      showFeedback(res.message || '更新失敗', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 頂部操作欄 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          {/* 搜尋 */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋標題、店家、標籤..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs font-semibold text-slate-800 rounded-2xl border border-slate-200 focus:border-rose-500 focus:outline-none transition-all"
            />
          </div>

          {/* 分類篩選 */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 rounded-2xl border border-slate-200 focus:outline-none"
          >
            <option value="all">全部分類</option>
            <option value="food">美食餐飲 (food)</option>
            <option value="grocery">超商生活 (grocery)</option>
            <option value="tech">3C 數位 (tech)</option>
            <option value="fashion">服飾穿搭 (fashion)</option>
            <option value="entertainment">休閒娛樂</option>
            <option value="travel">旅遊住宿</option>
          </select>

          {/* 來源篩選 */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 text-xs font-bold text-slate-700 rounded-2xl border border-slate-200 focus:outline-none"
          >
            <option value="all">全部來源</option>
            <option value="official">官方爬蟲 (official)</option>
            <option value="merchant_post">商家/小編發布 (merchant_post)</option>
            <option value="social_listening">社群情報 (social_listening)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {duplicateGroups.length > 0 && (
            <button
              type="button"
              onClick={() => setIsDuplicateModalOpen(true)}
              className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              title="查看並清理重複卡片"
            >
              <Copy className="w-3.5 h-3.5 text-amber-600" />
              <span>比對重複 ({duplicateGroups.length})</span>
            </button>
          )}

          {/* 新增卡片按鈕 */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>手動新增卡片</span>
          </button>
        </div>
      </div>

      {/* 重複卡片智慧提醒橫幅 */}
      {duplicateGroups.length > 0 && (
        <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-500 text-white font-bold flex-shrink-0 shadow-xs">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-slate-900">
                  系統智慧偵測到 {duplicateGroups.length} 組可能重複的特價情報
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                  建議處理
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                活動名稱或商品品項高度吻合，可點擊「全部保留」直接忽略並不不再提示，或點擊「立即比對保留」自選保留卡片
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
            <button
              type="button"
              onClick={handleDismissAllDuplicates}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-amber-300 text-slate-700 text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="全部保留且不再提示（直到有新的一樣情報時才再比對）"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>全部保留 (不再提示)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDuplicateModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>立即比對保留</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/25 text-[10px]">
                {duplicateGroups.length} 組
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 回饋訊息 */}
      {actionMessage && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {actionMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 卡片清單表格 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[60px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-slate-900">特價卡片清單</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              共 {filteredDeals.length} 筆
            </span>
            {selectedIds.length > 0 && (
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-in fade-in">
                已選取 {selectedIds.length} 筆
              </span>
            )}
          </div>

          {/* 批量操作快捷按鈕 */}
          <div className="flex items-center gap-2 min-h-[32px]">
            {selectedIds.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setIsBatchEditModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>批量編輯 ({selectedIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  取消選取
                </button>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center"
                    title={isAllSelected ? '取消全選本頁' : '全選目前頁面卡片'}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-rose-600" />
                    ) : isSomeSelected ? (
                      <MinusSquare className="w-4 h-4 text-rose-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">商品與活動</th>
                <th className="py-3 px-4">品牌通路</th>
                <th className="py-3 px-4">特惠價格</th>
                <th className="py-3 px-4">品項與條件</th>
                <th className="py-3 px-4">狀態標記</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedDeals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    📭 無符合條件的特價卡片
                  </td>
                </tr>
              ) : (
                paginatedDeals.map((deal) => {
                  const isSelected = selectedIds.includes(deal.id);
                  return (
                    <tr 
                      key={deal.id} 
                      className={`transition-colors ${
                        isSelected ? 'bg-rose-50/40 hover:bg-rose-50/60' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 w-10">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(deal.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                      </td>

                      {/* 商品與活動 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          {deal.imageUrl ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                              <Image
                                src={deal.imageUrl}
                                alt={deal.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                              <Tag className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 line-clamp-1">{deal.title}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>ID: {deal.id.slice(0, 16)}...</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase font-mono">{deal.category}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 品牌通路 */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{deal.merchant.name}</span>
                          <span className="text-[10px] text-slate-400">{deal.channelType === 'online' ? '🌐 線上電商' : '🏬 實體門市'}</span>
                        </div>
                      </td>

                      {/* 特惠價格 */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-rose-600 text-sm">
                            ${deal.discountPrice ?? '--'}
                          </span>
                          {deal.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ${deal.originalPrice}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 品項與條件 */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col max-w-[220px]">
                          <span className="text-slate-800 line-clamp-1 font-semibold">
                            {deal.targetItems.join(', ')}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {deal.conditions.join(' · ')}
                          </span>
                        </div>
                      </td>

                      {/* 狀態標記 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {/* 熱門開關 */}
                          <button
                            type="button"
                            onClick={() => handleToggleHot(deal.id)}
                            title="切換熱門狀態"
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              deal.isHot
                                ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>

                          {/* 快閃開關 */}
                          <button
                            type="button"
                            onClick={() => handleToggleFlash(deal.id)}
                            title="切換快閃狀態"
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              deal.isFlashDeal
                                ? 'bg-amber-50 border-amber-200 text-amber-600 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* 操作 */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingDeal(deal)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                            title="編輯卡片"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(deal.id, deal.title)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                            title="下架刪除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁控制導覽列 (Pagination Bar) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* 左側：顯示目前筆數範圍 */}
          <div className="text-slate-500 font-medium">
            顯示第 <span className="font-bold text-slate-800">{totalItems === 0 ? 0 : startIndex + 1}</span> - <span className="font-bold text-slate-800">{endIndex}</span> 筆，共 <span className="font-bold text-slate-900">{totalItems}</span> 筆
          </div>

          {/* 中間：換頁按鈕組 */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* 第一頁 */}
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

              {/* 上一頁 */}
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

              {/* 頁碼按鈕 */}
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
                          ? 'bg-rose-600 text-white shadow-xs scale-105'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* 下一頁 */}
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

              {/* 最後一頁 */}
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
              className="px-2.5 py-1.5 bg-white font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 shadow-2xs cursor-pointer"
            >
              <option value={20}>20 筆 / 頁</option>
              <option value={50}>50 筆 / 頁</option>
              <option value={100}>100 筆 / 頁</option>
              <option value={999999}>全部顯示</option>
            </select>
          </div>
        </div>
      </div>


      {/* 編輯卡片 Modal */}
      {editingDeal && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">編輯特價卡片資料</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">即時更新特價卡片價格、標籤、品項與圖片</p>
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600 focus:bg-white focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">原價 ($)</label>
                  <input
                    type="number"
                    value={editingDeal.originalPrice || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, originalPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">通路模式</label>
                <select
                  value={editingDeal.channelType}
                  onChange={(e) => setEditingDeal({ ...editingDeal, channelType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="offline">實體門市 (offline)</option>
                  <option value="online">線上通路 (online)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">適用品項 (逗號分隔)</label>
                <input
                  type="text"
                  value={editingDeal.targetItems.join(', ')}
                  onChange={(e) => setEditingDeal({ ...editingDeal, targetItems: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">促銷條件 (逗號分隔)</label>
                <input
                  type="text"
                  value={editingDeal.conditions.join(', ')}
                  onChange={(e) => setEditingDeal({ ...editingDeal, conditions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold shadow-2xs group animate-in fade-in zoom-in-95 duration-150"
                      >
                        <span>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-rose-200/80 p-0.5 rounded-md text-rose-500 hover:text-rose-800 transition-all cursor-pointer"
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
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium"
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
                              : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-transparent text-slate-600 cursor-pointer'
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />

                {/* 圖片檢視區塊 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      卡片圖片檢視
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
                          const fallback = document.getElementById('admin-image-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div
                        id="admin-image-fallback"
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
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer shadow-sm transition-all"
                >
                  儲存修改
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
                <Eye className="w-4 h-4 text-rose-500" />
                特價卡片原圖檢視
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

      {/* 手動新增卡片 Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">管理者新增特價情報卡片</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <MerchantCreateForm onCreated={() => {
              setIsAddModalOpen(false);
              showFeedback('已成功手動發布新特價卡片！');
              onDealsChange?.();
            }} />
          </div>
        </div>
      )}

      {/* 批量編輯 Modal */}
      <BatchEditModal
        isOpen={isBatchEditModalOpen}
        onClose={() => setIsBatchEditModalOpen(false)}
        selectedIds={selectedIds}
        selectedDeals={deals.filter((d) => selectedIds.includes(d.id))}
        isAdmin={true}
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
          showFeedback(message);
        }}
      />

      {/* 底部浮動批量操作工具列 (Floating Batch Bar) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-wrap items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 max-w-[92vw]">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
            <span className="text-xs font-bold text-slate-300">已選取</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-slate-300">筆卡片</span>
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
              <span>設為熱門</span>
            </button>

            <button
              type="button"
              onClick={() => handleBatchToggleFlash(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>設為快閃</span>
            </button>

            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量刪除</span>
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

