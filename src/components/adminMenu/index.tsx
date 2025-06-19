'use client';

import { useEffect, useState } from 'react';
import { Menu } from '@/types/menu.type';
import Image from 'next/image';
import { fetchMenusByCategory } from '@/api/menu'; 
import MenuEditModal from '../adminModal/menuEditModal';

interface Props {
  onEdit: (menu: Menu) => void;
}

const MenuList = ({ onEdit }: Props) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);  

  const loadMenus = async () => {
    setIsLoading(true);   
    try {
      const data = await fetchMenusByCategory(null);
      setMenus(data);
    } catch (error) {
    } finally {
      setIsLoading(false);  
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="text-center mt-10 text-lg font-semibold">불러오는 중...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="cursor-pointer bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition"
              onClick={() => setSelectedMenu(menu)}
            >
              <Image
                src={menu.imagePath}
                alt={menu.name}
                width={300}
                height={300}
                className="object-cover rounded-md mb-2"
              />
              <div className="font-semibold text-lg">{menu.name}</div>
              <div className="text-[var(--primary)] font-bold mt-1">{menu.price}원</div>
            </div>
          ))}
        </div>
      )}

      {selectedMenu && (
        <MenuEditModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onUpdated={loadMenus}
        />
      )}
    </>
  );
};

export default MenuList;
