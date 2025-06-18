import { NextResponse } from "next/server";
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
    console.error("카테고리 조회 실패:", error);
    return NextResponse.json({ error: "카테고리를 불러오는 중 오류가 발생했습니다." }, { status: 500 });
  }
}
