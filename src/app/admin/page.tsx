import { getDeals } from '@/features/deals/server/deals-dal';
import { getCrawlerTargets, getCrawlerSchedule, getCrawlerLogs, getAdminDashboardStats } from '@/features/admin/server/admin-dal';
import { getAdCampaigns } from '@/features/ads/server/ads-dal';
import { AdminAuthGuard } from '@/features/admin/components/admin-auth-guard';
import { AdminDashboard } from '@/features/admin/components/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [deals, targets, schedule, logs, stats, campaigns] = await Promise.all([
    getDeals(),
    getCrawlerTargets(),
    getCrawlerSchedule(),
    getCrawlerLogs(),
    getAdminDashboardStats(),
    getAdCampaigns(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <AdminAuthGuard>
        <AdminDashboard
          initialDeals={deals}
          initialTargets={targets}
          initialSchedule={schedule}
          initialLogs={logs}
          initialStats={stats}
          initialCampaigns={campaigns}
        />
      </AdminAuthGuard>
    </div>
  );
}
