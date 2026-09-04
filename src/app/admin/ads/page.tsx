import { getAdCampaigns } from '@/features/ads/server/ads-dal';
import { AdminAdsMonitor } from '@/features/admin/components/admin-ads-monitor';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '廣告投放與成效全域監控 | 特價情報站 Super Admin',
};

export default async function AdminAdsPage() {
  const campaigns = await getAdCampaigns();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            全域廣告投放與成效監控
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            ADS MONITOR
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          即時監看特約商家之 Hero Banner、點閱率 (CTR)、曝光次數與行銷檔期預算審批。
        </p>
      </div>

      <AdminAdsMonitor initialCampaigns={campaigns} />
    </div>
  );
}
