import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const cookie = request.cookies.get('admin-auth')?.value;
    if (cookie !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/admin/:path*'],
};
