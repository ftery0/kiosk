'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Category {
  id: number;
  nameKo: string;
  nameEn: string;
}

interface Menu {
  id: number;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  price: number;
  imageUrl?: string;
  order: number;
  categoryId: number;
}

export default function MenusPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [newMenu, setNewMenu] = useState<Partial<Menu>>({
    nameKo: '',
    nameEn: '',
    descriptionKo: '',
    descriptionEn: '',
    price: 0,
    order: 0,
    categoryId: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
  };

  const fetchMenus = async () => {
    const response = await fetch('/api/menus');
    const data = await response.json();
    setMenus(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 먼저 이미지를 업로드
      let imageUrl = '';
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // 메뉴 생성
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMenu,
          imageUrl,
        }),
      });

      if (response.ok) {
        setNewMenu({
          nameKo: '',
          nameEn: '',
          descriptionKo: '',
          descriptionEn: '',
          price: 0,
          order: 0,
          categoryId: 0,
        });
        setSelectedImage(null);
        setPreviewUrl('');
        fetchMenus();
      }
    } catch (error) {
      console.error('Error creating menu:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMenus();
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">메뉴 관리</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <select
              value={newMenu.categoryId}
              onChange={(e) => setNewMenu({ ...newMenu, categoryId: parseInt(e.target.value) })}
              className="input"
              required
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameKo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              순서
            </label>
            <input
              type="number"
              value={newMenu.order}
              onChange={(e) => setNewMenu({ ...newMenu, order: parseInt(e.target.value) })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              한글 이름
            </label>
            <input
              type="text"
              value={newMenu.nameKo}
              onChange={(e) => setNewMenu({ ...newMenu, nameKo: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              영문 이름
            </label>
            <input
              type="text"
              value={newMenu.nameEn}
              onChange={(e) => setNewMenu({ ...newMenu, nameEn: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              한글 설명
            </label>
            <textarea
              value={newMenu.descriptionKo}
              onChange={(e) => setNewMenu({ ...newMenu, descriptionKo: e.target.value })}
              className="input"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              영문 설명
            </label>
            <textarea
              value={newMenu.descriptionEn}
              onChange={(e) => setNewMenu({ ...newMenu, descriptionEn: e.target.value })}
              className="input"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <input
              type="number"
              value={newMenu.price}
              onChange={(e) => setNewMenu({ ...newMenu, price: parseInt(e.target.value) })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input"
            />
            {previewUrl && (
              <div className="mt-2 relative w-32 h-32">
                <Image
                  src={previewUrl}
                  alt="미리보기"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="mt-6 btn btn-primary">
          메뉴 추가
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이미지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menus.map((menu) => (
              <tr key={menu.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {menu.imageUrl && (
                    <div className="relative w-16 h-16">
                      <Image
                        src={menu.imageUrl}
                        alt={menu.nameKo}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{menu.nameKo}</div>
                  <div className="text-sm text-gray-500">{menu.nameEn}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {categories.find(c => c.id === menu.categoryId)?.nameKo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {menu.price.toLocaleString()}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 