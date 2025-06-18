"use client";
import React, { useState, useEffect } from "react";
import Nav from "@/components/navbar";
import MenuList from "@/components/MenuList";
import MenuModal from "@/components/menuModal";
import Cart from "@/components/cart";
import { Menu } from "@/types/menu.type";
import { fetchMenusByCategory } from "@/api/menu";


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const MenuPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [clickCount,setClickCount ] = useState(0);
  
  useEffect(() => {
    if (clickCount === 5) {
      window.location.href = "/admin";
    }
  }, [clickCount]);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };
  
  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectedCategoryId !== null) {
          const data = await fetchMenusByCategory(selectedCategoryId);
          setMenus(data);
        } else {
          setMenus([]);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("메뉴를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
  
    loadMenus();
  }, [selectedCategoryId]);

  const handleAddToCart = (menu: Menu, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: menu.id, name: menu.name, price: menu.price, quantity }];
    });
    setSelectedMenu(null);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };


  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <header className="bg-white cursor-pointer shadow p-4 text-center text-2xl font-bold" onClick={handleClick}>
        kiosk
      </header>

      <Nav
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />

      <main className="flex-1 p-6">
        {loading && <p className="text-center">메뉴를 불러오는 중입니다...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && menus.length === 0 && (
          <p className="text-center">해당 카테고리의 메뉴가 없습니다.</p>
        )}

        <MenuList menus={menus} onSelectMenu={setSelectedMenu} />
      </main>

      <Cart
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem} 
      />

      {selectedMenu && (
        <MenuModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default MenuPage;
