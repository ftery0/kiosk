import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: '주문 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
} 