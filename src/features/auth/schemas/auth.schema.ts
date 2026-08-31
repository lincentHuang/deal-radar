import { z } from 'zod';

export const loginWithEmailSchema = z.object({
  email: z.string().min(1, '請輸入 Email').email('請輸入有效的 Email 地址'),
  password: z.string().min(6, '密碼長度至少需 6 個字元'),
});

export type LoginWithEmailInput = z.infer<typeof loginWithEmailSchema>;

export const registerWithEmailSchema = z.object({
  name: z.string().min(2, '暱稱至少需 2 個字元').max(30, '暱稱不可超過 30 個字元'),
  email: z.string().min(1, '請輸入 Email').email('請輸入有效的 Email 地址'),
  password: z.string().min(6, '密碼長度至少需 6 個字元'),
  confirmPassword: z.string().min(6, '請再次確認密碼'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '兩次輸入的密碼不一致',
  path: ['confirmPassword'],
});

export type RegisterWithEmailInput = z.infer<typeof registerWithEmailSchema>;

export const googleAuthCallbackSchema = z.object({
  email: z.string().email('無效的 Google Email'),
  name: z.string().min(1, '缺少 Google 使用者名稱'),
  avatar: z.string().optional(),
  googleId: z.string().min(1, '缺少 Google ID'),
});

export type GoogleAuthCallbackInput = z.infer<typeof googleAuthCallbackSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, '暱稱至少需 2 個字元').max(30, '暱稱不可超過 30 個字元').optional(),
  avatar: z.string().url('請輸入有效的頭像圖片網址').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const syncUserDataSchema = z.object({
  tags: z.array(z.string()).optional(),
  bookmarkIds: z.array(z.string()).optional(),
});

export type SyncUserDataInput = z.infer<typeof syncUserDataSchema>;
