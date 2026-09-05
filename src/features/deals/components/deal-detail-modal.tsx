'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { activeDealDetailAtom, subscribedTagsAtom, bookmarkedDealIdsAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { calculateDiscount, formatPrice, formatRemainingTime } from '@/shared/lib/utils';
import { BubbleBadge } from '@/shared/components/ui/bubble-badge';
import { BubbleButton } from '@/shared/components/ui/bubble-button';
import {
  X,
  Store,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
  Flame,
  Tag as TagIcon,
  Globe,
  Copy,
  Check,
  Plus,
  ThumbsUp,
  MessageCircle,
  Link2,
  Maximize2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import { getDealPricingDisplay } from '@/features/deals/utils/deal-pricing-utils';
import { normalizeBrandName, normalizeTags } from '@/features/deals/utils/brand-normalizer';

export const DealDetailModal: React.FC = () => {
  const [activeDeal, setActiveDeal] = useAtom(activeDealDetailAtom);
  const [subscribedTags] = useAtom(subscribedTagsAtom);
  const [bookmarkedDealIds] = useAtom(bookmarkedDealIdsAtom);
  const { toggleBookmark, updateTags } = useAuth();
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const { triggerHaptic, copyToClipboard } = useMobileNative();

  useEffect(() => {
    if (activeDeal) {
      setSelectedImageIndex(0);
      setImgError(false);
    }
  }, [activeDeal?.id]);

  const handleClose = () => {
    setActiveDeal(null);
    setCopiedUrl(false);
    setShowLightbox(false);
  };

  if (!activeDeal) return null;

  const discountInfo = calculateDiscount(activeDeal.originalPrice, activeDeal.discountPrice);
  const timeInfo = formatRemainingTime(activeDeal.endDate, activeDeal.startDate);
  const normalizedMerchantName = normalizeBrandName(activeDeal.merchant?.name);
  const normalizedTags = normalizeTags(activeDeal.tags, normalizedMerchantName);
  const pricingInfo = getDealPricingDisplay(activeDeal);

  const imagesList = activeDeal.images && activeDeal.images.length > 0
    ? activeDeal.images
    : (activeDeal.imageUrl ? [activeDeal.imageUrl] : []);

  const currentDisplayImage = imagesList[selectedImageIndex] || activeDeal.imageUrl;

  const getPlatformLabel = (platform?: string, source?: string) => {
    if (platform === 'Convenience') return '超商官方專頁';
    if (platform === 'Dcard') return 'Dcard 優惠情報';
    if (platform === 'Momo') return 'Momo 購物網';
    if (platform === 'Shopee') return '蝦皮購物';
    if (platform === 'PChome') return 'PChome 24h';
    if (platform === 'Costco') return 'Costco 好市多';
    if (platform === 'Carrefour') return '家樂福官方';
    if (platform === 'PXMart') return '全聯福利中心';
    if (source === 'social_listening') return '社群即時採集';
    if (source === 'official') return '官方公告情報';
    if (source === 'merchant_post') return '商家自主發布';
    return '活動原始頁面';
  };

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeDeal.sourceUrl) return;
    triggerHaptic('light');
    await copyToClipboard(activeDeal.sourceUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyDeal = async () => {
    triggerHaptic('success');
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) { }

    await copyToClipboard(
      `🔥【特價情報】${activeDeal.title}\n💰 優惠價：${formatPrice(activeDeal.discountPrice || 0)}\n🎯 條件：${activeDeal.conditions.join('、')}\n📍 地點：${activeDeal.regions.join('、')}${activeDeal.sourceUrl ? `\n🔗 來源網址：${activeDeal.sourceUrl}` : ''}`
    );
    alert('🎉 已複製特惠情報與來源連結！');
  };

  const handleToggleTag = async (tag: string) => {
    const isSubscribed = subscribedTags.includes(tag);
    if (isSubscribed) {
      triggerHaptic('light');
      const newTags = subscribedTags.filter((t) => t !== tag);
      await updateTags(newTags);
    } else {
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.5 },
        });
      } catch (e) { }
      const newTags = [...subscribedTags, tag];
      await updateTags(newTags);
    }
  };

  const handleSubscribeAllTags = async () => {
    triggerHaptic('success');
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.3 },
      });
    } catch (e) { }
    const newTags = Array.from(new Set([...subscribedTags, ...activeDeal.tags]));
    await updateTags(newTags);
    alert('🔔 已成功追蹤此優惠的所有關鍵標籤至上方導覽列！');
  };

  return (
    <>
      <Dialog.Root open={!!activeDeal} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <Dialog.Portal>
          {/* Radix Dialog 遮罩 */}
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" />

          {/* Radix Dialog 內容本體 */}
          <Dialog.Content
            aria-describedby="dialog-deal-detail-desc"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scaleUp focus:outline-none"
          >
            {/* 固定在右上角的關閉按鈕 */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md transition-all active:scale-95 shadow-md"
                title="關閉"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>

            {/* 滾動內容容器 */}
            <div className="overflow-y-auto no-scrollbar p-5 sm:p-7 flex-1">

              {/* 📸 頂部高畫質大圖展示區 (自適應原始圖片真實比例，支援放大檢視) */}
              <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900/5 mb-5 border border-slate-100 shadow-2xs group flex items-center justify-center">
                <div
                  onClick={() => setShowLightbox(true)}
                  className="relative w-full max-h-[500px] sm:max-h-[580px] overflow-hidden flex items-center justify-center bg-slate-950/5 cursor-zoom-in p-1"
                  title="點擊放大檢視清晰大圖"
                >
                  {currentDisplayImage && !imgError ? (
                    <img
                      src={currentDisplayImage}
                      alt={activeDeal.title}
                      onError={() => setImgError(true)}
                      className="w-auto h-auto max-w-full max-h-[500px] sm:max-h-[580px] object-contain rounded-xl sm:rounded-2xl group-hover:scale-101 transition-transform duration-500 ease-out shadow-xs"
                    />
                  ) : (
                    <div className="w-full h-48 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 text-rose-400">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-sm font-semibold text-rose-600/80">{activeDeal.merchant.name} 特惠情報</span>
                    </div>
                  )}

                  {/* 浮動大圖操作按鈕 */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLightbox(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 shadow-md"
                      title="查看全螢幕清晰大圖"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>查看大圖</span>
                    </button>
                  </div>

                  {/* 浮動在圖片左上角的泡泡標籤 */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
                    {activeDeal.isFlashDeal && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black text-white bg-rose-500/95 backdrop-blur-md shadow-xs">
                        <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                        <span>限時快閃</span>
                      </span>
                    )}
                    {pricingInfo.badgeText ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black text-rose-700 bg-white/95 backdrop-blur-md shadow-xs border border-rose-100">
                        {pricingInfo.badgeText}
                      </span>
                    ) : discountInfo.percentage > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black text-rose-700 bg-white/95 backdrop-blur-md shadow-xs border border-rose-100">
                        {discountInfo.discountString}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* 🖼️ 專屬圖卡縮圖列 (僅在該商品具備多張專屬圖片時呈現) */}
                {imagesList.length > 1 && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50/90 border-t border-slate-100 overflow-x-auto no-scrollbar w-full">
                    <span className="text-[11px] font-semibold text-slate-500 pl-1 shrink-0">
                      共有 {imagesList.length} 張圖卡：
                    </span>
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${selectedImageIndex === idx
                            ? 'border-rose-500 ring-2 ring-rose-200 scale-105 shadow-xs'
                            : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img src={img} alt={`縮圖 ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 頂部標籤與狀態 */}
              <div className="flex flex-wrap items-center gap-2 mb-3 pr-12">
                <BubbleBadge variant="default" size="sm" icon={<Store className="w-3.5 h-3.5 text-slate-500" />}>
                  {activeDeal.channelType === 'online' ? '線上電商' : '實體門市'}
                </BubbleBadge>
                <BubbleBadge variant="blue" size="sm" icon={<MapPin className="w-3.5 h-3.5 text-blue-500" />}>
                  {activeDeal.regions.join(' · ')}
                </BubbleBadge>
                {activeDeal.sourcePlatform && (
                  <BubbleBadge variant="purple" size="sm" icon={<Globe className="w-3.5 h-3.5 text-purple-600" />}>
                    {getPlatformLabel(activeDeal.sourcePlatform, activeDeal.source)}
                  </BubbleBadge>
                )}
                {!timeInfo.isExpired && (
                  <BubbleBadge variant="lemon" size="sm" icon={<Clock className="w-3.5 h-3.5 text-amber-600" />}>
                    {timeInfo.text}
                  </BubbleBadge>
                )}
              </div>

              {/* 標題與副標題 */}
              <Dialog.Title className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-1.5">
                {activeDeal.title}
              </Dialog.Title>
              <Dialog.Description id="dialog-deal-detail-desc" className="text-sm text-slate-600 mb-4">
                {activeDeal.subtitle || `${normalizedMerchantName} · ${activeDeal.regions.join('、')}`}
              </Dialog.Description>

              {/* 價格大氣泡分析 (若是買1送1或多件特惠，大字醒目呈現並直觀標註單件推算金額) */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl border border-rose-100 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs text-rose-500 font-semibold">
                      {pricingInfo.isMechanismPromo ? '促銷特惠機制' : '破盤優惠價'}
                    </span>
                    {pricingInfo.isMechanismPromo && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-2xs">
                        {pricingInfo.displayTitle}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {pricingInfo.isMechanismPromo ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-black text-rose-600 bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                          {pricingInfo.displayTitle}
                        </span>
                        {pricingInfo.calculatedUnitPriceText && (
                          <span className="text-sm sm:text-base font-bold text-rose-700 bg-rose-100/80 border border-rose-200 px-2.5 py-0.5 rounded-xl shadow-2xs">
                            折算{pricingInfo.calculatedUnitPriceText}
                          </span>
                        )}
                        {pricingInfo.subText && (
                          <span className="text-base text-slate-400 line-through">
                            {pricingInfo.subText}
                          </span>
                        )}
                      </>
                    ) : pricingInfo.discountPrice ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-black text-rose-600">
                          {pricingInfo.displayTitle}
                        </span>
                        {pricingInfo.unit && (
                          <span className="text-sm text-slate-500">/ {pricingInfo.unit}</span>
                        )}
                        {pricingInfo.subText && (
                          <span className="text-base text-slate-400 line-through">
                            {pricingInfo.subText}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-black text-rose-600">
                        {pricingInfo.displayTitle}
                      </span>
                    )}
                  </div>
                </div>

                {pricingInfo.isMechanismPromo && pricingInfo.calculatedUnitPriceText ? (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1 rounded-full shadow-xs">
                      {pricingInfo.displayTitle} 超值回饋
                    </span>
                    <span className="text-xs text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full font-bold">
                      {pricingInfo.calculatedUnitPriceText}
                    </span>
                  </div>
                ) : discountInfo.percentage > 0 && !pricingInfo.isMechanismPromo ? (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1 rounded-full shadow-xs">
                      {discountInfo.discountString} (省 {formatPrice(discountInfo.saved)})
                    </span>
                    <span className="text-xs text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full font-medium">
                      現折 {discountInfo.percentage}%
                    </span>
                  </div>
                ) : null}
              </div>

              {/* 7 大要素詳細區塊 */}
              <div className="space-y-4 mb-6">

                {/* 🏷️ 優惠標籤清單與互動話題專區 */}
                {normalizedTags && normalizedTags.length > 0 && (
                  <div className="p-4 bg-gradient-to-br from-rose-50/50 via-purple-50/30 to-blue-50/30 rounded-2xl border border-rose-100/80">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <TagIcon className="w-4 h-4 text-rose-500" />
                        <span>特惠關聯標籤</span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">
                          {normalizedTags.length} 個標籤
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSubscribeAllTags}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                      >
                        一鍵全追蹤
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {normalizedTags.map((tag, idx) => {
                        const cleanTagName = tag.replace(/^#/, '');
                        const isSubscribed = subscribedTags.includes(tag);

                        return (
                          <div
                            key={idx}
                            className={`group inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs transition-all shadow-2xs ${isSubscribed
                                ? 'bg-rose-500 text-white font-bold shadow-rose-200'
                                : 'bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200'
                              }`}
                          >
                            {/* 點擊切換訂閱狀態 */}
                            <button
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              className="inline-flex items-center gap-1 active:scale-95"
                              title={isSubscribed ? `點擊取消追蹤 ${tag}` : `點擊加入追蹤 ${tag}`}
                            >
                              <span>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                              {isSubscribed ? (
                                <Check className="w-3 h-3 text-white" />
                              ) : (
                                <Plus className="w-3 h-3 text-slate-400 group-hover:text-rose-500" />
                              )}
                            </button>

                            {/* 快速導向標籤頁 */}
                            <Link
                              href={`/tag/${encodeURIComponent(cleanTagName)}`}
                              onClick={() => {
                                triggerHaptic('light');
                                handleClose();
                              }}
                              className={`p-0.5 rounded-full transition-colors ${isSubscribed ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                                }`}
                              title={`瀏覽更多 ${tag} 相關情報`}
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 🎯 適用品項 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                    <TagIcon className="w-4 h-4 text-blue-500" />
                    <span>適用品項清單</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    {activeDeal.targetItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* 🎯 特價條件與門檻 */}
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    <span>特價條件與適用門檻</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {activeDeal.conditions.map((cond, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 💳 適用信用卡與支付工具 */}
                {activeDeal.eligibleCards && activeDeal.eligibleCards.length > 0 && (
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>推薦搭配信用卡 / 支付工具</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeDeal.eligibleCards.map((card, i) => (
                        <BubbleBadge key={i} variant="mint" size="md" icon={<CreditCard className="w-3.5 h-3.5 text-emerald-600" />}>
                          {card}
                        </BubbleBadge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🌐 情報來源與開發者查驗區塊 */}
                <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span>情報來源與查驗連結</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                        來源查驗
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-500">
                      {activeDeal.likeCount > 0 && (
                        <span className="flex items-center gap-1 text-slate-600" title="社群互動讚數">
                          <ThumbsUp className="w-3.5 h-3.5 text-rose-500" /> {activeDeal.likeCount}
                        </span>
                      )}
                      {activeDeal.commentCount > 0 && (
                        <span className="flex items-center gap-1 text-slate-600" title="社群互動留言數">
                          <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> {activeDeal.commentCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 mb-2.5 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">管道來源：</span>
                    <span className="bg-white border border-indigo-100 text-indigo-900 font-medium px-2 py-0.5 rounded-md text-[11px] shadow-2xs">
                      {getPlatformLabel(activeDeal.sourcePlatform, activeDeal.source)}
                    </span>
                    {activeDeal.source === 'social_listening' && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        即時採集
                      </span>
                    )}
                  </div>

                  {activeDeal.sourceUrl ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Link2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs font-mono text-slate-600 truncate select-all" title={activeDeal.sourceUrl}>
                          {activeDeal.sourceUrl}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={handleCopyUrl}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all font-medium"
                          title="複製完整網址"
                        >
                          {copiedUrl ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">已複製</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>複製網址</span>
                            </>
                          )}
                        </button>
                        <a
                          href={activeDeal.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => triggerHaptic('light')}
                          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold active:scale-95 transition-all shadow-xs"
                          title="於新分頁開啟原始情報網頁"
                        >
                          <span>開啟來源</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic bg-white/80 p-2.5 rounded-xl border border-slate-200 text-center">
                      此情報為實體門市專屬或由商家自主發布，暫無外部來源網址
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 📌 固定底部操作列 (Fixed Footer) */}
            <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 w-full">
                <BubbleButton
                  type="button"
                  variant={bookmarkedDealIds.includes(activeDeal.id) ? "secondary" : "outline"}
                  size="md"
                  className="flex-1 justify-center"
                  leftIcon={<Bookmark className={`w-4 h-4 ${bookmarkedDealIds.includes(activeDeal.id) ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />}
                  onClick={async () => {
                    await toggleBookmark(activeDeal.id);
                  }}
                >
                  {bookmarkedDealIds.includes(activeDeal.id) ? '已收藏' : '收藏情報'}
                </BubbleButton>

                <BubbleButton
                  type="button"
                  variant="outline"
                  size="md"
                  className="flex-1 justify-center"
                  leftIcon={<Share2 className="w-4 h-4 text-slate-600" />}
                  onClick={handleCopyDeal}
                >
                  一鍵分享
                </BubbleButton>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 🔍 全螢幕高解析大圖 Lightbox 彈窗 */}
      <Dialog.Root open={showLightbox} onOpenChange={setShowLightbox}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md animate-fadeIn" />
          <Dialog.Content
            aria-describedby="dialog-lightbox-desc"
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 sm:p-8 focus:outline-none"
          >
            <Dialog.Title className="sr-only">特惠原圖放大檢視</Dialog.Title>
            <Dialog.Description id="dialog-lightbox-desc" className="sr-only">
              查看 {activeDeal.title} 的高解析特惠大圖
            </Dialog.Description>

            {/* 關閉 Lightbox 按鈕 */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-95"
                title="關閉放大圖"
              >
                <X className="w-6 h-6" />
              </button>
            </Dialog.Close>

            {/* 大圖展示 */}
            <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
              <img
                src={currentDisplayImage}
                alt={activeDeal.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scaleUp"
              />
            </div>

            {/* 多圖切換指示器 */}
            {imagesList.length > 1 && (
              <div className="absolute bottom-6 flex items-center gap-3 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))}
                  className="p-1 text-white hover:text-rose-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white text-xs font-semibold">
                  {selectedImageIndex + 1} / {imagesList.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))}
                  className="p-1 text-white hover:text-rose-400 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

