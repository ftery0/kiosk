'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();

  const navItems = [
    { label: '카테고리', href: '/admin/categories' },
    { label: '메뉴', href: '/admin/menus' },
    { label: '주문', href: '/admin/orders' },
  ];

  return (
    <div className="bg-white px-4 shadow-sm">
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/admin">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              관리자
            </button>
          </Link>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`px-4 py-2 rounded-md ${
                    pathname === item.href
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 