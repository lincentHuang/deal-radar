import { getDeals } from '@/features/deals/server/deals-dal';
import { DealMasonryFeed } from '@/features/deals/components/deal-masonry-feed';
import { MerchantAdBanner } from '@/features/deals/components/merchant-ad-banner';

export const revalidate = 60; // 每分鐘 ISR 增量靜態重新生成

export default async function HomePage() {
  // RSC 預先在伺服器端抓取熱門情報
  const initialDeals = await getDeals();

  return (
    <div className="w-full">
      {/* 廠商廣告贊助 Banner 輪播區 */}
      <MerchantAdBanner />

      {/* 核心瀑布流情報 Feed */}
      <DealMasonryFeed initialDeals={initialDeals} />
    </div>
  );
}
