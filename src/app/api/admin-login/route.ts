import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-auth', password, {
      path: '/',
      httpOnly: true,
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
