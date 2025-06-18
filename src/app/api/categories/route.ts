import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "카테고리를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const newCategory = await prisma.category.create({
      data: {
        name,
        order: 999, 
      },
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: "카테고리 생성 실패" }, { status: 500 });
  }
}
