'use client';

import React, { useState } from 'react';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { batchUpdateDealsAction } from '@/features/deals/server/deal.actions';
import { 
  X, 
  Tag, 
  Plus, 
  Percent, 
  DollarSign, 
  Layers, 
  Store, 
  Flame, 
  Zap, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

const POPULAR_SUGGESTED_TAGS = [
  '#買一送一',
  '#限時特惠',
  '#超商限定',
  '#LINEPay',
  '#第二件5折',
  '#會員專屬',
  '#全台門市',
  '#新品上市',
  '#滿額折抵',
  '#週末限定',
];

interface BatchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  selectedDeals: SmartDeal[];
  isAdmin?: boolean;
  onSuccess: (updatedDeals: SmartDeal[], message: string) => void;
}

type TabKey = 'tags' | 'price' | 'category' | 'conditions' | 'status';

export const BatchEditModal: React.FC<BatchEditModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  selectedDeals,
  isAdmin = false,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('tags');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { triggerHaptic } = useMobileNative();

  // 1. 標籤管理狀態
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const [tagsToRemove, setTagsToRemove] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [tagMode, setTagMode] = useState<'add' | 'remove'>('add');

  // 2. 價格調整狀態
  const [priceAdjustmentType, setPriceAdjustmentType] = useState<'none' | 'set' | 'discount_percent' | 'discount_amount'>('none');
  const [priceValue, setPriceValue] = useState<string>('');

  // 3. 分類與通路
  const [category, setCategory] = useState<string>('keep');
  const [channelType, setChannelType] = useState<'keep' | 'offline' | 'online'>('keep');

  // 4. 促銷條件
  const [conditionMode, setConditionMode] = useState<'keep' | 'add' | 'replace'>('keep');
  const [conditionInput, setConditionInput] = useState<string>('');

  // 5. 狀態標記
  const [hotState, setHotState] = useState<'keep' | 'enable' | 'disable'>('keep');
  const [flashState, setFlashState] = useState<'keep' | 'enable' | 'disable'>('keep');

  if (!isOpen) return null;

  const handleAddTag = (raw?: string) => {
    const text = (raw || tagInput).trim();
    if (!text) return;
    const formatted = text.startsWith('#') ? text : `#${text}`;

    if (tagMode === 'add') {
      if (!tagsToAdd.includes(formatted)) {
        setTagsToAdd([...tagsToAdd, formatted]);
        triggerHaptic('light');
      }
    } else {
      if (!tagsToRemove.includes(formatted)) {
        setTagsToRemove([...tagsToRemove, formatted]);
        triggerHaptic('light');
      }
    }
    setTagInput('');
  };

  const handleRemoveChip = (tag: string, mode: 'add' | 'remove') => {
    triggerHaptic('light');
    if (mode === 'add') {
      setTagsToAdd(tagsToAdd.filter((t) => t !== tag));
    } else {
      setTagsToRemove(tagsToRemove.filter((t) => t !== tag));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    setLoading(true);
    setErrorMessage(null);
    triggerHaptic('medium');

    const options: any = {};

    // 標籤
    if (tagsToAdd.length > 0) options.tagsToAdd = tagsToAdd;
    if (tagsToRemove.length > 0) options.tagsToRemove = tagsToRemove;

    // 分類
    if (category !== 'keep') options.category = category;

    // 通路
    if (channelType !== 'keep') options.channelType = channelType;

    // 價格
    if (priceAdjustmentType !== 'none' && priceValue && Number(priceValue) > 0) {
      options.priceAdjustment = {
        type: priceAdjustmentType,
        value: Number(priceValue),
      };
    }

    // 條件
    if (conditionMode === 'add' && conditionInput.trim()) {
      options.addConditions = conditionInput.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean);
    } else if (conditionMode === 'replace' && conditionInput.trim()) {
      options.replaceConditions = conditionInput.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean);
    }

    // 狀態
    if (hotState === 'enable') options.isHot = true;
    if (hotState === 'disable') options.isHot = false;

    if (isAdmin) {
      if (flashState === 'enable') options.isFlashDeal = true;
      if (flashState === 'disable') options.isFlashDeal = false;
    }

    // 檢查是否有設定任何更新
    const hasAnyChange = 
      (options.tagsToAdd && options.tagsToAdd.length > 0) ||
      (options.tagsToRemove && options.tagsToRemove.length > 0) ||
      options.category !== undefined && options.category !== 'keep' ||
      options.channelType !== undefined && options.channelType !== 'keep' ||
      options.priceAdjustment ||
      options.addConditions ||
      options.replaceConditions ||
      options.isHot !== undefined ||
      options.isFlashDeal !== undefined;

    if (!hasAnyChange) {
      setErrorMessage('請至少設定一項要批量更新的欄位！');
      setLoading(false);
      triggerHaptic('warning');
      return;
    }

    const res = await batchUpdateDealsAction(selectedIds, options);

    setLoading(false);
    if (res.success) {
      triggerHaptic('success');
      onSuccess(res.updatedDeals, res.message);
      onClose();
    } else {
      setErrorMessage(res.message || '批量更新失敗');
      triggerHaptic('warning');
    }
  };

  return (
    <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-slate-900 text-white">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">批量編輯特價卡片</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black">
                已選取 {selectedIds.length} 筆
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              設定將同步套用至所有已勾選的特價卡片，未設定欄位將保持原狀
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab 頁籤切換 */}
        <div className="flex items-center gap-1.5 py-3 border-b border-slate-100 overflow-x-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('tags');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'tags'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>標籤管理 {(tagsToAdd.length > 0 || tagsToRemove.length > 0) && '•'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('price');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'price'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>價格與折扣 {priceAdjustmentType !== 'none' && '•'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('category');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'category'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>分類與通路 {(category !== 'keep' || channelType !== 'keep') && '•'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('conditions');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'conditions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>促銷條件 {conditionMode !== 'keep' && '•'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('status');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
              activeTab === 'status'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>狀態標記 {(hotState !== 'keep' || flashState !== 'keep') && '•'}</span>
          </button>
        </div>

        {/* 錯誤訊息 */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 內容區塊 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs font-medium">
          {/* TAB 1: 標籤管理 */}
          {activeTab === 'tags' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">操作模式：</span>
                <button
                  type="button"
                  onClick={() => setTagMode('add')}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                    tagMode === 'add' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ＋ 批量追加標籤
                </button>
                <button
                  type="button"
                  onClick={() => setTagMode('remove')}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                    tagMode === 'remove' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ✕ 批量移除指定標籤
                </button>
              </div>

              {/* 輸入框 */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder={tagMode === 'add' ? '輸入要追加的標籤 (例如：買一送一) 按 Enter 或點新增' : '輸入要批量移除的標籤名稱 (例如：已售完)'}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>加入清單</span>
                </button>
              </div>

              {/* 待追加標籤清單 */}
              {tagsToAdd.length > 0 && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                  <span className="text-[11px] font-extrabold text-emerald-800 block">
                    ✓ 將批量追加到選取卡片（每張上限 8 個）：
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tagsToAdd.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-extrabold shadow-2xs"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChip(tag, 'add')}
                          className="hover:bg-emerald-100 p-0.5 rounded text-emerald-600 hover:text-emerald-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 待移除標籤清單 */}
              {tagsToRemove.length > 0 && (
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1.5">
                  <span className="text-[11px] font-extrabold text-rose-800 block">
                    ✕ 將自選取卡片中批量移除：
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tagsToRemove.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-rose-300 text-rose-800 rounded-lg text-xs font-extrabold shadow-2xs"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChip(tag, 'remove')}
                          className="hover:bg-rose-100 p-0.5 rounded text-rose-600 hover:text-rose-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 快速推薦標籤 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400">快速點選常用推薦標籤：</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SUGGESTED_TAGS.map((sugTag) => {
                    const isSelected = tagsToAdd.includes(sugTag) || tagsToRemove.includes(sugTag);
                    return (
                      <button
                        key={sugTag}
                        type="button"
                        onClick={() => handleAddTag(sugTag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-default'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        + {sugTag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 價格與折扣 */}
          {activeTab === 'price' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">價格調整模式：</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPriceAdjustmentType('none');
                      setPriceValue('');
                    }}
                    className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      priceAdjustmentType === 'none'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs">不修改價格</div>
                    <div className="text-[10px] opacity-70 mt-0.5">保持每張卡片既有價格</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriceAdjustmentType('set')}
                    className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      priceAdjustmentType === 'set'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs">統一設定特惠價 ($)</div>
                    <div className="text-[10px] opacity-70 mt-0.5">例如全體變更為 $99</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriceAdjustmentType('discount_percent')}
                    className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      priceAdjustmentType === 'discount_percent'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs">全體百分比折扣 (%)</div>
                    <div className="text-[10px] opacity-70 mt-0.5">例如輸入 80 表示打 8 折</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriceAdjustmentType('discount_amount')}
                    className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      priceAdjustmentType === 'discount_amount'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs">全體現折固定金額 ($)</div>
                    <div className="text-[10px] opacity-70 mt-0.5">例如輸入 20 表示每筆折 $20</div>
                  </button>
                </div>
              </div>

              {priceAdjustmentType !== 'none' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-800 font-bold">
                      {priceAdjustmentType === 'set' && '請輸入統一特價金額 (NT$)'}
                      {priceAdjustmentType === 'discount_percent' && '請輸入折扣比例 (% 例如 85 表示 85 折)'}
                      {priceAdjustmentType === 'discount_amount' && '請輸入立折金額 (NT$ 例如 30)'}
                    </label>
                  </div>

                  <input
                    type="number"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    placeholder={
                      priceAdjustmentType === 'set' ? '例如：99' :
                      priceAdjustmentType === 'discount_percent' ? '例如：80 (打八折)' : '例如：20'
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-black text-rose-600 text-sm focus:border-rose-500 focus:outline-none"
                    min="1"
                    required
                  />

                  {priceAdjustmentType === 'discount_percent' && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-bold">常用折扣：</span>
                      {[50, 70, 80, 85, 90].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setPriceValue(pct.toString())}
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          {pct === 50 ? '5 折 (半價)' : `${pct / 10} 折`}
                        </button>
                      ))}
                    </div>
                  )}

                  {priceAdjustmentType === 'discount_amount' && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-bold">常用立折：</span>
                      {[10, 20, 30, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setPriceValue(amt.toString())}
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          折 ${amt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 分類與通路 */}
          {activeTab === 'category' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">全域分類變更</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none"
                >
                  <option value="keep">保持各自原分類 (不修改)</option>
                  <option value="food">🍱 美食餐飲 (food)</option>
                  <option value="grocery">🏪 超商生活 (grocery)</option>
                  <option value="tech">💻 3C 數位 (tech)</option>
                  <option value="fashion">👗 服飾穿搭 (fashion)</option>
                  <option value="entertainment">🎮 休閒娛樂 (entertainment)</option>
                  <option value="travel">✈️ 旅遊住宿 (travel)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">通路模式變更</label>
                <select
                  value={channelType}
                  onChange={(e) => setChannelType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none"
                >
                  <option value="keep">保持各自原通路 (不修改)</option>
                  <option value="offline">🏬 實體門市 (offline)</option>
                  <option value="online">🌐 線上電商 (online)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 4: 促銷條件 */}
          {activeTab === 'conditions' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">促銷條件調整模式：</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConditionMode('keep')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      conditionMode === 'keep' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    保持原條件
                  </button>
                  <button
                    type="button"
                    onClick={() => setConditionMode('add')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      conditionMode === 'add' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    ＋ 追加促銷條件
                  </button>
                  <button
                    type="button"
                    onClick={() => setConditionMode('replace')}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      conditionMode === 'replace' ? 'bg-rose-600 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    ⟳ 覆蓋所有條件
                  </button>
                </div>
              </div>

              {conditionMode !== 'keep' && (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-bold">
                    {conditionMode === 'add' ? '請輸入要追加的促銷條件 (逗號或換行分隔)：' : '請輸入新的統一條件 (逗號或換行分隔)：'}
                  </label>
                  <textarea
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    placeholder="例如：會員專屬優惠、每人限購 2 組、限時限量售完為止"
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['同商品第2件5折', '買一送一', '限使用LINE Pay', '全台門市適用', '限時限量 售完為止'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setConditionInput((prev) => prev ? `${prev}, ${c}` : c);
                        }}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-600 cursor-pointer"
                      >
                        + {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: 狀態標記 */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span className="font-bold text-slate-800">熱門推薦狀態 (isHot)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setHotState('keep')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hotState === 'keep' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    保持原狀
                  </button>
                  <button
                    type="button"
                    onClick={() => setHotState('enable')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hotState === 'enable' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    🔥 全體設為熱門
                  </button>
                  <button
                    type="button"
                    onClick={() => setHotState('disable')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hotState === 'disable' ? 'bg-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    取消熱門
                  </button>
                </div>
              </div>

              {isAdmin && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-800">破盤快閃狀態 (isFlashDeal - 管理員專屬)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFlashState('keep')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        flashState === 'keep' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      保持原狀
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlashState('enable')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        flashState === 'enable' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      ⚡ 全體設為快閃
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlashState('disable')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        flashState === 'disable' ? 'bg-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      取消快閃
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer 操作按鈕 */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all flex items-center gap-1.5"
            >
              {loading ? (
                <span>處理中...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>確認套用至 {selectedIds.length} 筆卡片</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
