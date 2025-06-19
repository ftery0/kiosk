"use client";
import { useEffect, useState } from "react";
import MenuList from "@/components/adminMenu";
import MenuModal from "@/components/adminModal/menuModal";
import { fetchCategories } from "@/api/category";
import { Category } from "@/types/category.type";
import { Menu } from "@/types/menu.type";
import { fetchMenusByCategory, updateMenuOrder } from "@/api/menu";
import Image from "next/image";

const AdminMenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleSuccess = () => {
    if (selectedCategoryId !== null) {
      loadMenus(selectedCategoryId);
    }
    setShowModal(false);
    setSelectedMenu(null); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMenu(null); 
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0) setSelectedCategoryId(data[0].id);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMenus = async (categoryId: number) => {
    try {
      const data = await fetchMenusByCategory(categoryId);
      setMenus(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      loadMenus(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const moveMenu = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= menus.length) return;
    const newMenus = [...menus];
    const [moved] = newMenus.splice(fromIndex, 1);
    newMenus.splice(toIndex, 0, moved);
    setMenus(newMenus);
  };

  const handleSaveOrder = async () => {
    try {
      const orderedIds = menus.map((menu, index) => ({ id: menu.id, order: index }));
      await updateMenuOrder(orderedIds);
      alert("메뉴 순서가 저장되었습니다.");
    } catch {
      alert("순서 저장 실패");
    }
  };

  
  const handleAddMenu = () => {
    setSelectedMenu(null); 
    setShowModal(true);
  };

  
  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu); 
    setShowModal(true); 
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">메뉴 관리</h1>
      <div className="mb-4">
        <select
          className="border px-3 py-1 rounded"
          value={selectedCategoryId ?? undefined}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAddMenu}
        className="bg-primary text-white px-4 py-2 rounded mb-4 cursor-pointer"
      >
        메뉴 추가하기
      </button>
      
      {menus.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">등록된 메뉴가 없습니다.</p>
          <p className="text-sm mt-2">메뉴 추가하기 버튼을 눌러 새로운 메뉴를 등록해보세요.</p>
        </div>
      ) : (
        <ul>
          {menus.map((menu, index) => (
            <li key={menu.id} className="flex items-center gap-2 rounded-lg shadow p-2 mb-2">
              <Image
                src={menu.imagePath}
                alt={menu.name}
                width={300}
                height={300}
                className="w-16 h-16 object-cover rounded"
              />
              <span className="flex-1">{menu.name}</span>
              <span className="flex-1 text-[var(--primary)]">{menu.price}원</span>
              <button className="cursor-pointer" onClick={() => moveMenu(index, index - 1)}>▲</button>
              <button className="cursor-pointer" onClick={() => moveMenu(index, index + 1)}>▼</button>
              <button
                onClick={() => handleEditMenu(menu)}
                className="bg-yellow-400 text-white px-2 rounded cursor-pointer"
              >
                수정
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {menus.length > 0 && (
        <button
          onClick={handleSaveOrder}
          className="bg-secondary text-white px-4 py-2 rounded mt-4 cursor-pointer" 
        >
          순서 저장
        </button>
      )}
      {showModal && (
        <MenuModal
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          selectedMenu={selectedMenu} 
        />
      )}
    </div>
  );
};

export default AdminMenuPage;