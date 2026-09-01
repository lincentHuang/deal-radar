import { getPaginatedDeals } from '@/features/deals/server/deals-dal';
import { DealMasonryFeed } from '@/features/deals/components/deal-masonry-feed';
import { MerchantAdBanner } from '@/features/deals/components/merchant-ad-banner';

export const revalidate = 60; // 每分鐘 ISR 增量靜態重新生成

export default async function HomePage() {
  // RSC 僅預先在伺服器端抓取首屏 12 筆情報（極速 FCP / LCP，減少 Initial Payload）
  const initialData = await getPaginatedDeals(undefined, 1, 12);

  return (
    <div className="w-full">
      {/* 廠商廣告贊助 Banner 輪播區 */}
      <MerchantAdBanner />

      {/* 核心瀑布流情報 Feed (支援瀑布動態滾動載入模式) */}
      <DealMasonryFeed
        initialDeals={initialData.deals}
        initialHasMore={initialData.hasMore}
        initialTotal={initialData.total}
      />
    </div>
  );
}
