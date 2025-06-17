import { NextIntlClientProvider,hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default async function RootLayout({
  children,
  params
}: Readonly<{
children: React.ReactNode;
params: Promise<{ locale: string }>;
}>) {
let {locale} = await params;
const messages = await getMessages();
if (!hasLocale(routing.locales, locale)) {
  locale = "ko";
}

return (
<html lang={locale}>
  <NextIntlClientProvider locale={locale} messages={messages} >
    {children}
  </NextIntlClientProvider>
</html>
);
}