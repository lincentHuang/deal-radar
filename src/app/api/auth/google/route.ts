import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { 
        error: 'GOOGLE_CLIENT_ID_MISSING', 
        message: '未設定 NEXT_PUBLIC_GOOGLE_CLIENT_ID，請至 Google Cloud Console 建立 OAuth 2.0 憑證並填入 .env.local' 
      },
      { status: 400 }
    );
  }

  // 取得當前網址 Host 作為 Redirect URI
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/';

  // 產生 Google OAuth 2.0 授權網址
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');
  googleAuthUrl.searchParams.set('state', encodeURIComponent(returnTo));

  return NextResponse.redirect(googleAuthUrl.toString());
}
