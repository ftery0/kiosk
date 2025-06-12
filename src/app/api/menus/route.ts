import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: '메뉴를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const menu = await prisma.menu.create({
      data: {
        nameKo: data.nameKo,
        nameEn: data.nameEn,
        descriptionKo: data.descriptionKo,
        descriptionEn: data.descriptionEn,
        price: data.price,
        imageUrl: data.imageUrl,
        order: data.order,
        categoryId: data.categoryId,
      },
    });
    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: '메뉴 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 