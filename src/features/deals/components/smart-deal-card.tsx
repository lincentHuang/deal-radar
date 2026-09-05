'use client';

import React, { useState } from 'react';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { BubbleBadge } from '@/shared/components/ui/bubble-badge';
import { calculateDiscount, formatPrice, formatRemainingTime } from '@/shared/lib/utils';
import { 
  Store, 
  MapPin, 
  CreditCard, 
  Target, 
  Heart, 
  Share2, 
  Clock, 
  Flame,
  Tag as TagIcon,
  Sparkles,
  ShoppingBag,
  Video
} from 'lucide-react';
import { useSetAtom, useAtom } from 'jotai';
import { activeDealDetailAtom, subscribedTagsAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import { getDealPricingDisplay } from '@/features/deals/utils/deal-pricing-utils';

interface SmartDealCardProps {
  deal: SmartDeal;
  onTagClick?: (tag: string) => void;
  priority?: boolean;
}

export const SmartDealCard: React.FC<SmartDealCardProps> = ({ deal, onTagClick, priority = false }) => {
  const setActiveDeal = useSetAtom(activeDealDetailAtom);
  const [subscribedTags] = useAtom(subscribedTagsAtom);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(deal.likeCount);
  const [imgError, setImgError] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const { triggerHaptic, shareContent, copyToClipboard } = useMobileNative();

  const getAspectRatioClass = (ratio?: string) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '16:9':
        return 'aspect-[16/9]';
      case '9:16':
        return 'aspect-[9/16]';
      case '4:3':
      default:
        return 'aspect-[4/3]';
    }
  };

  const discountInfo = calculateDiscount(deal.originalPrice, deal.discountPrice);
  const timeInfo = formatRemainingTime(deal.endDate, deal.startDate);
  const pricingInfo = getDealPricingDisplay(deal);

  const handleCardClick = () => {
    triggerHaptic('light');
    setActiveDeal(deal);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shared = await shareContent({
      title: deal.title,
      text: `【特價情報】${deal.title} - ${deal.conditions.join('、')}`,
      url: deal.sourceUrl || url,
    });
    if (!shared) {
      await copyToClipboard(`${deal.title}\n${deal.sourceUrl || url}`);
      alert('已複製優惠連結至剪貼簿！');
    }
  };

  // 簡化卡片顯示的條件與信用卡 (取第 1 個核心條件與信用卡)
  const primaryCondition = deal.conditions?.[0] || null;
  const extraConditionCount = (deal.conditions?.length || 0) - 1;

  const primaryCard = deal.eligibleCards?.[0] || null;
  const extraCardCount = (deal.eligibleCards?.length || 0) - 1;

  // 簡化信用卡標題 (例如 "國泰 CUBE 卡 (樂饗購 3%...)" ➔ "國泰 CUBE 3%")
  const simplifyCardName = (raw: string) => {
    if (raw.includes('CUBE')) return '國泰 CUBE 3%';
    if (raw.includes('U Bear')) return '玉山 U Bear 5%';
    if (raw.includes('Unicard')) return '玉山 Unicard 3.5%';
    if (raw.includes('FlyGo')) return '台新 FlyGo 5%';
    if (raw.includes('@GoGo')) return '台新 @GoGo 3.8%';
    if (raw.includes('Costco')) return '富邦 Costco 2%';
    if (raw.includes('LINE Pay')) return 'LINE Pay 回饋';
    if (raw.includes('PX Pay') || raw.includes('全支付')) return '全支付/PX Pay';
    return raw.slice(0, 12);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl p-1 border border-slate-100/90 shadow-bubble hover:shadow-bubble-hover hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none"
    >
      {/* 📸 頂部：Pinterest 質感大圖封面 (嚴格預留 Aspect Ratio，完全消除圖片加載推擠跳動) */}
      <div className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-1.5 sm:mb-2 flex items-center justify-center ${getAspectRatioClass(deal.aspectRatio)}`}>
        {deal.imageUrl && !imgError ? (
          <>
            {/* 圖片讀取中微光佔位底層 */}
            {!isImgLoaded && (
              <div className="absolute inset-0 bg-slate-200/70 animate-pulse" />
            )}
            <img
              src={deal.imageUrl}
              alt={deal.title}
              onError={() => setImgError(true)}
              onLoad={() => setIsImgLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out ${
                isImgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 text-rose-400">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 mb-1 opacity-60" />
            <span className="text-[10px] sm:text-[11px] font-semibold text-rose-500/80">{deal.merchant.name}</span>
          </div>
        )}

        {/* 浮動在圖片上的泡泡標籤 */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex items-center gap-1 sm:gap-1.5 z-10">
          {((deal.tags && deal.tags.includes('#影片情報')) || (deal.imageUrl && deal.imageUrl.includes('video'))) && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold text-white bg-slate-900/85 backdrop-blur-md shadow-xs">
              <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" />
              <span>影片</span>
            </span>
          )}
          {deal.isFlashDeal && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-extrabold text-white bg-rose-500/95 backdrop-blur-md shadow-xs">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current animate-pulse" />
              <span>快閃</span>
            </span>
          )}
          {pricingInfo.badgeText ? (
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-black text-rose-700 bg-white/95 backdrop-blur-md shadow-xs border border-rose-100">
              {pricingInfo.badgeText}
            </span>
          ) : discountInfo.percentage > 0 ? (
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-black text-rose-700 bg-white/95 backdrop-blur-md shadow-xs border border-rose-100">
              {discountInfo.discountString}
            </span>
          ) : null}
        </div>

        {/* 倒數計時小膠囊 */}
        {!timeInfo.isExpired && (
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-medium text-slate-800 bg-white/90 backdrop-blur-md shadow-xs">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
            <span>{timeInfo.text}</span>
          </div>
        )}
      </div>

      {/* 📌 特價標題 (收斂為 2 行) */}
      <h3 className="text-xs sm:text-base font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2 mb-1 sm:mb-1.5 px-1.5 sm:px-2">
        {deal.title}
      </h3>

      {/* 💰 核心價格 / 促銷機制 (若為買1送1或多件特惠，大字醒目呈現並直觀標註單件推算金額) */}
      <div className="flex items-baseline justify-between gap-1 px-1.5 sm:px-2 mb-1.5 sm:mb-2">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          {pricingInfo.isMechanismPromo ? (
            <>
              <span className="text-base sm:text-2xl font-black text-rose-600 tracking-tight bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                {pricingInfo.displayTitle}
              </span>
              {pricingInfo.calculatedUnitPriceText && (
                <span className="text-[11px] sm:text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded-md shadow-2xs">
                  {pricingInfo.calculatedUnitPriceText}
                </span>
              )}
              {pricingInfo.subText && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {pricingInfo.subText}
                </span>
              )}
            </>
          ) : pricingInfo.discountPrice ? (
            <>
              <span className="text-base sm:text-2xl font-black text-rose-600 tracking-tight">
                {pricingInfo.displayTitle}
              </span>
              {pricingInfo.subText && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {pricingInfo.subText}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs sm:text-base font-bold text-rose-600">
              {pricingInfo.displayTitle}
            </span>
          )}
        </div>
      </div>

      {/* 🫧 收斂的 Icon 膠囊區 (手機端精簡展示核心條件，桌機完整呈現) */}
      {(primaryCondition || primaryCard) && (
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 mb-2 sm:mb-2.5">
          {/* 🎯 條件 Icon 膠囊 */}
          {primaryCondition && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200/70 max-w-full">
              <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500 flex-shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{primaryCondition}</span>
              {extraConditionCount > 0 && (
                <span className="text-[8px] sm:text-[10px] bg-orange-200/80 text-orange-800 px-1 rounded-full flex-shrink-0 font-semibold">
                  +{extraConditionCount}
                </span>
              )}
            </span>
          )}

          {/* 💳 信用卡 Icon 膠囊 (手機端若已有條件則收斂以保持清爽，或空間允許時展示) */}
          {primaryCard && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70 max-w-full">
              <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 flex-shrink-0" />
              <span className="truncate max-w-[85px] sm:max-w-[130px]">{simplifyCardName(primaryCard)}</span>
            </span>
          )}
        </div>
      )}

      {/* 底部：店家、地區與互動 */}
      <div className="mt-auto pt-2 sm:pt-2.5 border-t border-slate-100/90 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 px-1.5 sm:px-2 pb-0.5">
        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] text-slate-600 truncate max-w-[65%]">
          <Store className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 flex-shrink-0" />
          <span className="font-semibold text-slate-800 truncate">{deal.merchant.name}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-0.5 text-[10px] sm:text-[11px] transition-colors ${
              liked ? 'text-rose-600 font-semibold' : 'text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likeCount}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="text-slate-400 hover:text-slate-700 p-0.5"
            title="分享特惠"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
