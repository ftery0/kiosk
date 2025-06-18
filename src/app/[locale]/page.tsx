"use client";
import { useRouter } from '@/i18n/navigation';


export default function HomePage() {
  const router = useRouter();

  const handleSelection = () => {
    router.push('/menu');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
         style={{ backgroundColor: 'var(--background)' }} 
    >
      <div
        className="p-8 rounded-lg shadow-xl w-full max-w-md text-center"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }} 
      >
        <h1 className="text-4xl font-bold mb-8"
            style={{ color: 'var(--foreground)' }} 
        >
          주문 방법을 선택해주세요
        </h1>

        <div className="space-y-6">
          <button
            onClick={handleSelection}
            
            className="w-full btn btn-primary font-bold py-6 px-4 rounded-lg text-3xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg cursor-pointer"
          >
            매장 이용
          </button>

          <button
            onClick={handleSelection}
            
            className="w-full btn btn-secondary font-bold py-6 px-4 rounded-lg text-3xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg cursor-pointer"
          >
            포장
          </button>
        </div>
      </div>
    </div>
  );
}