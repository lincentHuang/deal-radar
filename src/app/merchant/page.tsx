import { getDeals } from '@/features/deals/server/deals-dal';
import { getAdCampaigns } from '@/features/ads/server/ads-dal';
import { MerchantDashboard } from '@/features/merchant/components/merchant-dashboard';

export const dynamic = 'force-dynamic';

export default async function MerchantPage() {
  const [deals, campaigns] = await Promise.all([
    getDeals(),
    getAdCampaigns(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <MerchantDashboard allDeals={deals} allCampaigns={campaigns} />
    </div>
  );
}
