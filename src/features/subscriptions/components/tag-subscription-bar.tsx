'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { subscribedTagsAtom, dealFiltersAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { POPULAR_TAGS, POPULAR_CREDIT_CARDS } from '@/features/regions/data/taiwan-districts';
import { Bell, Sparkles, Plus, Check, Filter } from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';

export const TagSubscriptionBar: React.FC = () => {
  const [subscribedTags, setSubscribedTags] = useAtom(subscribedTagsAtom);
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const { triggerHaptic } = useMobileNative();

  const handleToggleTag = (tag: string) => {
    triggerHaptic('medium');
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (subscribedTags.includes(cleanTag)) {
      setSubscribedTags(subscribedTags.filter((t) => t !== cleanTag));
    } else {
      try {
        confetti({
          particleCount: 40,
          spread: 45,
          origin: { y: 0.8 },
        });
      } catch (e) {}
      setSubscribedTags([...subscribedTags, cleanTag]);
    }
  };

  const handleFilterByTag = (tag: string) => {
    triggerHaptic('light');
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    setFilters((prev) => ({
      ...prev,
      selectedTag: prev.selectedTag === cleanTag ? null : cleanTag,
    }));
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const newTag = customTagInput.trim().startsWith('#') 
      ? customTagInput.trim() 
      : `#${customTagInput.trim()}`;

    triggerHaptic('success');
    if (!subscribedTags.includes(newTag)) {
      setSubscribedTags([...subscribedTags, newTag]);
    }
    setCustomTagInput('');
    setIsAddingTag(false);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-bubble mb-5">
      {/* 標題與我的追蹤計數 */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              自訂標籤訂閱追蹤
            </h4>
            <p className="text-[11px] text-slate-500">
              點擊標籤直接訂閱，符合條件的特價情報將即時通知
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            已訂閱 {subscribedTags.length} 個標籤
          </span>
        </div>
      </div>

      {/* 標籤泡泡池 */}
      <div className="flex flex-wrap items-center gap-1.5">
        {POPULAR_TAGS.map((tag) => {
          const isSubscribed = subscribedTags.includes(tag);
          const isFilterActive = filters.selectedTag === tag;

          return (
            <div
              key={tag}
              className={`inline-flex items-center rounded-full transition-all duration-200 ${
                isSubscribed
                  ? 'bg-rose-500 text-white shadow-sm border border-rose-400'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              {/* 篩選鍵 */}
              <button
                type="button"
                onClick={() => handleFilterByTag(tag)}
                className={`text-xs px-3 py-1.5 font-medium flex items-center gap-1 active:scale-95 ${
                  isFilterActive ? 'underline decoration-2' : ''
                }`}
              >
                <span>{tag}</span>
              </button>

              {/* 訂閱切換按鈕 */}
              <button
                type="button"
                title={isSubscribed ? '取消訂閱' : '點擊訂閱'}
                onClick={() => handleToggleTag(tag)}
                className={`p-1.5 pr-2.5 rounded-r-full text-xs font-bold transition-transform active:scale-90 ${
                  isSubscribed ? 'text-white hover:text-rose-100' : 'text-slate-400 hover:text-rose-500'
                }`}
              >
                {isSubscribed ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}

        {/* 自訂新標籤 */}
        {isAddingTag ? (
          <form onSubmit={handleAddCustomTag} className="inline-flex items-center gap-1">
            <input
              type="text"
              placeholder="輸入標籤 (如: 除濕機)"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              autoFocus
              className="text-xs px-3 py-1 rounded-full border border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500 w-36 bg-white"
            />
            <button
              type="submit"
              className="text-xs px-2.5 py-1 bg-rose-500 text-white rounded-full font-semibold active:scale-95"
            >
              加入
            </button>
            <button
              type="button"
              onClick={() => setIsAddingTag(false)}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              取消
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsAddingTag(true);
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-dashed border-slate-300 hover:border-rose-400 text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-all active:scale-95 bg-white"
          >
            <Plus className="w-3 h-3" />
            <span>自訂標籤</span>
          </button>
        )}
      </div>

      {/* 標籤過濾狀態提示 */}
      {filters.selectedTag && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>
            目前正在過濾標籤：<strong className="text-rose-600 font-bold">{filters.selectedTag}</strong>
          </span>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, selectedTag: null }))}
            className="text-rose-600 font-semibold hover:underline"
          >
            清除標籤過濾
          </button>
        </div>
      )}
    </div>
  );
};
