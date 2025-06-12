'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: number;
  items: {
    menu: {
      nameKo: string;
      nameEn: string;
    };
    quantity: number;
  }[];
  totalAmount: number;
  isTakeout: boolean;
  tableNumber?: number;
  payment: {
    paymentMethod: string;
  };
}

export default function OrderCompletePage() {
  const [order, setOrder] = useState<Order | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CARD':
        return '카드';
      case 'CASH':
        return '현금';
      case 'MOBILE':
        return '모바일';
      default:
        return method;
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>주문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">주문이 완료되었습니다</h1>
          <p className="text-gray-600 mt-2">
            {order.isTakeout ? '포장' : `테이블 ${order.tableNumber}`}
          </p>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <h2 className="font-semibold mb-2">주문 내역</h2>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.menu.nameKo} x {item.quantity}
                </span>
                <span>
                  {(item.menu.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">결제 수단</span>
            <span>{getPaymentMethodText(order.payment.paymentMethod)}</span>
          </div>
          <div className="flex justify-between items-center font-semibold">
            <span>총 결제 금액</span>
            <span>{order.totalAmount.toLocaleString()}원</span>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600"
          >
            홈으로 돌아가기
          </Link>
          {!order.isTakeout && (
            <Link
              href="/menu"
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50"
            >
              추가 주문하기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 