import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PASSWORD_COOKIE_NAME = 'password-protected';

export function middleware(request: NextRequest) {
  // --- ▼▼▼ ここからが修正箇所です ▼▼▼ ---
  const correctPassword = process.env.LOGIN_PASSWORD;

  // もしVercelにパスワードが設定されていなかったら、エラーをログに出してmiddlewareを停止する
  if (!correctPassword) {
    console.error('LOGIN_PASSWORD environment variable is not set!');
    // 本番環境でクラッシュするのを防ぐため、一旦アクセスを許可する
    // 設定完了後にこのブロックは削除してもOK
    return NextResponse.next();
  }
  // --- ▲▲▲ 修正はここまで ▲▲▲ ---

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const passwordCookie = request.cookies.get(PASSWORD_COOKIE_NAME);

  if (passwordCookie?.value === correctPassword) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl);
}
