'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin'); // Перенаправляем в панель управления
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-850 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-white tracking-wider">ВХОД ДЛЯ СОТРУДНИКОВ</h1>
          <p className="text-emerald-400 font-mono text-xs mt-1">Аэропорт Кондратово Пермь (KON)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">
              Пароль доступа
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-center font-mono focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center bg-red-500/10 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl transition shadow-lg shadow-emerald-900/20"
          >
            Подтвердить полномочия
          </button>
        </form>
      </div>
    </div>
  );
}
