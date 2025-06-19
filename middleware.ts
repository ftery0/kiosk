import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin' &&
      !request.nextUrl.pathname.startsWith('/api')) {
    
    const authCookie = request.cookies.get('admin-auth');
    
    if (!authCookie || authCookie.value !== 'true') {
  
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};