"use client";
import React from "react";
import Image from "next/image";
import { Menu } from "@/types/menu.type";

interface MenuItemProps {
  menu: Menu;
  onClick: () => void;
}

const MenuItem = ({ menu, onClick }:MenuItemProps) => {
  return (
    <div   className="cursor-pointer bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition"
      onClick={onClick}
      >
      <Image
        src={menu.image}
        alt={menu.name}
        width={100} 
        height={100} 
        className="object-cover rounded-md mb-2"
      />
      <div className="font-semibold text-lg">{menu.name}</div>
      <div className="text-[var(--primary)] font-bold mt-1">{menu.price}원</div>
    </div>
  );
};

export default MenuItem;
