import { Category } from "@/types/category.type";

export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch("/api/categories", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("카테고리 불러오기 실패");
    return res.json();
  }
  