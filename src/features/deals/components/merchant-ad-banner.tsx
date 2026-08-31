'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAtom, useSetAtom } from 'jotai';
import { activeDealDetailAtom, dealFiltersAtom, subscribedTagsAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { INITIAL_SMART_DEALS } from '@/features/deals/server/deals-mock-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselCounter,
} from '@/shared/components/ui/carousel';
import { 
  Sparkles, 
  Store, 
  ExternalLink, 
  Flame, 
  ArrowRight,
  Megaphone,
  BadgeCheck,
  Percent,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface BannerItem {
  id: string;
  badge: string;
  badgeType: 'sponsored' | 'official' | 'partner' | 'promo';
  merchantName: string;
  merchantLogo?: string;
  title: string;
  subtitle: string;
  highlights: string[];
  ctaText: string;
  targetDealId?: string;
  targetHref?: string;
  bgGradient: string;
  image: string;
  discountTag?: string;
  tags: string[];
  categories?: string[];
  channelType?: 'online' | 'offline' | 'all';
}

const SPONSORED_BANNERS: BannerItem[] = [
  {
    id: 'banner-starbucks',
    badge: '廠商贊助 · 限時特惠',
    badgeType: 'sponsored',
    merchantName: '星巴克 Starbucks',
    merchantLogo: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=120&auto=format&fit=crop&q=80',
    title: '好友分享日 · 指定特大杯飲品買一送一',
    subtitle: '限時兩天！全台實體門市指定特大杯好友分享，國泰 CUBE 卡享 3% 回饋無上限',
    highlights: ['🎯 買一送一', '☕ 自備杯折 $5', '💳 國泰 CUBE 3%'],
    ctaText: '立即查看優惠詳情',
    targetDealId: 'deal-starbucks-bogo',
    bgGradient: 'from-emerald-950/90 via-teal-950/80 to-slate-900/95',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80',
    discountTag: '🔥 買一送一',
    tags: ['#咖啡', '#星巴克', '#買一送一', '#國泰CUBE'],
    categories: ['food'],
    channelType: 'offline',
  },
  {
    id: 'banner-momo-apple',
    badge: '官方品牌旗艦館',
    badgeType: 'official',
    merchantName: 'Momo 購物網 × Apple 旗艦館',
    merchantLogo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&auto=format&fit=crop&q=80',
    title: 'Apple 旗艦破盤狂歡！iPhone 15 Pro 限時直降 $4,200',
    subtitle: '結帳領券【MOMO99】再享現折，支援 24 期 0 利率，玉山 U Bear 享 5% 回饋',
    highlights: ['💰 直降 $4,200', '💳 24期0利率', '🚀 原廠現貨免運'],
    ctaText: '搶購官方破盤價',
    targetDealId: 'deal-momo-iphone-15',
    bgGradient: 'from-indigo-950/90 via-slate-900/85 to-purple-950/95',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80',
    discountTag: '直降 $4,200',
    tags: ['#3C', '#Apple', '#iPhone', '#momo', '#玉山UBear', '#免運'],
    categories: ['tech'],
    channelType: 'online',
  },
  {
    id: 'banner-pxmart',
    badge: '實體門市聯名狂歡',
    badgeType: 'partner',
    merchantName: '全聯福利中心 PX MART',
    merchantLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    title: '週末會員狂歡購！舒潔頂級抽取式衛生紙 第 2 件 5 折',
    subtitle: '滿千再贈 800 點福利點，全支付綁定玉山銀行享 3% 全點回饋，家庭囤貨必衝',
    highlights: ['🏷️ 第 2 件 5 折', '🎁 滿千贈 800 點', '✨ 平均 $6.8/包'],
    ctaText: '查看門市特惠條件',
    targetDealId: 'deal-pxmart-weekend',
    bgGradient: 'from-rose-950/90 via-red-950/85 to-amber-950/95',
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=1200&auto=format&fit=crop&q=80',
    discountTag: '第2件5折',
    tags: ['#全聯', '#第二件5折', '#滿千折百', '#生活日用', '#超市'],
    categories: ['grocery'],
    channelType: 'offline',
  },
  {
    id: 'banner-merchant-join',
    badge: '廠商廣告贊助招募中',
    badgeType: 'promo',
    merchantName: '特價情報站 · 商務合作專區',
    title: '讓全台百萬省錢精準買家，第一時間看見您的品牌特惠！',
    subtitle: '支援電商導流、實體門市 QR 核銷防偽、自訂區域推播，自主快速上架零門檻',
    highlights: ['📍 精準區域曝光', '📱 實體 QR 核銷', '⚡ 自主立即上架'],
    ctaText: '立即申請品牌入駐 / 刊登廣告',
    targetHref: '/merchant',
    bgGradient: 'from-amber-950/90 via-orange-950/85 to-rose-950/95',
    image: 'https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=1200&auto=format&fit=crop&q=80',
    discountTag: '招商入駐中',
    tags: ['#招商', '#品牌合作', '#特價情報'],
    categories: ['entertainment', 'travel'],
    channelType: 'all',
  },
];

export const MerchantAdBanner: React.FC = () => {
  const setActiveDeal = useSetAtom(activeDealDetailAtom);
  const [filters] = useAtom(dealFiltersAtom);
  const [subscribedTags] = useAtom(subscribedTagsAtom);
  const { triggerHaptic } = useMobileNative();

  // 根據當前選取的 Tag / 分類 / 通路進行關聯過濾
  const visibleBanners = React.useMemo(() => {
    let list = SPONSORED_BANNERS;

    // 1. 若有特定標籤過濾
    if (filters.selectedTag) {
      if (filters.selectedTag === '__MY_TAGS__') {
        const cleanUserTags = subscribedTags.map((t) => t.toLowerCase().replace(/^#/, '').trim());
        const matched = list.filter((b) =>
          b.tags.some((t) => cleanUserTags.includes(t.toLowerCase().replace(/^#/, '')))
        );
        return matched.length > 0 ? matched : [SPONSORED_BANNERS[3]];
      } else {
        const cleanTag = filters.selectedTag.toLowerCase().replace(/^#/, '');
        const matched = list.filter(
          (b) =>
            b.tags.some((t) => t.toLowerCase().includes(cleanTag)) ||
            b.title.toLowerCase().includes(cleanTag) ||
            b.merchantName.toLowerCase().includes(cleanTag)
        );
        return matched.length > 0 ? matched : [SPONSORED_BANNERS[3]];
      }
    }

    // 2. 若有分類過濾
    if (filters.category && filters.category !== 'all') {
      const matched = list.filter((b) => b.categories?.includes(filters.category));
      return matched.length > 0 ? matched : list;
    }

    // 3. 若有通路過濾
    if (filters.channelType && filters.channelType !== 'all') {
      const matched = list.filter(
        (b) => b.channelType === 'all' || b.channelType === filters.channelType
      );
      return matched.length > 0 ? matched : list;
    }

    return list;
  }, [filters.selectedTag, filters.category, filters.channelType, subscribedTags]);

  const handleBannerClick = (banner: BannerItem) => {
    triggerHaptic('medium');
    if (banner.targetDealId) {
      const foundDeal = INITIAL_SMART_DEALS.find((d) => d.id === banner.targetDealId);
      if (foundDeal) {
        setActiveDeal(foundDeal);
      }
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* 基於 Embla Carousel 的高級輪播架構 */}
      <Carousel
        opts={{
          align: 'start',
          loop: visibleBanners.length > 1,
        }}
        autoplay={visibleBanners.length > 1}
        autoplayDelay={5000}
        className="w-full relative group/carousel"
      >
        {/* Banner 卡片與左右導覽箭頭獨立容器 (確保左右箭頭 100% 垂直置中於 Banner 卡片本體) */}
        <div className="relative w-full">
          <CarouselContent>
            {visibleBanners.map((banner) => (
              <CarouselItem key={banner.id} className="basis-full">
                <div
                  onClick={() => handleBannerClick(banner)}
                  className="relative w-full aspect-[4/3] md:aspect-[3/1] rounded-3xl overflow-hidden shadow-bubble border border-slate-200/80 bg-slate-950 group select-none transition-all duration-300 cursor-pointer flex flex-col justify-center"
                >
                  {/* 1. 高畫質背景圖與平滑視差微動效 */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-105 group-hover:scale-100 opacity-40 filter blur-[0.5px]"
                    style={{ backgroundImage: `url(${banner.image})` }}
                  />

                  {/* 2. 質感多層次漸層遮罩 */}
                  <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r ${banner.bgGradient} transition-colors duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                  {/* 3. 廣告角標 (右上角 Sponsor 標示 & 合作通道) */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-6 z-20 flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/45 backdrop-blur-md text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-sm">
                      <Megaphone className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
                      <span>廠商廣告 / AD</span>
                    </span>
                    <Link
                      href="/merchant"
                      onClick={(e) => e.stopPropagation()}
                      className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-rose-200 hover:text-white px-3 py-1 rounded-full bg-rose-500/25 hover:bg-rose-500/45 backdrop-blur-md border border-rose-400/30 transition-all shadow-sm active:scale-95"
                    >
                      <span>刊登廣告</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 4. Banner 核心內容區域 */}
                  <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-14 py-4 sm:py-6 md:py-8 flex flex-col justify-center max-w-3xl">
                    {/* 品牌商與標籤 */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-sm">
                        <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                        <span>{banner.badge}</span>
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-200 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 rounded-full border border-white/10">
                        <Store className="w-3 h-3 text-emerald-400" />
                        <span>{banner.merchantName}</span>
                      </span>
                    </div>

                    {/* 大標題 */}
                    <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug mb-1.5 sm:mb-2 drop-shadow-md group-hover:text-amber-200 transition-colors line-clamp-2">
                      {banner.title}
                    </h2>

                    {/* 副標題 / 詳情摘要 */}
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-200/90 leading-relaxed mb-2.5 sm:mb-3.5 max-w-2xl line-clamp-1 sm:line-clamp-2 drop-shadow font-medium">
                      {banner.subtitle}
                    </p>

                    {/* 特惠亮點膠囊與 CTA 按鈕 */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pr-14 sm:pr-16 md:pr-0">
                      {/* 亮點標籤 */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        {banner.highlights.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-sm"
                          >
                            <BadgeCheck className="w-3 h-3 text-amber-400" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>

                      {/* 行動按鈕 */}
                      {banner.targetHref ? (
                        <Link
                          href={banner.targetHref}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-900 bg-white hover:bg-amber-300 active:scale-95 shadow-lg transition-all"
                        >
                          <span>{banner.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBannerClick(banner);
                          }}
                          className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-900 bg-white hover:bg-rose-50 hover:text-rose-600 active:scale-95 shadow-lg transition-all cursor-pointer"
                        >
                          <span>{banner.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 左右導覽箭頭 (Embla Carousel 驅動，僅在多於 1 張時顯示並置中於 Banner 卡片) */}
          <CarouselPrevious />
          <CarouselNext />

          {/* 右下角精緻 Banner 頁碼指示器 (例如: 1 / 4) */}
          <CarouselCounter className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-20 pointer-events-none" />
        </div>
      </Carousel>
    </section>
  );
};
