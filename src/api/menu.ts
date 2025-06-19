export async function fetchMenusByCategory(categoryId: number | null) {
  const query = categoryId !== null ? `?categoryId=${encodeURIComponent(categoryId)}` : "";
  const res = await fetch(`/api/menus${query}`);
  if (!res.ok) throw new Error("Failed to fetch menus");
  return res.json();
}



export async function updateMenu(id: number, formData: FormData): Promise<void> {
  const res = await fetch(`/api/menus/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) throw new Error('메뉴 수정 실패');
}


export async function deleteMenu(id: number): Promise<void> {
  const res = await fetch(`/api/menus/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('메뉴 삭제 실패');
}


export const updateMenuOrder = async (orderedIds: { id: number; order: number }[]) => {
  const res = await fetch("/api/menus/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) throw new Error("순서 저장 실패");
};
