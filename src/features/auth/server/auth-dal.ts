import 'server-only';
import { prisma } from '@/shared/lib/prisma';
import { SessionUser } from '@/features/auth/types/auth.types';

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      accounts: true,
      subscriptionTags: true,
      bookmarks: true,
    },
  });
}

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: true,
      subscriptionTags: true,
      bookmarks: true,
    },
  });
}

export async function findUserByGoogleId(googleId: string) {
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: googleId,
      },
    },
    include: {
      user: {
        include: {
          accounts: true,
          subscriptionTags: true,
          bookmarks: true,
        },
      },
    },
  });

  return account?.user ?? null;
}

export async function createUserWithEmail(data: {
  email: string;
  name: string;
  passwordHash: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  
  return await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: data.name.trim(),
      passwordHash: data.passwordHash,
      role: 'USER',
      accounts: {
        create: {
          provider: 'email',
          providerAccountId: normalizedEmail,
        },
      },
      // 預設訂閱推薦標籤
      subscriptionTags: {
        createMany: {
          data: [
            { tagName: '#咖啡' },
            { tagName: '#買一送一' },
            { tagName: '#國泰CUBE' },
          ],
        },
      },
    },
    include: {
      accounts: true,
      subscriptionTags: true,
      bookmarks: true,
    },
  });
}

export async function createOrLinkGoogleUser(data: {
  email: string;
  name: string;
  avatar?: string;
  googleId: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  
  // 1. 檢查是否已存在該 Email 的使用者
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { accounts: true },
  });

  if (existingUser) {
    // 檢查是否已綁定 Google Account，若無則建立關聯
    const hasGoogleAccount = existingUser.accounts.some(
      (acc) => acc.provider === 'google' && acc.providerAccountId === data.googleId
    );

    if (!hasGoogleAccount) {
      await prisma.account.create({
        data: {
          userId: existingUser.id,
          provider: 'google',
          providerAccountId: data.googleId,
        },
      });
    }

    // 若有新的頭像或名稱，更新使用者資料
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: data.name || existingUser.name,
        avatar: data.avatar || existingUser.avatar,
      },
      include: {
        accounts: true,
        subscriptionTags: true,
        bookmarks: true,
      },
    });

    return updated;
  }

  // 2. 建立全新的 Google 使用者
  return await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: data.name.trim(),
      avatar: data.avatar,
      role: 'USER',
      accounts: {
        create: {
          provider: 'google',
          providerAccountId: data.googleId,
        },
      },
      subscriptionTags: {
        createMany: {
          data: [
            { tagName: '#咖啡' },
            { tagName: '#買一送一' },
            { tagName: '#國泰CUBE' },
          ],
        },
      },
    },
    include: {
      accounts: true,
      subscriptionTags: true,
      bookmarks: true,
    },
  });
}

export async function updateUserProfile(userId: string, data: { name?: string; avatar?: string }) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
    },
  });
}

export async function getUserBookmarks(userId: string): Promise<string[]> {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    select: { dealId: true },
    orderBy: { createdAt: 'desc' },
  });
  return bookmarks.map((b) => b.dealId);
}

export async function toggleUserBookmark(userId: string, dealId: string): Promise<{ bookmarked: boolean; count: number }> {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_dealId: {
        userId,
        dealId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId,
        dealId,
      },
    });
  }

  const bookmarks = await getUserBookmarks(userId);
  return {
    bookmarked: !existing,
    count: bookmarks.length,
  };
}

export async function getUserSubscriptionTags(userId: string): Promise<string[]> {
  const tags = await prisma.userSubscriptionTag.findMany({
    where: { userId },
    select: { tagName: true },
    orderBy: { createdAt: 'asc' },
  });
  return tags.map((t) => t.tagName);
}

export async function setUserSubscriptionTags(userId: string, tags: string[]): Promise<string[]> {
  const uniqueTags = Array.from(new Set(tags.map((t) => t.trim()))).filter((t) => t.length > 0);

  // 交易保護：先刪除舊的，再插入新的
  await prisma.$transaction([
    prisma.userSubscriptionTag.deleteMany({
      where: { userId },
    }),
    prisma.userSubscriptionTag.createMany({
      data: uniqueTags.map((tagName) => ({
        userId,
        tagName,
      })),
    }),
  ]);

  return uniqueTags;
}

export async function syncUserLocalData(
  userId: string,
  localTags?: string[],
  localBookmarkIds?: string[]
): Promise<{ tags: string[]; bookmarkIds: string[] }> {
  // 1. 合併標籤
  const dbTags = await getUserSubscriptionTags(userId);
  const mergedTags = Array.from(new Set([...dbTags, ...(localTags || [])]));
  if (mergedTags.length > dbTags.length) {
    await setUserSubscriptionTags(userId, mergedTags);
  }

  // 2. 合併收藏
  const dbBookmarks = await getUserBookmarks(userId);
  const newBookmarks = (localBookmarkIds || []).filter((id) => !dbBookmarks.includes(id));
  if (newBookmarks.length > 0) {
    await prisma.bookmark.createMany({
      data: newBookmarks.map((dealId) => ({
        userId,
        dealId,
      })),
      // 容錯防重複
    });
  }

  const finalBookmarks = await getUserBookmarks(userId);
  const finalTags = await getUserSubscriptionTags(userId);

  return {
    tags: finalTags,
    bookmarkIds: finalBookmarks,
  };
}

export function toSessionUser(user: {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  accounts?: Array<{ provider: string }>;
  createdAt?: Date;
}): SessionUser {
  const hasGoogle = user.accounts?.some((a) => a.provider === 'google');
  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email.split('@')[0],
    avatar: user.avatar,
    role: (user.role as SessionUser['role']) || 'USER',
    provider: hasGoogle ? 'google' : 'email',
    createdAt: user.createdAt?.toISOString(),
  };
}
