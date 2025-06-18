import { Category } from "@/types/category.type";

export const fetchCategories = async (): Promise<Category[]> => {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("카테고리 조회 실패");
    return res.json();
  };
  
  export const createCategory = async (name: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("카테고리 생성 실패");
  };
  
  export const updateCategory = async (id: number, name: string) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("카테고리 수정 실패");
  };
  
  export const deleteCategory = async (id: number) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("카테고리 삭제 실패");
  };