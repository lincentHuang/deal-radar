import { z } from 'zod';

export const UserRoleSchema = z.enum(['USER', 'MERCHANT', 'ADMIN']);

export const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1, '使用者 ID 必填'),
  role: UserRoleSchema,
});

export const ChangeAdminPinSchema = z.object({
  currentPin: z.string().min(4, '請輸入目前的 PIN 碼'),
  newPin: z.string().min(4, '新 PIN 碼至少需要 4 位數').max(8, '新 PIN 碼最多 8 位數'),
  confirmPin: z.string().min(4, '請確認新 PIN 碼'),
}).refine((data) => data.newPin === data.confirmPin, {
  message: '兩次輸入的新 PIN 碼不一致',
  path: ['confirmPin'],
});

export const UpdateSecuritySettingsSchema = z.object({
  quickDemoUnlockEnabled: z.boolean(),
  sessionTimeoutMinutes: z.number().int().min(5).max(1440).default(120),
});

export type UserRoleInput = z.infer<typeof UserRoleSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type ChangeAdminPinInput = z.infer<typeof ChangeAdminPinSchema>;
export type UpdateSecuritySettingsInput = z.infer<typeof UpdateSecuritySettingsSchema>;
