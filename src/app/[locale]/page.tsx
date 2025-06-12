'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const t = useTranslations('common');

  if (!isStarted) {
    return (
      <div 
        className="min-h-screen bg-black relative cursor-pointer"
        onClick={() => setIsStarted(true)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="로고"
            width={400}
            height={400}
            className="animate-pulse"
          />
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center text-white text-xl">
          화면을 터치하세요
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">맛있는 한식</span>
            <span className="block text-blue-600">Delicious Korean Food</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            전통의 맛을 현대적으로 재해석한 한식의 진수
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
          <Link href="/menu" className="group">
            <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/images/dine-in.jpg"
                  alt="매장 이용"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{t('dineIn')}</h2>
                  <p className="text-sm opacity-90">매장에서 식사하기</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/menu?takeout=true" className="group">
            <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/images/takeout.jpg"
                  alt="포장하기"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{t('takeout')}</h2>
                  <p className="text-sm opacity-90">포장해서 가져가기</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 