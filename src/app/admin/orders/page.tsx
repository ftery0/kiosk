'use client';

import { useState, useEffect, useMemo } from "react";
import { fetchOrders } from "@/api/order";
import { Order } from "@/types/order.type";

const Orders = () => {
  const [period, setPeriod] = useState<"all" | "today" | "week" | "month">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrders(period);
        setOrders(data);
      } catch (e: any) {
        setError(e.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [period]);


  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const timeA = new Date(a.orderedAt).getTime();
      const timeB = new Date(b.orderedAt).getTime();
      return sortOrder === "latest" ? timeB - timeA : timeA - timeB;
    });
  }, [orders, sortOrder]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--primary)" }}>
        주문 내역
      </h1>

      <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2">
          {["all", "today", "week", "month"].map((p) => (
            <button
              key={p}
              className={`btn ${period === p ? "btn-primary" : "btn-outline"}`}
              onClick={() => setPeriod(p as any)}
            >
              {p === "all"
                ? "전체"
                : p === "today"
                ? "오늘"
                : p === "week"
                ? "이번 주"
                : "이번 달"}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            className={`btn ${sortOrder === "latest" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSortOrder("latest")}
          >
            최신순
          </button>
          <button
            className={`btn ${sortOrder === "oldest" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSortOrder("oldest")}
          >
            오래된순
          </button>
        </div>
      </div>

      {loading && <p style={{ color: "var(--secondary)" }}>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && sortedOrders.length === 0 && (
        <p style={{ color: "var(--secondary)" }}>주문 내역이 없습니다.</p>
      )}

      <div className="space-y-6 scroll-auto h-auto overflow-auto">
        {sortedOrders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex justify-between mb-2">
              <div>
                <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                  테이블 번호:
                </span>{" "}
                {order.id}
              </div>
              <div style={{ color: "var(--secondary)", fontSize: "0.875rem" }}>
                {new Date(order.orderedAt).toLocaleString()}
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left" style={{ color: "var(--primary)" }}>
                    메뉴명
                  </th>
                  <th className="border px-2 py-1 text-right" style={{ color: "var(--primary)" }}>
                    수량
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-2 py-1">{item.menu.name}</td>
                    <td className="border px-2 py-1 text-right">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
