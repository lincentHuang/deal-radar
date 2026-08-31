'use client';

import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import {
  currentUserAtom,
  authLoadingAtom,
  isAuthModalOpenAtom,
  authModalTabAtom,
} from '@/features/auth/atoms/auth-atoms';
import {
  subscribedTagsAtom,
  bookmarkedDealIdsAtom,
} from '@/features/subscriptions/atoms/subscription-atoms';
import {
  loginWithEmailAction,
  registerWithEmailAction,
  loginWithGoogleAction,
  logoutAction,
  getCurrentUserAction,
  syncUserDataAction,
  toggleBookmarkAction,
  updateUserTagsAction,
} from '@/features/auth/server/auth.actions';
import {
  LoginWithEmailInput,
  RegisterWithEmailInput,
  GoogleAuthCallbackInput,
} from '@/features/auth/schemas/auth.schema';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

export function useAuth() {
  const [user, setUser] = useAtom(currentUserAtom);
  const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
  const [isAuthModalOpen, setIsAuthModalOpen] = useAtom(isAuthModalOpenAtom);
  const [authModalTab, setAuthModalTab] = useAtom(authModalTabAtom);
  const [subscribedTags, setSubscribedTags] = useAtom(subscribedTagsAtom);
  const [bookmarkedDealIds, setBookmarkedDealIds] = useAtom(bookmarkedDealIdsAtom);
  const { triggerHaptic } = useMobileNative();

  // 1. 初始化檢查 Session
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getCurrentUserAction();
      if (res.success && res.user && res.data) {
        setUser(res.user);
        if (res.data.subscribedTags && res.data.subscribedTags.length > 0) {
          setSubscribedTags(res.data.subscribedTags);
        }
        if (res.data.bookmarkedDealIds) {
          setBookmarkedDealIds(res.data.bookmarkedDealIds);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading, setSubscribedTags, setBookmarkedDealIds]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 2. 開啟認證彈窗
  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    triggerHaptic('light');
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, [setAuthModalTab, setIsAuthModalOpen, triggerHaptic]);

  // 3. 關閉認證彈窗
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, [setIsAuthModalOpen]);

  // 4. Email 登入
  const loginWithEmail = async (input: LoginWithEmailInput) => {
    triggerHaptic('medium');
    const res = await loginWithEmailAction(input);
    if (res.success && res.user && res.data) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      triggerHaptic('success');
      
      // 合併本地與雲端資料
      const syncRes = await syncUserDataAction(subscribedTags, bookmarkedDealIds);
      if (syncRes.success && syncRes.data) {
        setSubscribedTags(syncRes.data.tags);
        setBookmarkedDealIds(syncRes.data.bookmarkIds);
      }
    }
    return res;
  };

  // 5. Email 註冊
  const registerWithEmail = async (input: RegisterWithEmailInput) => {
    triggerHaptic('medium');
    const res = await registerWithEmailAction(input);
    if (res.success && res.user && res.data) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      triggerHaptic('success');

      // 同步本地已選標籤與收藏至新帳號
      const syncRes = await syncUserDataAction(subscribedTags, bookmarkedDealIds);
      if (syncRes.success && syncRes.data) {
        setSubscribedTags(syncRes.data.tags);
        setBookmarkedDealIds(syncRes.data.bookmarkIds);
      }
    }
    return res;
  };

  // 6. Google SSO 登入 / 註冊
  const loginWithGoogle = async (input: GoogleAuthCallbackInput) => {
    triggerHaptic('medium');
    const res = await loginWithGoogleAction(input);
    if (res.success && res.user && res.data) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      triggerHaptic('success');

      // 合併雲端與本地資料
      const syncRes = await syncUserDataAction(subscribedTags, bookmarkedDealIds);
      if (syncRes.success && syncRes.data) {
        setSubscribedTags(syncRes.data.tags);
        setBookmarkedDealIds(syncRes.data.bookmarkIds);
      }
    }
    return res;
  };

  // 7. 登出
  const logout = async () => {
    triggerHaptic('medium');
    await logoutAction();
    setUser(null);
  };

  // 8. 會員切換收藏特惠 (帶 DB 持久化)
  const toggleBookmark = async (dealId: string) => {
    triggerHaptic('light');
    if (!user) {
      // 訪客模式：本地 Jotai 切換
      setBookmarkedDealIds((prev) =>
        prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId]
      );
      return { success: true, isGuest: true };
    }

    // 會員模式：寫入資料庫
    const res = await toggleBookmarkAction(dealId);
    if (res.success && res.data) {
      setBookmarkedDealIds((prev) =>
        res.data!.bookmarked ? [...prev, dealId] : prev.filter((id) => id !== dealId)
      );
    }
    return res;
  };

  // 9. 會員更新個人訂閱標籤 (帶 DB 持久化)
  const updateTags = async (tags: string[]) => {
    setSubscribedTags(tags);
    if (user) {
      await updateUserTagsAction(tags);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    setAuthModalTab,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    refreshUser,
    toggleBookmark,
    updateTags,
  };
}
