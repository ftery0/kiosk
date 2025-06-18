"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin/categories', label: '카테고리 설정' },
  { href: '/admin/menus', label: '메뉴 설정' },
  { href: '/admin/orders', label: '결제 내역' },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
   
        <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between">
        
        <div>
          <h2 className="text-2xl font-bold mb-6">관리자</h2>
          <nav className="space-y-4">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                  pathname === href ? 'bg-gray-700 font-semibold' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        
        <div className="mt-6">
          <button
            className="w-full py-2 bg-[var(--primary)] text-white rounded hover:bg-opacity-90 transition cursor-pointer"
            onClick={() => router.push("/")}
          >
            메인화면으로 돌아가기
          </button>
        </div>
      </aside>

   
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
