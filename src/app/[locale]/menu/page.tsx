'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { HomeIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/solid'; 
import Link from 'next/link';

// 타입 정의
interface Category {
  id: number;
  name: string;
  order: number;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  categoryId: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const MenuPage = () => {
  const t = useTranslations('Common'); // Common 네임스페이스 사용
  const tMenuPage = useTranslations('MenuPage'); // MenuPage 네임스페이스 사용

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30); // 타이머 상태

  // 카테고리 불러오기
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Category[] = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].id); // 첫 번째 카테고리 자동 선택
      }
    } catch (error) {
      console.error('카테고리 로딩 실패:', error);
      // 사용자에게 에러 메시지 표시
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 메뉴 불러오기
  const fetchMenus = useCallback(async (categoryId: number) => {
    try {
      const response = await fetch(`/api/menus?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('메뉴 로딩 실패:', error);
      // 사용자에게 에러 메시지 표시
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchMenus(selectedCategory);
    }
  }, [selectedCategory, fetchMenus]);

  // 타이머 로직
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // 여기에 시간 초과 시 처리할 로직 (예: 장바구니 초기화, 홈으로 리디렉션)
          // alert("시간이 초과되었습니다. 장바구니가 초기화됩니다.");
          // setCartItems([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 장바구니 핸들러
  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setTimeRemaining(30); // 메뉴 추가 시 타이머 초기화
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
    setTimeRemaining(30); // 수량 변경 시 타이머 초기화
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    setTimeRemaining(30); // 아이템 삭제 시 타이머 초기화
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTimeRemaining(30); // 전체 삭제 시 타이머 초기화
  };

  const handleCheckout = () => {
    alert(t('PaymentComplete')); // next-intl 적용
    handleClearCart();
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('Loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* 상단 헤더 (PC/태블릿) */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 z-30 bg-white shadow-md p-4 justify-between items-center text-red-500 font-bold text-2xl">
        <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
          <HomeIcon className="h-7 w-7" />
          <span>Easy KIOSK</span>
        </Link>
        <span className="text-2xl font-bold">Easy KIOSK</span>
        <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
          <PlusIcon className="h-6 w-6" />
          <span className="text-xl"></span> {/* 여기에 기능 추가 가능 */}
        </button>
      </div>

      {/* 메인 콘텐츠 영역 (PC/태블릿: flex-1, 모바일: flex-col) */}
      <div className="flex flex-1 flex-col md:flex-row pt-16 md:pt-0"> {/* PC/태블릿 상단 헤더 높이만큼 패딩 */}

        {/* 카테고리 및 메뉴 목록 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto pb-[180px] md:pb-4 md:mr-8"> {/* 하단 장바구니 영역 높이만큼 패딩 */}
          {/* 카테고리 헤더 (모바일/태블릿 상단 고정, PC는 좌측 사이드바처럼 보일 수 있음) */}
          <div className="sticky top-0 z-20 bg-white shadow-sm border-b md:relative md:top-auto md:shadow-none md:border-none md:px-0">
            <div className="max-w-7xl mx-auto px-4 md:max-w-none">
              <div className="flex space-x-2 overflow-x-auto py-3 md:flex-col md:space-x-0 md:space-y-2 md:py-4 md:min-w-[150px] md:border-r">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-150
                      ${selectedCategory === category.id
                        ? 'bg-blue-600 text-white md:rounded-l-none md:rounded-r-full'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 md:rounded-l-none md:rounded-r-full'
                      }
                      md:text-left md:text-base md:px-6 md:py-3
                    `}
                  >
                    {t(category.name as 'KoreanFood')} {/* next-intl 키로 변환 */}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 메뉴 아이템 목록 */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 max-w-7xl mx-auto md:max-w-none">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() => handleAddToCart(item)}
              >
                <div className="relative aspect-square w-full">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                      {t('NoImage')}
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-bold text-base truncate">{tMenuPage(item.name as 'GoldMangoSmoothie')}</h3> {/* next-intl 적용 */}
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.description}</p>
                  )}
                  <div className="mt-2 text-lg font-semibold text-gray-800">
                    {item.price.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 장바구니 및 결제 영역 */}
        {/* 모바일 하단 고정, PC/태블릿 오른쪽 고정 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30
                    md:relative md:top-0 md:left-auto md:right-auto md:w-80 md:min-w-[320px] md:flex-shrink-0 md:border-l md:border-t-0 md:shadow-none md:flex md:flex-col md:p-4">
          <div className="max-w-7xl mx-auto px-4 py-4 md:max-w-none md:flex-1 md:flex md:flex-col">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-blue-600">🛒</span> {t('Cart')}
            </h3>

            {/* 타이머 및 전체 삭제 버튼 */}
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-600">
                {t('TimeRemaining')}: <span className="font-bold text-blue-600">{timeRemaining}{t('seconds')}</span>
              </span>
              <button
                onClick={handleClearCart}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
              >
                {t('AllDelete')}
              </button>
            </div>

            {/* 장바구니 아이템 목록 */}
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar md:flex-1 md:max-h-none">
              {cartItems.length === 0 ? (
                <div className="text-gray-500 text-center py-4">{t('SelectedItems')}</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="flex-1 font-medium text-gray-800">{tMenuPage(item.name as 'GoldMangoSmoothie')}</span> {/* next-intl 적용 */}
                    <div className="flex items-center gap-2 ml-2 text-sm">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-700"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 총 금액 및 결제 버튼 */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
              <div>
                <p className="text-gray-600 text-sm">{t('TotalAmount')}</p>
                <p className="text-2xl font-bold text-blue-700">{totalAmount.toLocaleString()}원</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-6 py-3 rounded-lg transition-colors
                           disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {t('Checkout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 사용자 정의 스크롤바 스타일 (global.css 또는 별도 CSS 파일에 추가) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default MenuPage;