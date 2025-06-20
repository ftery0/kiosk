import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith('/api');
  const isLoginPage = pathname === '/admin';
  const isAdminProtected = pathname.startsWith('/admin');

  if (isAdminProtected && !isApiRoute && !isLoginPage) {
    const cookie = request.cookies.get('admin-auth');

    if (!cookie || cookie.value !== 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
  ],
};
