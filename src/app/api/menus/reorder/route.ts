
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json(); 

    const updates = body.orderedIds.map(({ id, order }: { id: number, order: number }) =>
      prisma.menu.update({
        where: { id },
        data: { order },
      })
    );

    await prisma.$transaction(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "메뉴 순서 변경 실패" }, { status: 500 });
  }
}
