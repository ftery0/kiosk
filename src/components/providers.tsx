'use client';

import { NextIntlClientProvider } from 'next-intl';

type Messages = {
  common: {
    dineIn: string;
    takeout: string;
    cart: string;
    order: string;
    back: string;
    confirm: string;
    cancel: string;
    quantity: string;
    total: string;
    payment: string;
    orderComplete: string;
    addToCart: string;
    emptyCart: string;
  };
  admin: {
    login: string;
    password: string;
    categories: string;
    menus: string;
    orders: string;
    today: string;
    thisWeek: string;
    thisMonth: string;
    orderDetails: string;
    tableNumber: string;
    orderTime: string;
    status: string;
  };
};

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 