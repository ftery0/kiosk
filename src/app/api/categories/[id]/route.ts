import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { name } = await req.json();
    const id = Number(params.id);

    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "카테고리 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const id = Number(params.id);


    const relatedMenus = await prisma.menu.findFirst({ where: { categoryId: id } });

    if (relatedMenus) {
 
      return NextResponse.json(
        { error: "해당 카테고리에 메뉴가 존재하여 삭제할 수 없습니다." },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json({ error: "카테고리 삭제 실패" }, { status: 500 });
  }
}
