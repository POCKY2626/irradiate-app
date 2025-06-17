import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// この設定で、Middlewareがどのページで実行されるかを定義します。
// これにより、APIルートや内部ファイルを除外するif文が不要になります。
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the login page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};

export function middleware(request: NextRequest) {
  const password = process.env.LOGIN_PASSWORD;

  // Vercelにパスワードが設定されていない場合は、何もせず処理を中断
  if (!password) {
    console.error('Middleware Error: LOGIN_PASSWORD is not set in environment variables.');
    // 本番でクラッシュさせないために、一旦すべてのアクセスを許可する
    return NextResponse.next();
  }

  // 認証Cookieを確認
  const passwordCookie = request.cookies.get('password-protected')?.value;

  // Cookieのパスワードが正しい場合は、アクセスを許可
  if (passwordCookie === password) {
    return NextResponse.next();
  }

  // 上記以外はすべてログインページにリダイレクト
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}
