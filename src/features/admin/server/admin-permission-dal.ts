import 'server-only';
import { prisma } from '@/shared/lib/prisma';
import { UserRole } from '@/features/auth/types/auth.types';
import { AdminUserItem, AdminUserStats, AdminSecurityConfig } from '../types/admin-permission.types';

const ADMIN_PIN_SETTING_KEY = 'security_admin_pin';
const QUICK_DEMO_UNLOCK_KEY = 'security_quick_demo_unlock';
const DEFAULT_PIN = process.env.ADMIN_PIN || '8888';

/**
 * 取得使用者清單與統計數據
 */
export async function getAdminUsersList(options?: {
  search?: string;
  role?: UserRole | 'ALL';
}): Promise<{ users: AdminUserItem[]; stats: AdminUserStats }> {
  try {
    const whereClause: any = {};

    if (options?.role && options.role !== 'ALL') {
      whereClause.role = options.role;
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [dbUsers, totalUsers, adminCount, merchantCount, userCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          accounts: { select: { provider: true } },
          _count: {
            select: {
              bookmarks: true,
              subscriptionTags: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'MERCHANT' } }),
      prisma.user.count({ where: { role: 'USER' } }),
    ]);

    const users: AdminUserItem[] = dbUsers.map((u) => {
      const hasGoogle = u.accounts.some((a) => a.provider === 'google');
      return {
        id: u.id,
        email: u.email,
        name: u.name || u.email.split('@')[0],
        avatar: u.avatar,
        role: (u.role as UserRole) || 'USER',
        provider: hasGoogle ? 'google' : 'email',
        createdAt: u.createdAt.toISOString(),
        bookmarksCount: u._count.bookmarks,
        tagsCount: u._count.subscriptionTags,
      };
    });

    const stats: AdminUserStats = {
      totalUsers,
      adminCount,
      merchantCount,
      userCount,
      recentActiveCount: dbUsers.length,
    };

    return { users, stats };
  } catch (error) {
    console.error('[AdminPermissionDAL] getAdminUsersList error:', error);
    return {
      users: [],
      stats: { totalUsers: 0, adminCount: 0, merchantCount: 0, userCount: 0, recentActiveCount: 0 },
    };
  }
}

/**
 * 更新特定使用者的權限角色 (USER, MERCHANT, ADMIN)
 */
export async function updateUserRoleInDb(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    return true;
  } catch (error) {
    console.error('[AdminPermissionDAL] updateUserRoleInDb error:', error);
    return false;
  }
}

/**
 * 讀取管理員安全防護配置 (PIN 碼狀態與快速演示模式)
 */
export async function getAdminSecurityConfigFromDb(): Promise<AdminSecurityConfig> {
  try {
    const [pinSetting, demoSetting] = await Promise.all([
      (prisma as any).systemSetting?.findUnique({ where: { key: ADMIN_PIN_SETTING_KEY } }).catch(() => null),
      (prisma as any).systemSetting?.findUnique({ where: { key: QUICK_DEMO_UNLOCK_KEY } }).catch(() => null),
    ]);

    return {
      hasCustomPin: Boolean(pinSetting?.value),
      quickDemoUnlockEnabled: demoSetting ? demoSetting.value === 'true' : true,
      sessionTimeoutMinutes: 120,
      lastUpdated: pinSetting?.updatedAt?.toISOString() || demoSetting?.updatedAt?.toISOString(),
    };
  } catch {
    return {
      hasCustomPin: false,
      quickDemoUnlockEnabled: true,
      sessionTimeoutMinutes: 120,
    };
  }
}

/**
 * 驗證管理員安全 PIN 碼 (優先檢查資料庫中儲存的客製化 PIN，否則使用預設 PIN)
 */
export async function verifyAdminPinFromDb(pin: string): Promise<boolean> {
  try {
    const pinSetting = await (prisma as any).systemSetting?.findUnique({
      where: { key: ADMIN_PIN_SETTING_KEY },
    }).catch(() => null);

    const validPin = pinSetting?.value || DEFAULT_PIN;
    return pin.trim() === validPin.trim();
  } catch {
    return pin.trim() === DEFAULT_PIN.trim();
  }
}

/**
 * 更新管理員安全 PIN 碼
 */
export async function updateAdminPinInDb(newPin: string): Promise<boolean> {
  try {
    await (prisma as any).systemSetting?.upsert({
      where: { key: ADMIN_PIN_SETTING_KEY },
      update: { value: newPin.trim() },
      create: { key: ADMIN_PIN_SETTING_KEY, value: newPin.trim() },
    });
    return true;
  } catch (error) {
    console.error('[AdminPermissionDAL] updateAdminPinInDb error:', error);
    return false;
  }
}

/**
 * 切換快速展示模式開關
 */
export async function setQuickDemoUnlockInDb(enabled: boolean): Promise<boolean> {
  try {
    await (prisma as any).systemSetting?.upsert({
      where: { key: QUICK_DEMO_UNLOCK_KEY },
      update: { value: enabled ? 'true' : 'false' },
      create: { key: QUICK_DEMO_UNLOCK_KEY, value: enabled ? 'true' : 'false' },
    });
    return true;
  } catch (error) {
    console.error('[AdminPermissionDAL] setQuickDemoUnlockInDb error:', error);
    return false;
  }
}
