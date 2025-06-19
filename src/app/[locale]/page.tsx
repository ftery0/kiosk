"use client";
import { useRouter } from '@/i18n/navigation';
import { OrderType, useOrderTypeStore } from '@/store/useOrderTypeStore';
import { useTranslations } from 'next-intl';
import { FaUtensils, FaShoppingBag } from "react-icons/fa"; 

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations("HomePage");
  const { setOrderType } = useOrderTypeStore();
  
  const handleSelection = (type: OrderType) => {
    setOrderType(type); 
    router.push("/menu");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
         style={{ backgroundColor: 'var(--background)' }} 
    >
      <div
        className="p-8 rounded-lg shadow-xl w-full max-w-md text-center"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }} 
      >
        <h1 className="text-4xl font-bold mb-8"
            style={{ color: 'var(--foreground)' }} 
        >
          {t('title')}
        </h1>

        <div className="text-center flex justify-between">
        <button
          onClick={() => handleSelection("DINE_IN")}
          className="flex flex-col items-center justify-center w-1/2 bg-primary text-white rounded-lg p-6 mx-2
                     hover:bg-primary-dark transition duration-300 cursor-pointer"
        >
          <FaUtensils size={48} className="mb-3" />
          <span className="text-2xl font-bold">{t('dineIn')}</span>
        </button>

        <button
          onClick={() => handleSelection("TAKE_OUT")}
          className="flex flex-col items-center justify-center w-1/2 bg-secondary text-white rounded-lg p-6 mx-2
                     hover:bg-secondary-dark transition duration-300 cursor-pointer"
        >
          <FaShoppingBag size={48} className="mb-3" />
          <span className="text-2xl font-bold">{t('takeOut')}</span>
        </button>
        </div>
      </div>

      
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        <button
          onClick={() => router.push('/', { locale: 'ko' })}
          className="text-sm px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 shadow cursor-pointer"
        >
          한국어
        </button>
        <button
          onClick={() => router.push('/', { locale: 'en' })}
          className="text-sm px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 shadow cursor-pointer"
        >
          English
        </button>
      </div>
    </div>
  );
}
