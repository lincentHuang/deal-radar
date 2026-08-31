'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import { subscribedTagsAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { RECOMMENDED_TAG_GROUPS } from '@/features/subscriptions/data/recommended-tags';
import { 
  X, 
  Sparkles, 
  Check, 
  Plus, 
  Search, 
  Coffee, 
  Store, 
  ShoppingBag, 
  CreditCard,
  Flame
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';

interface RecommendedTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecommendedTagsModal: React.FC<RecommendedTagsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [subscribedTags, setSubscribedTags] = useAtom(subscribedTagsAtom);
  const [searchTerm, setSearchTerm] = useState('');
  const { triggerHaptic } = useMobileNative();

  const handleToggleSubscribe = (tag: string, isSubscribed: boolean) => {
    if (isSubscribed) {
      triggerHaptic('light');
      setSubscribedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.2 },
        });
      } catch (e) {}
      setSubscribedTags((prev) => [...prev, tag]);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-orange-500" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'Store':
        return <Store className="w-4 h-4 text-emerald-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-rose-500" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4 text-indigo-500" />;
      default:
        return <Flame className="w-4 h-4 text-rose-500" />;
    }
  };

  // 搜尋過濾
  const filteredGroups = RECOMMENDED_TAG_GROUPS.map((group) => {
    const matchedTags = group.tags.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return {
      ...group,
      tags: matchedTags,
    };
  }).filter((group) => group.tags.length > 0);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        {/* Radix Dialog 遮罩 */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-fadeIn" />

        {/* Radix Dialog 內容主體 */}
        <Dialog.Content 
          aria-describedby="dialog-recommended-tags-desc"
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-scaleUp focus:outline-none"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-black text-slate-900">
                  🔥 探索官方推薦標籤
                </Dialog.Title>
                <Dialog.Description id="dialog-recommended-tags-desc" className="text-xs text-slate-500 font-medium">
                  訂閱感興趣的標籤，即可在首頁頂部即時追蹤最新特價情報！
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-all active:scale-90"
                title="關閉"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* 搜尋過濾框 */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="快速搜尋標籤 (如: 買一送一、咖啡、星巴克)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-full border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* 標籤分類內容列表 */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
            {filteredGroups.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                找不到包含 "{searchTerm}" 的推薦標籤，試試其他關鍵字吧！
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.categoryName} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(group.categoryIcon)}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-700">
                      {group.categoryName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {group.tags.map((tag) => {
                      const isSubscribed = subscribedTags.includes(tag.name);
                      return (
                        <div
                          key={tag.name}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isSubscribed
                              ? 'bg-rose-50/60 border-rose-200/80 shadow-xs'
                              : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {tag.name}
                              </span>
                              {tag.dealCount ? (
                                <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md font-semibold">
                                  {tag.dealCount} 則
                                </span>
                              ) : null}
                            </div>
                            {tag.description ? (
                              <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                                {tag.description}
                              </p>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleSubscribe(tag.name, isSubscribed)}
                            className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all active:scale-95 flex items-center gap-1 flex-shrink-0 ${
                              isSubscribed
                                ? 'bg-rose-500 text-white shadow-xs hover:bg-rose-600'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                            }`}
                          >
                            {isSubscribed ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>已訂閱</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>訂閱</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              目前已訂閱 {subscribedTags.length} 個標籤
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-xs px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold transition-all active:scale-95"
              >
                完成
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
