'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { subscribedTagsAtom, bookmarkedDealIdsAtom, dealFiltersAtom, activeDealDetailAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { RECOMMENDED_TAG_GROUPS } from '@/features/subscriptions/data/recommended-tags';
import { getDeals } from '@/features/deals/server/deals-dal';
import { SmartDeal } from '@/features/deals/types/deal.types';
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
  Flame,
  LogIn,
  ExternalLink,
  Clock,
  Heart,
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import confetti from 'canvas-confetti';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, openAuthModal, updateTags, toggleBookmark, logout } = useAuth();
  const [subscribedTags, setSubscribedTags] = useAtom(subscribedTagsAtom);
  const [bookmarkedIds, setBookmarkedIds] = useAtom(bookmarkedDealIdsAtom);
  const [, setFilters] = useAtom(dealFiltersAtom);
  const [, setActiveDeal] = useAtom(activeDealDetailAtom);
  const { triggerHaptic } = useMobileNative();

  const [activeTab, setActiveTab] = useState<'tags' | 'bookmarks'>('tags');
  const [bookmarkedDeals, setBookmarkedDeals] = useState<SmartDeal[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // 監聽 hash 變更自動切換 Tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#bookmarks') {
        setActiveTab('bookmarks');
      } else if (hash === '#tags') {
        setActiveTab('tags');
      }
    }
  }, []);

  const handleRemoveTag = async (tag: string) => {
    triggerHaptic('light');
    const newTags = subscribedTags.filter((t) => t !== tag);
    await updateTags(newTags);
  };

  const handleAddTag = async (tag: string) => {
    if (subscribedTags.includes(tag)) return;
    triggerHaptic('success');
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.3 },
      });
    } catch (e) {}
    const newTags = [...subscribedTags, tag];
    await updateTags(newTags);
  };

  const handleResetDefaults = async () => {
    triggerHaptic('medium');
    const defaultTags = ['#咖啡', '#買1送1', '#星巴克', '#國泰CUBE'];
    await updateTags(defaultTags);
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>資料庫連線中</span>
            </span>
            <span className="text-xs font-semibold text-slate-400">
              會員專屬中心
            </span>
          </div>
        </div>

        {/* 1. 會員名片卡片 (已登入 / 訪客模式 雙態) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-bubble">
          {isAuthenticated && user ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-rose-100 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-rose-600 to-orange-400 flex items-center justify-center text-white text-2xl font-black shadow-md">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                      {user.name}
                    </h1>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-rose-600" />
                      {user.provider === 'google' ? 'Google 認證會員' : 'VIP 會員'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {user.email} · 雲端同步已開啟 (已鎖定 {subscribedTags.length} 個標籤)
                  </p>
                </div>
              </div>

              {/* 統計數據膠囊 */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="px-2">
                  <span className="text-xs text-slate-400 font-medium block">已追蹤標籤</span>
                  <span className="text-lg font-black text-slate-900">{subscribedTags.length}</span>
                </div>
                <div className="px-2 border-x border-slate-200/60">
                  <span className="text-xs text-slate-400 font-medium block">已收藏情報</span>
                  <span className="text-lg font-black text-rose-600">{bookmarkedIds.length}</span>
                </div>
                <div className="px-2">
                  <span className="text-xs text-slate-400 font-medium block">預估已省下</span>
                  <span className="text-lg font-black text-emerald-600">$3,420</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-2xl font-black shadow-inner">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                      訪客體驗模式
                    </h1>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                      未登入
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    登入或註冊會員後，您的自訂標籤與特惠收藏將自動永久儲存至後端雲端資料庫！
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-bubble active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>立即登入 / 免費註冊</span>
              </button>
            </div>
          )}
        </section>

        {/* Tab 切換：我的訂閱標籤 vs 我的收藏特價 */}
        <div className="flex bg-slate-200/70 p-1.5 rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('tags');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tags'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4 text-orange-500" />
            <span>我的訂閱標籤 ({subscribedTags.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('bookmarks');
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4 text-rose-500" />
            <span>已收藏特價 ({bookmarkedIds.length})</span>
          </button>
        </div>

        {/* 2. 我的訂閱標籤管理專區 */}
        {activeTab === 'tags' && (
          <>
            <section id="tags" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-bubble space-y-5">
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
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-full transition-all active:scale-95 cursor-pointer"
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
                        className="w-4 h-4 rounded-full bg-rose-200/80 hover:bg-rose-300 text-rose-800 flex items-center justify-center text-[10px] transition-colors cursor-pointer"
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
                              className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all active:scale-95 flex items-center gap-1 flex-shrink-0 cursor-pointer ${
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
          </>
        )}

        {/* 3. 已收藏特價情報專區 */}
        {activeTab === 'bookmarks' && (
          <section id="bookmarks" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-bubble space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-rose-500" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    已收藏特價情報
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  已儲存至您的專屬收藏清單，方便隨時翻閱或門市核銷。
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                共 {bookmarkedIds.length} 筆
              </span>
            </div>

            {bookmarkedIds.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">目前尚無任何收藏的特惠情報</p>
                <p className="text-xs text-slate-400 mt-1">在首頁情報牆點擊特惠卡片即可加入收藏！</p>
                <Link
                  href="/"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  <span>立即探索特價情報</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarkedIds.map((dealId) => (
                  <div
                    key={dealId}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/20 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        特
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          情報編號 #{dealId}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="text-rose-600 font-semibold">特惠已收藏</span>
                          <span>· 支援門市現場出示</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(dealId)}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-all cursor-pointer"
                      >
                        移除收藏
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
