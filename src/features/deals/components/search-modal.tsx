'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import {
  dealFiltersAtom,
  isSearchModalOpenAtom,
  subscribedTagsAtom
} from '@/features/subscriptions/atoms/subscription-atoms';
import {
  Search,
  X,
  Sparkles,
  Flame,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

const POPULAR_SEARCH_TAGS = [
  '買一送一',
  '咖啡',
  '星巴克',
  '全家',
  '7-ELEVEN',
  '冰淇淋',
  '第二件5折',
  '速食',
  'LINE Pay',
  '全聯',
  '麥當勞',
  '好市多'
];

export const SearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isSearchModalOpenAtom);
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [subscribedTags] = useAtom(subscribedTagsAtom);
  const [inputVal, setInputVal] = useState(filters.searchQuery || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { triggerHaptic } = useMobileNative();

  useEffect(() => {
    if (isOpen) {
      setInputVal(filters.searchQuery || '');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, filters.searchQuery]);

  const handleExecuteSearch = (queryToSearch: string) => {
    triggerHaptic('medium');
    const trimmed = queryToSearch.trim();
    // 搜尋時標籤自動切換為全部 (selectedTag: null)
    setFilters((prev) => ({
      ...prev,
      searchQuery: trimmed,
      selectedTag: null,
    }));

    setIsOpen(false);

    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(inputVal);
  };

  const handleQuickTagClick = (tag: string) => {
    triggerHaptic('light');
    const clean = tag.replace(/^#/, '');
    
    // 如果輸入框已有內容且不包含該標籤，則以空白追加多標籤；若無內容則直接搜尋
    if (inputVal.trim()) {
      const tokens = inputVal.split(/[\s,，、]+/).map((t) => t.trim().replace(/^#/, ''));
      if (!tokens.includes(clean)) {
        const combined = `${inputVal.trim()} ${clean}`;
        setInputVal(combined);
        return;
      }
    }
    
    setInputVal(clean);
    handleExecuteSearch(clean);
  };

  const handleClear = () => {
    triggerHaptic('light');
    setInputVal('');
    inputRef.current?.focus();
  };

  // 當前輸入的 Token 解析預覽
  const currentTokens = inputVal
    .split(/[\s,，、]+/)
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl z-50 border border-slate-100 animate-scaleUp focus:outline-none max-h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center shadow-xs">
                <Search className="w-4 h-4" />
              </div>
              <Dialog.Title className="text-base sm:text-lg font-black text-slate-900">
                搜尋特價情報
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* 搜尋表單 */}
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-rose-500 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="輸入關鍵字或多標籤 (如: 咖啡 買一送一)"
                className="w-full pl-11 pr-10 py-3 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-sm font-semibold rounded-2xl border border-slate-200/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
              />
              {inputVal ? (
                <button
                  type="button"
                  onClick={handleClear}
                  title="清除"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-300/80 hover:bg-slate-400 text-white flex items-center justify-center text-xs transition-all active:scale-90 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
            </div>

            {/* 多標籤搜尋提示與 Token 預覽 */}
            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span>支援多關鍵字搜尋：可用「空白」或「逗號」區隔多個標籤與品項</span>
              </div>
              {currentTokens.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold">將同時搜尋：</span>
                  {currentTokens.map((token, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-600 border border-rose-200 shadow-xs"
                    >
                      #{token}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 熱門 / 推薦標籤快速點擊 */}
            <div className="mt-2 flex-1 overflow-y-auto max-h-[36vh] no-scrollbar">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-2.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>熱門特惠標籤 (點擊立即搜尋或追加)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCH_TAGS.map((tag) => {
                  const isSelected = currentTokens.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQuickTagClick(tag)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs border ${
                        isSelected
                          ? 'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-300/60'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-rose-300'
                      }`}
                    >
                      <Tag className="w-3 h-3 text-rose-400" />
                      <span>#{tag}</span>
                    </button>
                  );
                })}
              </div>

              {/* 我的訂閱標籤 */}
              {subscribedTags.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>我的追蹤標籤</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subscribedTags.map((tag) => {
                      const clean = tag.replace(/^#/, '');
                      const isSelected = currentTokens.includes(clean);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleQuickTagClick(clean)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs border ${
                            isSelected
                              ? 'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-300/60'
                              : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                          }`}
                        >
                          <span>#{clean}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 動作按鈕 */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2.5">
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setInputVal('');
                    handleExecuteSearch('');
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  清除重設
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 px-5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-bubble active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>立即搜尋</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
