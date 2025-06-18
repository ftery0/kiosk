'use client';

import { Menu } from '@/types/menu.type';
import { useState, useEffect } from 'react';
import { updateMenu, deleteMenu } from '@/api/menu';
import { fetchCategories } from '@/api/category';
import { Category } from '@/types/category.type';

interface Props {
  menu: Menu;
  onClose: () => void;
  onUpdated: () => void;
}

const MenuEditModal = ({ menu, onClose, onUpdated }: Props) => {
  const [name, setName] = useState(menu.name);
  const [price, setPrice] = useState(menu.price.toString());
  const [image, setImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number>(menu.category.id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setMessage('카테고리를 불러오는 중 오류 발생');
      }
    };
    loadCategories();
  }, []);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('categoryId', String(categoryId));
    if (image) formData.append('image', image);

    try {
      await updateMenu(menu.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setMessage('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenu(menu.id);
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setMessage('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4">
        <h2 className="text-xl font-bold">메뉴 수정</h2>
        <div>
          <label className="block font-semibold">이름</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border w-full p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">가격</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border w-full p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">카테고리</label>
          <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="border w-full p-2 rounded">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold cursor-pointer">이미지 (선택)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full" />
        </div>
        {message && <p className="text-red-500 text-sm">{message}</p>}
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded cursor-pointer" onClick={onClose}>취소</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer" onClick={handleDelete}>삭제하기</button>
          <button className="bg-primary text-white px-4 py-2 rounded cursor-pointer" onClick={handleUpdate}>수정하기</button>
        </div>
      </div>
    </div>
  );
};

export default MenuEditModal;
