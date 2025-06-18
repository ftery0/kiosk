'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!password) return;

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-32 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">🔒 관리자 로그인</h1>
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full border p-2 rounded mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        로그인
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AdminLoginPage;
