export async function fetchMenusByCategory(categoryId: number | null) {
  const query = categoryId !== null ? `?categoryId=${encodeURIComponent(categoryId)}` : "";
  const res = await fetch(`/api/menus${query}`);
  if (!res.ok) throw new Error("Failed to fetch menus");
  return res.json();
}