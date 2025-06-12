'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface OrderItem {
  id: number;
  menuId: number;
  quantity: number;
  menu: {
    nameKo: string;
    nameEn: string;
    price: number;
  };
}

interface Order {
  id: number;
  tableNumber?: number;
  isTakeout: boolean;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'completed'>('all');

  useEffect(() => {
    fetchOrders();
    // 30초마다 주문 목록 갱신
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return '대기중';
      case 'PREPARING':
        return '준비중';
      case 'COMPLETED':
        return '완료';
      case 'CANCELLED':
        return '취소됨';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">주문 관리</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            대기중
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={`px-4 py-2 rounded-md ${
              filter === 'preparing' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            준비중
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            완료
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {order.isTakeout ? '포장' : `테이블 ${order.tableNumber}`}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), 'MM/dd HH:mm', { locale: ko })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.menu.nameKo} x {item.quantity}
                  </span>
                  <span>{(item.menu.price * item.quantity).toLocaleString()}원</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">총 금액</span>
                <span className="font-semibold">{order.totalAmount.toLocaleString()}원</span>
              </div>

              {order.status === 'PENDING' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(order.id, 'PREPARING')}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                  >
                    준비 시작
                  </button>
                  <button
                    onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                  >
                    취소
                  </button>
                </div>
              )}

              {order.status === 'PREPARING' && (
                <button
                  onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                  완료
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 