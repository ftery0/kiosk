'use client';

import MenuList from '@/components/MenuList';
import Cart from '@/components/Cart';
import { useState } from 'react';

interface Menu {
  id: number;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  price: number;
  imageUrl?: string;
}

interface CartItem extends Menu {
  quantity: number;
}

export default function MenuPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (menu: Menu) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === menu.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...menu, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // 결제 처리 로직
  };

  // 임시 데이터
  const categories = [
    {
      id: 1,
      nameKo: '메인 요리',
      nameEn: 'Main Dishes',
      menus: [
        {
          id: 1,
          nameKo: '불고기',
          nameEn: 'Bulgogi',
          descriptionKo: '한국의 전통 불고기',
          descriptionEn: 'Traditional Korean Bulgogi',
          price: 15000,
          imageUrl: '/images/bulgogi.jpg'
        },
        {
          id: 2,
          nameKo: '비빔밥',
          nameEn: 'Bibimbap',
          descriptionKo: '한국의 전통 비빔밥',
          descriptionEn: 'Traditional Korean Bibimbap',
          price: 12000,
          imageUrl: '/images/bibimbap.jpg'
        }
      ]
    },
    {
      id: 2,
      nameKo: '사이드 메뉴',
      nameEn: 'Side Dishes',
      menus: [
        {
          id: 3,
          nameKo: '김치',
          nameEn: 'Kimchi',
          descriptionKo: '전통 발효 김치',
          descriptionEn: 'Traditional Fermented Kimchi',
          price: 3000,
          imageUrl: '/images/kimchi.jpg'
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <MenuList
        categories={categories}
        locale="ko"
        onAddToCart={handleAddToCart}
      />
      <Cart
        items={cartItems}
        locale="ko"
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
} 