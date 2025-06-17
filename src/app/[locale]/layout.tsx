import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
children: React.ReactNode;
params: Promise<{ locale: string }>;
}>) {
const {locale} = await params;


return (
<html lang={locale}>
  <NextIntlClientProvider>
    {children}
  </NextIntlClientProvider>
</html>
);
}