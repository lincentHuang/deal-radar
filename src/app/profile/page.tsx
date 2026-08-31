'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { subscribedTagsAtom, bookmarkedDealIdsAtom, dealFiltersAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { RECOMMENDED_TAG_GROUPS } from '@/features/subscriptions/data/recommended-tags';
import { 
  User, 
  Sparkles, 
  Tag, 
  Plus, 
  Check, 
  Trash2, 
  ArrowLeft, 
  Bookmark, 
  TrendingUp, 
  ShieldCheck, 
  Coffee, 
  Store, 
  ShoppingBag, 
  CreditCard,
  Flame
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';

export default function ProfilePage() {
  const [subscribedTags, setSubscribedTags] = useAtom(subscribedTagsAtom);
  const [bookmarkedIds] = useAtom(bookmarkedDealIdsAtom);
  const [, setFilters] = useAtom(dealFiltersAtom);
  const { triggerHaptic } = useMobileNative();

  const handleRemoveTag = (tag: string) => {
    triggerHaptic('light');
    setSubscribedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleAddTag = (tag: string) => {
    if (subscribedTags.includes(tag)) return;
    triggerHaptic('success');
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.3 },
      });
    } catch (e) {}
    setSubscribedTags((prev) => [...prev, tag]);
  };

  const handleResetDefaults = () => {
    triggerHaptic('medium');
    setSubscribedTags(['#咖啡', '#買一送一', '#星巴克', '#國泰CUBE']);
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

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* 頂部導航 */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回特價首頁</span>
          </Link>
          <span className="text-xs font-semibold text-slate-400">
            會員專屬中心
          </span>
        </div>

        {/* 1. 會員名片卡片 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-bubble">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-rose-600 to-orange-400 flex items-center justify-center text-white text-2xl font-black shadow-md">
                省
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    特價情報 VIP 達人
                  </h1>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    已登入
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  智能推薦已啟用 · 已客製化 {subscribedTags.length} 個關注標籤
                </p>
              </div>
            </div>

            {/* 統計數據膠囊 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <div className="px-2">
                <span className="text-xs text-slate-400 font-medium block">已訂閱標籤</span>
                <span className="text-lg font-black text-slate-900">{subscribedTags.length}</span>
              </div>
              <div className="px-2 border-x border-slate-200/60">
                <span className="text-xs text-slate-400 font-medium block">已收藏特價</span>
                <span className="text-lg font-black text-rose-600">{bookmarkedIds.length}</span>
              </div>
              <div className="px-2">
                <span className="text-xs text-slate-400 font-medium block">預估已省下</span>
                <span className="text-lg font-black text-emerald-600">$3,420</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 我的訂閱標籤管理專區 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-bubble space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  我的訂閱標籤管理
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                這些標籤會常駐於首頁頂部導覽列，並聚合至「🌟 我的標籤」情報牆中。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-full transition-all active:scale-95"
              >
                重置為熱門標籤
              </button>
              <Link
                href="/"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, selectedTag: '__MY_TAGS__' }));
                }}
                className="text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full shadow-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>看我的情報牆</span>
              </Link>
            </div>
          </div>

          {/* 目前訂閱的標籤列表 */}
          {subscribedTags.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                目前尚未訂閱任何標籤，請從下方推薦標籤中選取訂閱！
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {subscribedTags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 bg-rose-50/80 border border-rose-200/80 text-rose-700 px-3.5 py-2 rounded-full text-xs font-bold shadow-xs hover:shadow-sm transition-all"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    title={`取消訂閱 ${tag}`}
                    className="w-4 h-4 rounded-full bg-rose-200/80 hover:bg-rose-300 text-rose-800 flex items-center justify-center text-[10px] transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. 探索並新增推薦標籤 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-bubble space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                探索官方熱門推薦標籤
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              點擊「＋ 訂閱」將感興趣的生活好康與品牌優惠加入您的專屬情報列。
            </p>
          </div>

          <div className="space-y-6">
            {RECOMMENDED_TAG_GROUPS.map((group) => (
              <div key={group.categoryName} className="space-y-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(group.categoryIcon)}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-700">
                    {group.categoryName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.tags.map((tag) => {
                    const isSubscribed = subscribedTags.includes(tag.name);
                    return (
                      <div
                        key={tag.name}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSubscribed
                            ? 'bg-rose-50/50 border-rose-200/60 shadow-xs'
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
                          onClick={() => {
                            if (isSubscribed) {
                              handleRemoveTag(tag.name);
                            } else {
                              handleAddTag(tag.name);
                            }
                          }}
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
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
