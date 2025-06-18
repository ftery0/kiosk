import { Order } from "@/types/order.type";

export async function fetchOrders(period: "today" | "week" | "month" | "all" = "all"): Promise<Order[]> {
    const query = period !== "all" ? `?period=${encodeURIComponent(period)}` : "";
    const res = await fetch(`/api/orders${query}`);
    if (!res.ok) throw new Error("주문 내역 조회 실패");
    return res.json();
  }

  export async function fetchCreateOrder(
    items: { id: number; quantity: number }[]
  ): Promise<Order> {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "주문 생성 실패");
    }
  
    return res.json();
  }
  