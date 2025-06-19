"use client";
import { useRouter } from '@/i18n/navigation';
import { OrderType, useOrderTypeStore } from '@/store/useOrderTypeStore';
import { useTranslations } from 'next-intl';

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

        <div className="space-y-6">
          <button
           onClick={() => handleSelection("DINE_IN")}
            className="w-full btn btn-primary font-bold py-6 px-4 rounded-lg text-3xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg cursor-pointer"
          >
            {t('dineIn')}
          </button>

          <button
           onClick={() => handleSelection("TAKE_OUT")}
            className="w-full btn btn-secondary font-bold py-6 px-4 rounded-lg text-3xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg cursor-pointer"
          >
            {t('takeOut')}
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
