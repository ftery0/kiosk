import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: '유효하지 않은 ID' }, { status: 400 });

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const priceStr = formData.get('price') as string | null;
    const categoryIdStr = formData.get('categoryId') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!name || !priceStr || !categoryIdStr) {
      return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 });
    }

    const updateData: any = {
      name,
      price: parseInt(priceStr, 10),
      categoryId: parseInt(categoryIdStr, 10),
    };

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const timestamp = Date.now();
      const filename = `${timestamp}_${imageFile.name.replace(/\s/g, '_')}`;
      const savePath = path.join(process.cwd(), 'public/images', filename);
      await writeFile(savePath, buffer);
      updateData.imagePath = `/images/${filename}`;
    }

    const updated = await prisma.menu.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('메뉴 수정 실패:', error);
    return NextResponse.json({ error: '수정 중 오류 발생' }, { status: 500 });
  }
}


export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "유효하지 않은 ID" }, { status: 400 });
  
    try {
      
      const menu = await prisma.menu.findUnique({
        where: { id },
        select: { imagePath: true },
      });
  
      if (!menu) {
        return NextResponse.json({ error: "메뉴를 찾을 수 없습니다." }, { status: 404 });
      }
  
      
      if (menu.imagePath) {
        const imageFilePath = path.join(process.cwd(), "public", menu.imagePath);
        try {
          await unlink(imageFilePath); 
        } catch (err) {
          console.warn(`이미지 파일 삭제 실패: ${imageFilePath}`, err);
          
        }
      }
  
      
      await prisma.menu.delete({ where: { id } });
  
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("메뉴 삭제 실패:", error);
      return NextResponse.json({ error: "삭제 중 오류 발생" }, { status: 500 });
    }
  }