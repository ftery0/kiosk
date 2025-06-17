"use client";
import React from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
}

const Cart = ({ cartItems, updateQuantity }: CartProps) => {
  return (
    <footer className="bg-white border-t p-4">
      <h3 className="text-lg font-semibold mb-2">장바구니</h3>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map(({ id, name, price, quantity }) => (
            <li key={id} className="flex justify-between items-center text-sm">
              <span>
                {name} x{" "}
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
              <span className="text-[var(--primary)]">
                {(price * quantity).toLocaleString()}원
              </span>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
};

export default Cart;
