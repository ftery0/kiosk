"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Menu } from "@/types/menu.type";

interface MenuModalProps {
    menu: Menu;
    onClose: () => void;
    onAddToCart: (menu: Menu, quantity: number) => void;
  }

const MenuModal = ({ menu, onClose, onAddToCart }: MenuModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const totalPrice = menu.price * quantity;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
        <Image
          src={menu.imagePath}
          alt={menu.name}
          width={320}
          height={160}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{menu.name}</h2>
        <p className="text-[var(--primary)] font-semibold mb-4">
          {totalPrice.toLocaleString()}원
        </p>

        <div className="flex justify-center items-center menus-center space-x-4 mb-6">
          <button
            className="btn btn-outline cursor-pointer"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            className="btn btn-outline cursor-pointer"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

        <div className="flex  gap-1">
          <button
            className="btn btn-secondary flex-1/5 cursor-pointer"
            onClick={() => {
              onAddToCart(menu, quantity);
              onClose();
            }}
          >
            장바구니에 담기
          </button>
          <button className="btn btn-outline flex-1 cursor-pointer" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
