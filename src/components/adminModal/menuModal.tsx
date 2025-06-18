'use client';
import React, { useEffect, useState } from 'react';
import { Category } from '@/types/category.type';
import { fetchCategories } from '@/api/category';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const MenuModal = ({ onClose, onSuccess }: Props) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id); 
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
        setMessage('카테고리 로딩에 실패했습니다.');
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || categoryId === null || !image) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('categoryId', String(categoryId));
    formData.append('image', image);

    try {
      const res = await fetch('/api/menus', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('메뉴 생성 실패');

      setMessage('메뉴가 성공적으로 추가되었습니다!');
      setName('');
      setPrice('');
      setImage(null);
      setCategoryId(categories[0]?.id ?? null);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message || '알 수 없는 오류');
      } else {
        setMessage('알 수 없는 오류');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">메뉴 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">가격</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">카테고리</label>
            <select
              value={categoryId ?? ''}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
              className="w-full cursor-pointer"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              추가하기
            </button>
          </div>
          {message && <p className="text-center text-sm text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
