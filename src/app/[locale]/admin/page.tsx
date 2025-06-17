'use client';

import React, { useState } from 'react';

const Admin = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('밥류');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('categoryId', category);
    formData.append('image', image);

    try {
      const res = await fetch('/api/menus', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('메뉴 생성 실패');
      }

      setMessage('메뉴가 성공적으로 추가되었습니다!');
      setName('');
      setPrice('');
      setCategory('밥류');
      setImage(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message || '알 수 없는 오류');
      } else {
        setMessage('알 수 없는 오류');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">메뉴 추가</h2>
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="밥류">밥류</option>
            <option value="면류">면류</option>
            <option value="음료류">음료류</option>
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
            className="w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          추가하기
        </button>
        {message && <p className="mt-2 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default Admin;
