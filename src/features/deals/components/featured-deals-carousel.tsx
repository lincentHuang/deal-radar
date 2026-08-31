'use client';

import React from 'react';
import Image from 'next/image';
import { useSetAtom } from 'jotai';
import { activeDealDetailAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { SmartDeal } from '@/features/deals/types/deal.types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@/shared/components/ui/carousel';
import { BubbleBadge } from '@/shared/components/ui/bubble-badge';
import { BubbleButton } from '@/shared/components/ui/bubble-button';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  CreditCard, 
  Store, 
  ArrowRight, 
  Heart, 
  TrendingDown, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface FeaturedDealsCarouselProps {
  deals: SmartDeal[];
}

export const FeaturedDealsCarousel: React.FC<FeaturedDealsCarouselProps> = ({ deals }) => {
  const setActiveDeal = useSetAtom(activeDealDetailAtom);
  const { triggerHaptic } = useMobileNative();

  // 挑選熱門推薦與快閃活動作為輪播精選 (最多 5 則)
  const featuredDeals = React.useMemo(() => {
    const hotList = deals.filter((d) => d.isHot || d.isFlashDeal || (d.originalPrice && d.discountPrice && d.originalPrice - d.discountPrice > 100));
    return hotList.length > 0 ? hotList.slice(0, 5) : deals.slice(0, 4);
  }, [deals]);

  if (featuredDeals.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* 標題欄 */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>本週主打 · 破盤快閃情報</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100/80 text-rose-700 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>精選特惠</span>
              </span>
            </h2>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          滑動瀏覽焦點活動 ➔
        </div>
      </div>

      {/* Embla 輪播模組主體 */}
      <Carousel
        opts={{
          align: 'start',
          loop: featuredDeals.length > 1,
        }}
        autoplay={featuredDeals.length > 1}
        autoplayDelay={4500}
        className="w-full relative group"
      >
        {/* 卡片與左右導覽箭頭獨立容器 (確保箭頭置中於卡片本體) */}
        <div className="relative w-full">
          <CarouselContent>
            {featuredDeals.map((deal) => {
              const hasDiscount = deal.originalPrice && deal.discountPrice && deal.originalPrice > deal.discountPrice;
              const discountPercent = hasDiscount
                ? Math.round(((deal.originalPrice! - deal.discountPrice!) / deal.originalPrice!) * 100)
                : null;
              const savings = hasDiscount ? deal.originalPrice! - deal.discountPrice! : null;

              return (
                <CarouselItem key={deal.id} className="basis-full">
                  <div 
                    onClick={() => {
                      triggerHaptic('medium');
                      setActiveDeal(deal);
                    }}
                    className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-bubble hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-stretch group/card"
                  >
                    {/* 1. 左側/頂部 高畫質大圖封面 (佔比45% ~ 50%) */}
                    <div className="relative w-full md:w-5/12 h-60 sm:h-72 md:h-96 overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={deal.imageUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80'}
                        alt={deal.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:hidden" />
                      
                      {/* 浮動狀態膠囊 (大圖上方) */}
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
                        {deal.isFlashDeal && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-black shadow-md animate-pulse">
                            <Flame className="w-3.5 h-3.5" />
                            <span>限時快閃</span>
                          </span>
                        )}
                        {deal.channelType === 'online' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
                            <span>🛍️ 線上電商</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/85 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
                            <Store className="w-3 h-3" />
                            <span>實體門市</span>
                          </span>
                        )}
                      </div>

                      {/* 折扣百分比浮雕標籤 */}
                      {discountPercent && (
                        <div className="absolute bottom-3.5 left-3.5 md:bottom-4 md:left-4 z-10">
                          <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-sm sm:text-base shadow-lg flex items-center gap-1.5">
                            <TrendingDown className="w-4 h-4" />
                            <span>直降 {discountPercent}% OFF</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. 右側 資訊與 7 大要素核心解析 */}
                    <div className="flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50/50 to-rose-50/30">
                      <div className="space-y-3 sm:space-y-4">
                        {/* 店家名稱與來源平台 */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative flex-shrink-0">
                              {deal.merchant.logo ? (
                                <Image src={deal.merchant.logo} alt={deal.merchant.name} fill className="object-cover" />
                              ) : (
                                <Store className="w-3.5 h-3.5 text-slate-500 m-auto" />
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-700">
                              {deal.merchant.name}
                            </span>
                          </div>
                          {deal.sourcePlatform && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              情報源：{deal.sourcePlatform}
                            </span>
                          )}
                        </div>

                        {/* 標題與副標 */}
                        <div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug group-hover/card:text-rose-600 transition-colors line-clamp-2">
                            {deal.title}
                          </h3>
                          {deal.subtitle && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                              {deal.subtitle}
                            </p>
                          )}
                        </div>

                        {/* 核心價格區 */}
                        <div className="flex items-baseline gap-2.5 pt-1">
                          {deal.discountPrice ? (
                            <>
                              <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
                                ${deal.discountPrice.toLocaleString()}
                              </span>
                              {deal.originalPrice && (
                                <del className="text-xs sm:text-sm text-slate-400 font-medium">
                                  ${deal.originalPrice.toLocaleString()}
                                </del>
                              )}
                              {savings && (
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  現省 ${savings.toLocaleString()}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xl sm:text-2xl font-black text-rose-600">
                              超值特惠
                            </span>
                          )}
                          {deal.priceUnit && (
                            <span className="text-xs text-slate-400 font-normal">
                              ({deal.priceUnit})
                            </span>
                          )}
                        </div>

                        {/* 7 大要素亮點膠囊 */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {deal.conditions && deal.conditions[0] && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-semibold">
                              <span>🎯 {deal.conditions[0]}</span>
                            </div>
                          )}
                          {deal.eligibleCards && deal.eligibleCards[0] && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
                              <CreditCard className="w-3 h-3 text-emerald-600" />
                              <span>{deal.eligibleCards[0]}</span>
                            </div>
                          )}
                          {deal.regions && deal.regions[0] && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                              <Store className="w-3 h-3 text-slate-400" />
                              <span>{deal.regions[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 底部互動操作按鈕與熱度 */}
                      <div className="flex items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-slate-100/90 mt-4">
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1 text-rose-500 font-semibold">
                            <Heart className="w-3.5 h-3.5 fill-rose-500" />
                            <span>{deal.likeCount} 人推爆</span>
                          </span>
                          {deal.priceDropAlert?.isLowest90Days && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>近90天歷史新低</span>
                            </span>
                          )}
                        </div>

                        <BubbleButton
                          variant="primary"
                          size="sm"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          className="font-bold shadow-md group-hover/card:bg-rose-600"
                        >
                          <span>查看 7 大要素詳情</span>
                        </BubbleButton>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* 左右導覽按鈕 */}
          <CarouselPrevious />
          <CarouselNext />
        </div>

        {/* 底部指示點 */}
        <CarouselDots />
      </Carousel>
    </section>
  );
};
