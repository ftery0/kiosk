import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // /admin으로 시작하는 경로 중 로그인 페이지가 아닌 경우만 체크
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin' &&
      !request.nextUrl.pathname.startsWith('/api')) {
    
    const authCookie = request.cookies.get('admin-auth');
    
    if (!authCookie || authCookie.value !== 'true') {
      // 인증되지 않은 경우 로그인 페이지로 리디렉션
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};