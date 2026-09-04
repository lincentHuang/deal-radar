import { getAdminDashboardStats, getCrawlerLogs } from '@/features/admin/server/admin-dal';
import { getAdminUsersList } from '@/features/admin/server/admin-permission-dal';
import { AdminOverview } from '@/features/admin/components/admin-overview';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [stats, { stats: userStats }, logs] = await Promise.all([
    getAdminDashboardStats(),
    getAdminUsersList(),
    getCrawlerLogs(),
  ]);

  return (
    <AdminOverview
      stats={stats}
      userStats={userStats}
      recentLogs={logs}
    />
  );
}
