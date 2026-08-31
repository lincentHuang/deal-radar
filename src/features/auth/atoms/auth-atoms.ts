import { atom } from 'jotai';
import { SessionUser } from '@/features/auth/types/auth.types';

// 當前登入會員狀態
export const currentUserAtom = atom<SessionUser | null>(null);

// 會員認證加載狀態
export const authLoadingAtom = atom<boolean>(true);

// 登入/註冊 Modal 彈窗開關
export const isAuthModalOpenAtom = atom<boolean>(false);

// 彈窗預設 Tab ('login' | 'register')
export const authModalTabAtom = atom<'login' | 'register'>('login');

// 登入成功後的重導向路徑或回呼動作描述
export const authRedirectPathAtom = atom<string | null>(null);
