import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { orderId, paymentMethod, amount } = data;

    // 결제 정보 생성
    const payment = await prisma.payment.create({
      data: {
        orderId,
        paymentMethod,
        amount,
        status: 'COMPLETED',
      },
    });

    // 주문 상태 업데이트
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PENDING',
        paymentId: payment.id,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: '결제 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
} 