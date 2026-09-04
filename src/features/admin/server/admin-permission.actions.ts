'use server';

import { 
  getAdminUsersList, 
  updateUserRoleInDb, 
  getAdminSecurityConfigFromDb, 
  verifyAdminPinFromDb, 
  updateAdminPinInDb, 
  setQuickDemoUnlockInDb 
} from './admin-permission-dal';
import { addCrawlerLog } from './admin-dal';
import { 
  AdminUserItem, 
  AdminUserStats, 
  AdminSecurityConfig, 
  RolePermissionMatrixItem 
} from '../types/admin-permission.types';
import { 
  UpdateUserRoleSchema, 
  ChangeAdminPinSchema 
} from '../schemas/admin-permission.schema';
import { UserRole } from '@/features/auth/types/auth.types';
import { revalidatePath } from 'next/cache';

/**
 * 查詢使用者名冊與統計數據
 */
export async function getAdminUsersAction(options?: {
  search?: string;
  role?: UserRole | 'ALL';
}): Promise<{
  success: boolean;
  users: AdminUserItem[];
  stats: AdminUserStats;
  message?: string;
}> {
  try {
    const data = await getAdminUsersList(options);
    return {
      success: true,
      users: data.users,
      stats: data.stats,
    };
  } catch (error: any) {
    return {
      success: false,
      users: [],
      stats: { totalUsers: 0, adminCount: 0, merchantCount: 0, userCount: 0, recentActiveCount: 0 },
      message: error.message || '無法取得使用者清單',
    };
  }
}

/**
 * 變更特定使用者權限角色
 */
export async function updateUserRoleAction(input: {
  userId: string;
  role: UserRole;
  userName?: string;
}): Promise<{ success: boolean; message: string }> {
  const parsed = UpdateUserRoleSchema.safeParse({ userId: input.userId, role: input.role });
  if (!parsed.success) {
    return { success: false, message: '參數驗證失敗：' + parsed.error.issues[0]?.message };
  }

  const ok = await updateUserRoleInDb(parsed.data.userId, parsed.data.role);
  if (!ok) {
    return { success: false, message: '更新角色失敗，請檢查資料庫連線' };
  }

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `權限異動：管理者將成員【${input.userName || input.userId}】之權限指派為【${parsed.data.role}】`,
  });

  revalidatePath('/admin');
  revalidatePath('/admin/permissions');
  return { success: true, message: `已成功將角色權限更新為 ${parsed.data.role}！` };
}

/**
 * 讀取後台安全配置
 */
export async function getAdminSecurityConfigAction(): Promise<AdminSecurityConfig> {
  return await getAdminSecurityConfigFromDb();
}

/**
 * 變更管理員安全 PIN 碼
 */
export async function changeAdminPinAction(input: {
  currentPin: string;
  newPin: string;
  confirmPin: string;
}): Promise<{ success: boolean; message: string }> {
  const parsed = ChangeAdminPinSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || '驗證失敗' };
  }

  const isCurrentPinValid = await verifyAdminPinFromDb(parsed.data.currentPin);
  if (!isCurrentPinValid) {
    return { success: false, message: '目前的 PIN 碼驗證錯誤，無法進行修改' };
  }

  const updated = await updateAdminPinInDb(parsed.data.newPin);
  if (!updated) {
    return { success: false, message: '更新 PIN 碼失敗，請稍後重試' };
  }

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: '安全警告：最高管理員已於後台成功更新安全 PIN 碼',
  });

  return { success: true, message: '🎉 安全 PIN 碼已成功變更！請妥善保管新密鑰。' };
}

/**
 * 切換生產環境快速演示解鎖開關
 */
export async function toggleQuickDemoUnlockAction(enabled: boolean): Promise<{ success: boolean; message: string }> {
  const ok = await setQuickDemoUnlockInDb(enabled);
  if (!ok) {
    return { success: false, message: '儲存設定失敗' };
  }

  await addCrawlerLog({
    type: 'manual',
    status: 'success',
    crawledCount: 0,
    insertedCount: 0,
    message: `安全設定：管理者將一鍵快速演示解鎖模式設為：${enabled ? '開啟' : '關閉'}`,
  });

  revalidatePath('/admin');
  revalidatePath('/admin/settings');
  return {
    success: true,
    message: enabled ? '已開啟快速展示模式（允許 8888 快速解鎖）' : '已關閉快速展示模式（僅能使用真實 PIN 碼解鎖）',
  };
}

/**
 * 靜態角色權限矩陣定義
 */
export async function getRolePermissionMatrix(): Promise<RolePermissionMatrixItem[]> {
  return [
    {
      module: '特價卡片情報',
      action: '瀏覽、搜尋與收藏特價',
      user: true,
      merchant: true,
      admin: true,
      description: '全站所有登入會員之基礎功能',
    },
    {
      module: '特價卡片情報',
      action: '自訂個人追蹤標籤與即時通知',
      user: true,
      merchant: true,
      admin: true,
      description: '個人化推薦與折扣追蹤',
    },
    {
      module: '商家廣告投放',
      action: '建立與刊登品牌專屬橫幅廣告',
      user: false,
      merchant: true,
      admin: true,
      description: '品牌特約商戶專屬廣告看板與受眾投放',
    },
    {
      module: '商家廣告投放',
      action: '檢視全域廣告 CTR 與點閱率成效',
      user: false,
      merchant: true,
      admin: true,
      description: '廣告後台數據監控與預算審批',
    },
    {
      module: '爬蟲排程中控',
      action: '手動觸發即時全網爬蟲採集',
      user: false,
      merchant: false,
      admin: true,
      description: '需消耗外部 API 配額與伺服器資源，僅限最高管理員',
    },
    {
      module: '爬蟲排程中控',
      action: '調整黃金波段與站點階梯排程',
      user: false,
      merchant: false,
      admin: true,
      description: '常駐 Daemon 排程與深夜靜默時間調整',
    },
    {
      module: '全域卡片管理',
      action: '批次編輯、熱門置頂與過期清理',
      user: false,
      merchant: false,
      admin: true,
      description: '全站特惠資料庫直接讀寫與清洗',
    },
    {
      module: '管理權限編輯',
      action: '調整使用者權限與指派商家/管理員',
      user: false,
      merchant: false,
      admin: true,
      description: '最高管理核心，掌控系統帳號與權限分發',
    },
    {
      module: '管理權限編輯',
      action: '修改最高安全 PIN 碼與演示模式',
      user: false,
      merchant: false,
      admin: true,
      description: '系統安全核心金鑰與防禦配置',
    },
  ];
}
