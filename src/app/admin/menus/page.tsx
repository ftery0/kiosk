'use client';

import { useState } from 'react';
import MenuModal from '@/components/adminModal/menuModal';
import MenuList from '@/components/adminMenu';
import { Menu } from '@/types/menu.type';

const AdminMenuPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleSuccess = () => {
    location.reload(); 
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">메뉴 관리</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 cursor-pointer"
      >
        메뉴 추가하기
      </button>

      <MenuList onEdit={(menu) => setSelectedMenu(menu)} />

      {showModal && (
        <MenuModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default AdminMenuPage;
