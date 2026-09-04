import { UserRole } from '@/features/auth/types/auth.types';

export interface AdminUserItem {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  provider: 'google' | 'email';
  createdAt: string;
  bookmarksCount: number;
  tagsCount: number;
}

export interface AdminUserStats {
  totalUsers: number;
  adminCount: number;
  merchantCount: number;
  userCount: number;
  recentActiveCount: number;
}

export interface RolePermissionMatrixItem {
  module: string;
  action: string;
  user: boolean;
  merchant: boolean;
  admin: boolean;
  description: string;
}

export interface AdminSecurityConfig {
  hasCustomPin: boolean;
  quickDemoUnlockEnabled: boolean;
  sessionTimeoutMinutes: number;
  lastUpdated?: string;
}
