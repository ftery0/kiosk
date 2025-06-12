import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menu: {
              select: {
                nameKo: true,
                nameEn: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: '주문 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const order = await prisma.order.create({
      data: {
        tableNumber: data.tableNumber,
        isTakeout: data.isTakeout,
        status: 'PENDING',
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map((item: any) => ({
            menuId: item.menuId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: '주문 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 