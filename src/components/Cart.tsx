'use client';

import { useTranslations } from 'next-intl';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CartItem {
  id: number;
  nameKo: string;
  nameEn: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  locale: string;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export default function Cart({ items, locale, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const t = useTranslations('common');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-lg p-4 overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {t('cart')}
        </h2>

        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-md"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">
                {locale === 'ko' ? item.nameKo : item.nameEn}
              </span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <TrashIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                >
                  <MinusIcon className="w-5 h-5 text-gray-500" />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <PlusIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <span>₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
        ))}

        {items.length > 0 ? (
          <>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">
                  {t('total')}
                </span>
                <span className="text-xl font-bold">
                  ₩{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={onCheckout}
            >
              {t('payment')}
            </button>
          </>
        ) : (
          <p className="text-center text-gray-500">
            {t('emptyCart')}
          </p>
        )}
      </div>
    </div>
  );
} 