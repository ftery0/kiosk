import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { orderedIds }: { orderedIds: number[] } = await req.json();

    const updatePromises = orderedIds.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { order: index },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "카테고리 순서 변경 실패" },
      { status: 500 }
    );
  }
}
