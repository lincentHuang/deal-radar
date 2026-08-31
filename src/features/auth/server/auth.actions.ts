'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import {
  loginWithEmailSchema,
  registerWithEmailSchema,
  googleAuthCallbackSchema,
  updateProfileSchema,
  syncUserDataSchema,
  LoginWithEmailInput,
  RegisterWithEmailInput,
  GoogleAuthCallbackInput,
  UpdateProfileInput,
} from '@/features/auth/schemas/auth.schema';
import {
  findUserByEmail,
  findUserById,
  createUserWithEmail,
  createOrLinkGoogleUser,
  toSessionUser,
  getUserBookmarks,
  getUserSubscriptionTags,
  toggleUserBookmark,
  setUserSubscriptionTags,
  syncUserLocalData,
  updateUserProfile,
} from '@/features/auth/server/auth-dal';
import { AuthResponse, SessionUser, UserProfileData } from '@/features/auth/types/auth.types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'deal-aggregator-jwt-auth-secret-key-secure-2026'
);
const COOKIE_NAME = 'deal_aggregator_session';
const TOKEN_EXPIRY = '30d'; // 30 天長效登入

/**
 * 建立並寫入 JWT Session Cookie
 */
async function setSessionCookie(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    provider: user.provider,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  });

  return token;
}

/**
 * 清除 Session Cookie
 */
async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * 取得當前 Session 登入使用者
 */
export async function getCurrentUserAction(): Promise<AuthResponse<UserProfileData>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return { success: false, message: '未登入' };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;

    const user = await findUserById(userId);
    if (!user) {
      await clearSessionCookie();
      return { success: false, message: '用戶不存在或已失效' };
    }

    const sessionUser = toSessionUser(user);
    const bookmarks = await getUserBookmarks(user.id);
    const tags = await getUserSubscriptionTags(user.id);

    return {
      success: true,
      user: sessionUser,
      data: {
        user: sessionUser,
        subscribedTags: tags,
        bookmarkedDealIds: bookmarks,
      },
    };
  } catch (error) {
    return { success: false, message: '驗證過期或無效' };
  }
}

/**
 * Email + 密碼 註冊
 */
export async function registerWithEmailAction(
  rawInput: RegisterWithEmailInput
): Promise<AuthResponse<UserProfileData>> {
  try {
    const parsed = registerWithEmailSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || '輸入資料格式錯誤',
      };
    }

    const { email, password, name } = parsed.data;

    // 檢查 Email 是否已存在
    const existing = await findUserByEmail(email);
    if (existing) {
      return {
        success: false,
        error: '該 Email 已被註冊，請直接登入或使用其他 Email',
      };
    }

    // 密碼雜湊
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 建立新會員
    const newUser = await createUserWithEmail({
      email,
      name,
      passwordHash,
    });

    const sessionUser = toSessionUser(newUser);
    await setSessionCookie(sessionUser);

    const bookmarks = await getUserBookmarks(newUser.id);
    const tags = await getUserSubscriptionTags(newUser.id);

    return {
      success: true,
      message: '🎉 註冊成功！歡迎加入特價情報站',
      user: sessionUser,
      data: {
        user: sessionUser,
        subscribedTags: tags,
        bookmarkedDealIds: bookmarks,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || '註冊過程中發生錯誤，請稍後再試',
    };
  }
}

/**
 * Email + 密碼 登入
 */
export async function loginWithEmailAction(
  rawInput: LoginWithEmailInput
): Promise<AuthResponse<UserProfileData>> {
  try {
    const parsed = loginWithEmailSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || '請輸入正確的 Email 與密碼',
      };
    }

    const { email, password } = parsed.data;
    const user = await findUserByEmail(email);

    if (!user || !user.passwordHash) {
      return {
        success: false,
        error: '帳號或密碼錯誤，若您曾使用 Google 登入請點擊 Google 登入',
      };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        error: '密碼錯誤，請重新確認',
      };
    }

    const sessionUser = toSessionUser(user);
    await setSessionCookie(sessionUser);

    const bookmarks = await getUserBookmarks(user.id);
    const tags = await getUserSubscriptionTags(user.id);

    return {
      success: true,
      message: `歡迎回來，${sessionUser.name}！`,
      user: sessionUser,
      data: {
        user: sessionUser,
        subscribedTags: tags,
        bookmarkedDealIds: bookmarks,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || '登入失敗，請稍後再試',
    };
  }
}

/**
 * Google SSO 一鍵登入 / 註冊
 */
export async function loginWithGoogleAction(
  rawInput: GoogleAuthCallbackInput
): Promise<AuthResponse<UserProfileData>> {
  try {
    const parsed = googleAuthCallbackSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Google 授權資訊不齊全',
      };
    }

    const { email, name, avatar, googleId } = parsed.data;

    // 建立或關聯 Google 帳號
    const user = await createOrLinkGoogleUser({
      email,
      name,
      avatar,
      googleId,
    });

    const sessionUser = toSessionUser(user);
    await setSessionCookie(sessionUser);

    const bookmarks = await getUserBookmarks(user.id);
    const tags = await getUserSubscriptionTags(user.id);

    return {
      success: true,
      message: `Google 帳號連線成功！歡迎 ${sessionUser.name}`,
      user: sessionUser,
      data: {
        user: sessionUser,
        subscribedTags: tags,
        bookmarkedDealIds: bookmarks,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Google 登入失敗',
    };
  }
}

/**
 * 登出
 */
export async function logoutAction(): Promise<AuthResponse> {
  await clearSessionCookie();
  return {
    success: true,
    message: '已成功登出會員帳號',
  };
}

/**
 * 雲端資料同步（合併未登入時的本地標籤與收藏）
 */
export async function syncUserDataAction(
  localTags?: string[],
  localBookmarkIds?: string[]
): Promise<AuthResponse<{ tags: string[]; bookmarkIds: string[] }>> {
  try {
    const currentUser = await getCurrentUserAction();
    if (!currentUser.success || !currentUser.user) {
      return { success: false, error: '請先登入後再同步資料' };
    }

    const synced = await syncUserLocalData(
      currentUser.user.id,
      localTags,
      localBookmarkIds
    );

    return {
      success: true,
      message: '雲端同步完成',
      data: synced,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || '同步失敗',
    };
  }
}

/**
 * 切換單一情報收藏 (Toggle Bookmark)
 */
export async function toggleBookmarkAction(
  dealId: string
): Promise<AuthResponse<{ bookmarked: boolean; count: number }>> {
  try {
    const currentUser = await getCurrentUserAction();
    if (!currentUser.success || !currentUser.user) {
      return { success: false, error: 'NEED_LOGIN', message: '請先登入會員以收藏特惠' };
    }

    const result = await toggleUserBookmark(currentUser.user.id, dealId);
    return {
      success: true,
      data: result,
      message: result.bookmarked ? '已加入會員收藏' : '已取消收藏',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || '收藏操作失敗',
    };
  }
}

/**
 * 更新會員訂閱標籤池
 */
export async function updateUserTagsAction(
  tags: string[]
): Promise<AuthResponse<string[]>> {
  try {
    const currentUser = await getCurrentUserAction();
    if (!currentUser.success || !currentUser.user) {
      return { success: false, error: 'NEED_LOGIN' };
    }

    const updatedTags = await setUserSubscriptionTags(currentUser.user.id, tags);
    return {
      success: true,
      data: updatedTags,
      message: '已更新個人追蹤標籤',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || '更新標籤失敗',
    };
  }
}

/**
 * 更新會員基本資料
 */
export async function updateUserProfileAction(
  rawInput: UpdateProfileInput
): Promise<AuthResponse<SessionUser>> {
  try {
    const currentUser = await getCurrentUserAction();
    if (!currentUser.success || !currentUser.user) {
      return { success: false, error: '請先登入' };
    }

    const parsed = updateProfileSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || '格式錯誤',
      };
    }

    const updated = await updateUserProfile(currentUser.user.id, parsed.data);
    const sessionUser = toSessionUser(updated);
    await setSessionCookie(sessionUser);

    return {
      success: true,
      message: '個人資料已更新',
      user: sessionUser,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || '更新資料失敗',
    };
  }
}
