'use client';
import React, { useEffect, useState } from 'react';
import { Category } from '@/types/category.type';
import { Menu } from '@/types/menu.type';
import { fetchCategories } from '@/api/category';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  selectedMenu?: Menu | null; // 수정할 메뉴 정보 (선택적)
}

const MenuModal = ({ onClose, onSuccess, selectedMenu }: Props) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const isEditMode = !!selectedMenu; // 수정 모드 여부

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        
        if (selectedMenu) {
          setName(selectedMenu.name);
          setPrice(String(selectedMenu.price));
          setCategoryId(selectedMenu.category.id);
        } else if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
        setMessage('카테고리 로딩에 실패했습니다.');
      }
    };
    loadCategories();
  }, [selectedMenu]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 수정 모드에서는 이미지가 필수가 아님
    if (!name || !price || categoryId === null || (!isEditMode && !image)) {
      setMessage(isEditMode ? '이름, 가격, 카테고리를 입력해주세요.' : '모든 필드를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('categoryId', String(categoryId));
    
    // 새 이미지가 선택된 경우에만 추가
    if (image) {
      formData.append('image', image);
    }

    try {
      let res;
      
      if (isEditMode) {
        // 수정 모드: PUT 요청
        res = await fetch(`/api/menus/${selectedMenu.id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // 추가 모드: POST 요청
        res = await fetch('/api/menus', {
          method: 'POST',
          body: formData,
        });
      }

      if (!res.ok) throw new Error(isEditMode ? '메뉴 수정 실패' : '메뉴 생성 실패');

      setMessage(isEditMode ? '메뉴가 성공적으로 수정되었습니다!' : '메뉴가 성공적으로 추가되었습니다!');
      
      // 폼 초기화
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
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? '메뉴 수정' : '메뉴 추가'}
        </h2>
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
            <label className="block font-semibold mb-1">
              이미지 {isEditMode && '(변경하지 않으려면 비워두세요)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
              className="w-full cursor-pointer"
              required={!isEditMode} // 수정 모드에서는 이미지가 필수가 아님
            />
            {isEditMode && selectedMenu && (
              <p className="text-sm text-gray-500 mt-1">
                현재 이미지: {selectedMenu.imagePath.split('/').pop()}
              </p>
            )}
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
              className="bg-primary text-white px-4 py-2 rounded cursor-pointer"
            >
              {isEditMode ? '수정하기' : '추가하기'}
            </button>
          </div>
          {message && <p className="text-center text-sm text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default MenuModal;