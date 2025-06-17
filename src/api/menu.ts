export async function fetchMenusByCategory(category: string) {
    const res = await fetch(`/api/menus?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error("Failed to fetch menus");
    return res.json();
  }