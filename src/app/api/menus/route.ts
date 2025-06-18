import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises"; 
import { prisma } from "@/lib/prisma";

/**
 * 메뉴 목록을 가져오는 API
 * @param request categoryId (optional)
 * e.g., /api/menus?categoryId=1
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryIdStr = searchParams.get("categoryId");
  const where = categoryIdStr
  ? { categoryId: Number(categoryIdStr) }
  : undefined;

  try {  
  const menus = await prisma.menu.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

    return NextResponse.json(menus);
  } catch (error) {
    console.error("메뉴 조회 실패:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

/**
 * 새로운 메뉴를 추가하는 API (이미지 파일 포함)
 * @param request FormData containing name, price, categoryId, image
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const categoryIdStr = formData.get("categoryId") as string;
    const imageFile = formData.get("image") as File | null;

    // 1. 필수 필드 검증
    if (!name || !priceStr || !categoryIdStr || !imageFile) {
      return NextResponse.json({ error: "필수 항목(name, price, categoryId, image)이 누락되었습니다." }, { status: 400 });
    }

    // 2. 파일 처리
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const timestamp = Date.now();
    const filename = `${timestamp}_${imageFile.name.replace(/\s/g, "_")}`; // 공백을 '_'로 변경
    const savePath = path.join(process.cwd(), "public/images", filename);

    await writeFile(savePath, buffer);

    const imagePath = `/images/${filename}`; 

    // 3. 데이터베이스에 저장
    const newMenu = await prisma.menu.create({
      data: {
        name,
        price: parseInt(priceStr, 10),
        imagePath,
        category: {
          connect: {
            id: parseInt(categoryIdStr, 10),
          },
        },
      },
    });

    return NextResponse.json(newMenu, { status: 201 });

  } catch (error) {
    console.error("메뉴 생성 실패:", error);
    return NextResponse.json({ error: "메뉴를 생성하는 중 오류가 발생했습니다." }, { status: 500 });
  }
}