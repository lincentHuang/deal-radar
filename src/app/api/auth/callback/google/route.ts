import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { createOrLinkGoogleUser, toSessionUser } from '@/features/auth/server/auth-dal';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'deal-aggregator-jwt-auth-secret-key-secure-2026'
);
const COOKIE_NAME = 'deal_aggregator_session';
const TOKEN_EXPIRY = '30d';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const rawState = searchParams.get('state');
  const returnTo = rawState ? decodeURIComponent(rawState) : '/';

  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (error || !code) {
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error || 'Google 授權失敗')}`);
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${origin}/?auth_error=${encodeURIComponent('伺服器未設定 GOOGLE_CLIENT_SECRET')}`
    );
  }

  try {
    // 1. 向 Google 換取 Token (Access Token & ID Token)
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[Google OAuth Token Error]', tokenData);
      return NextResponse.redirect(
        `${origin}/?auth_error=${encodeURIComponent(tokenData.error_description || '換取 Google Token 失敗')}`
      );
    }

    // 2. 向 Google 取得使用者個人資料 (UserInfo)
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await userinfoResponse.json();

    if (!userinfoResponse.ok || !profile.email) {
      console.error('[Google OAuth Profile Error]', profile);
      return NextResponse.redirect(
        `${origin}/?auth_error=${encodeURIComponent('取得 Google 用戶資料失敗')}`
      );
    }

    // 3. 於 Prisma 資料庫建立或連結 User 紀錄
    const dbUser = await createOrLinkGoogleUser({
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatar: profile.picture || null,
      googleId: profile.sub,
    });

    const sessionUser = toSessionUser(dbUser);

    // 4. 簽發 JWT Session Cookie
    const token = await new SignJWT({
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name,
      role: sessionUser.role,
      provider: sessionUser.provider,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRY)
      .sign(JWT_SECRET);

    // 5. 建立重導向 Response 並寫入 HttpOnly Cookie
    const response = NextResponse.redirect(new URL(returnTo, origin));
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 天
    });

    return response;
  } catch (err: any) {
    console.error('[Google OAuth Fatal Error]', err);
    return NextResponse.redirect(
      `${origin}/?auth_error=${encodeURIComponent(err?.message || 'Google 登入處理發生未知錯誤')}`
    );
  }
}
