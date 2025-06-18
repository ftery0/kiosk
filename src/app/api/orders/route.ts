import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");

    const now = new Date();
    let startDate: Date | undefined;

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        const day = now.getDay();
        const diffToMonday = (day + 6) % 7;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - diffToMonday);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = undefined;
    }

    const where = startDate
      ? {
          orderedAt: {
            gte: startDate,
          },
        }
      : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { orderedAt: "desc" },
      include: {
        items: {
          include: { menu: true },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("주문 내역 조회 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const menuIds = items.map((item: any) => item.id);
    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
    });

    const order = await prisma.order.create({
      data: {
        items: {
          create: items.map((item: any) => {
            const menu = menus.find((m) => m.id === item.id);
            const price = menu?.price || 0;
            return {
              menu: { connect: { id: item.id } },
              quantity: item.quantity,
              totalPrice: price * item.quantity,
            };
          }),
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("주문 생성 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
