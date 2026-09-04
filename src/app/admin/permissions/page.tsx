import { getAdminUsersList } from '@/features/admin/server/admin-permission-dal';
import { getRolePermissionMatrix } from '@/features/admin/server/admin-permission.actions';
import { AdminPermissionManager } from '@/features/admin/components/admin-permission-manager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '管理權限編輯與成員名冊 | 特價情報站 Super Admin',
};

export default async function AdminPermissionsPage() {
  const [{ users, stats }, matrix] = await Promise.all([
    getAdminUsersList(),
    getRolePermissionMatrix(),
  ]);

  return (
    <AdminPermissionManager
      initialUsers={users}
      initialStats={stats}
      permissionMatrix={matrix}
    />
  );
}
