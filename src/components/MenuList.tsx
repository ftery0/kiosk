"use client";
import React from "react";
import MenuItem from "./menuItem";
import { Menu } from "@/types/menu.type";

interface MenuListProps {
  menus: Menu[];
  onSelectMenu: (menu: Menu) => void;
}

const MenuList = ({ menus, onSelectMenu }:MenuListProps) => {

  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {menus.map((menu) => (
        <MenuItem key={menu.id} menu={menu} onClick={() => onSelectMenu(menu)} />
      ))}
    </div>
  );
};

export default MenuList;
