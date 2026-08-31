export type UserRole = 'USER' | 'MERCHANT' | 'ADMIN';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: UserRole;
  provider: 'google' | 'email';
  createdAt?: string;
}

export interface AuthState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  message?: string;
  user?: SessionUser;
  data?: T;
  error?: string;
}

export interface UserProfileData {
  user: SessionUser;
  subscribedTags: string[];
  bookmarkedDealIds: string[];
}
