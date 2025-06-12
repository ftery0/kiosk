'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';

interface Menu {
  id: number;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  price: number;
  imageUrl?: string;
}

interface Category {
  id: number;
  nameKo: string;
  nameEn: string;
  menus: Menu[];
}

interface MenuListProps {
  categories: Category[];
  locale: string;
  onAddToCart: (menu: Menu) => void;
}

export default function MenuList({ categories, locale, onAddToCart }: MenuListProps) {
  const t = useTranslations('common');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredCategories = selectedCategory
    ? categories.filter(cat => cat.id === selectedCategory)
    : categories;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`btn ${
              selectedCategory === category.id
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            {locale === 'ko' ? category.nameKo : category.nameEn}
          </button>
        ))}
      </div>

      {filteredCategories.map((category) => (
        <div key={category.id} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {locale === 'ko' ? category.nameKo : category.nameEn}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.menus.map((menu) => (
              <div key={menu.id} className="card">
                {menu.imageUrl && (
                  <div className="relative h-48 mb-4">
                    <Image
                      src={menu.imageUrl}
                      alt={locale === 'ko' ? menu.nameKo : menu.nameEn}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">
                  {locale === 'ko' ? menu.nameKo : menu.nameEn}
                </h3>
                <p className="text-gray-600 mb-2">
                  {locale === 'ko' ? menu.descriptionKo : menu.descriptionEn}
                </p>
                <p className="text-lg font-bold mb-4">
                  ₩{menu.price.toLocaleString()}
                </p>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => onAddToCart(menu)}
                >
                  {t('addToCart')}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 