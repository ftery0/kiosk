// app/[locale]/layout.tsx

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

// i18n/config.ts에서 locales를 가져옵니다.
import { locales } from '@/i18n/config';

// 폰트 임포트 (예시: Inter 폰트 사용 시)
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // URL의 locale이 유효한지 확인. 이 부분은 next-intl의 미들웨어에서도 처리되지만,
  // 명시적으로 레이아웃에서 한 번 더 확인하여 잘못된 URL 접근 시 early exit 할 수 있습니다.
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // getMessages()를 호출하여 현재 요청의 로케일에 해당하는 메시지를 가져옵니다.
  // 이 함수는 'i18n/request.ts'에 정의된 로케일 감지 로직(getUserLocale)을 따릅니다.
  const messages = await getMessages();

  return (
    // HTML 태그에 lang 속성을 설정합니다.
    <html lang={locale}>
      {/* whitespace 경고를 피하기 위해 body 태그를 한 줄에 붙여 작성합니다. */}
      {/* 폰트를 사용한다면 className={inter.className}을 여기에 추가 */}
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}