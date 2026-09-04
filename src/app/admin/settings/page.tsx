import { getAdminSecurityConfigFromDb } from '@/features/admin/server/admin-permission-dal';
import { AdminSecuritySettings } from '@/features/admin/components/admin-security-settings';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '系統安全與管理設定 | 特價情報站 Super Admin',
};

export default async function AdminSettingsPage() {
  const config = await getAdminSecurityConfigFromDb();

  return (
    <AdminSecuritySettings initialConfig={config} />
  );
}
