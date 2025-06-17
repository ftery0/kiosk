// app/api/menus/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');

  if (!categoryId) {
    return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
  }

  try {
    const menus = await prisma.menu.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      orderBy: { nameKo: 'asc' },
    });
    return NextResponse.json(menus);
  } catch (error) {
    console.error('메뉴 API 오류:', error);
    return NextResponse.json({ error: '메뉴 로드 실패' }, { status: 500 });
  }
}