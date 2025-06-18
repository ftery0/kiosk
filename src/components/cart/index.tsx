"use client";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;  
}

const Cart = ({ cartItems, updateQuantity, removeItem }: CartProps) => {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <footer className="bg-white border-t p-4 flex flex-col md:flex-row justify-between gap-4">
    
    <div className="md:w-2/3 w-full">
      <h3 className="text-lg font-semibold mb-2">장바구니</h3>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map(({ id, name, price, quantity }) => (
            <li
              key={id}
              className="relative flex justify-between items-center text-sm p-2 rounded border"
            >
              <div>
                <span>
                  {name}{" "}
                  <button
                    className="px-2 bg-gray-200 rounded"
                    onClick={() => updateQuantity(id, -1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{quantity}</span>
                  <button
                    className="px-2 bg-gray-200 rounded"
                    onClick={() => updateQuantity(id, 1)}
                  >
                    +
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--primary)]">
                  {(price * quantity).toLocaleString()}원
                </span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(id)}
                  aria-label="장바구니 아이템 삭제"
                >
                  <AiOutlineClose size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    
    <div className="md:w-1/3 w-full bg-gray-50 rounded-lg p-4 border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">결제 정보</h3>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">총 금액</span>
        <span className="font-bold text-[var(--primary)]">
          {totalAmount.toLocaleString()}원
        </span>
      </div>
      <button
        className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded hover:bg-opacity-90 transition cursor-pointer"
        disabled={cartItems.length === 0}
        onClick={() => alert("구매 완료!")}
      >
        구매하기
      </button>
    </div>
  </footer>
  );
};

export default Cart;
