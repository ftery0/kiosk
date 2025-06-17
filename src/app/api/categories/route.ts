// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma 클라이언트 경로 확인

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' }, // 순서대로 정렬
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('카테고리 API 오류:', error);
    return NextResponse.json({ error: '카테고리 로드 실패' }, { status: 500 });
  }
}