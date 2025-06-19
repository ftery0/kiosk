import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '키오스크',
  description: '음식 주문 키오스크',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang=''>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
