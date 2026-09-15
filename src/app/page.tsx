'use client';
import { useState, useEffect } from 'react';
import useRouter from 'next/navigation';
import SplashLoader from '@/components/SplashLoader';
import Link from 'next/link';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'departure' | 'arrival'>('departure');
  const [date, setDate] = useState<'today' | 'tomorrow'>('today');
  const [search, setSearch] = useState('');
  const [flights, setFlights] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      fetch(`/api/flights?type=${type}&date=${date}`)
        .then(res => res.json())
        .then(data => setFlights(data));
    }
  }, [type, date, loading]);

  const filteredFlights = flights.filter(f => {
    const term = search.toLowerCase();
    const city = type === 'departure' ? f.destination : f.origin;
    return (
      f.flightNumber.toLowerCase().includes(term) ||
      f.airline.toLowerCase().includes(term) ||
      city.toLowerCase().includes(term)
    );
  });

  if (loading) return <SplashLoader onComplete={() => setLoading(false)} />;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">КОНДРАТОВО</h1>
          <p className="text-emerald-400 font-mono text-sm">Международный аэропорт Перми • KON</p>
        </div>
        <div className="flex gap-4">
          <Link href="/terminal" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition">Табло Терминала 📺</Link>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition">Сотрудникам 🔐</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 p-6 shadow-xl">
        {/* Панель фильтров */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setType('departure')} className={`px-5 py-2 rounded-lg font-medium text-sm transition ${type === 'departure' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Вылеты</button>
            <button onClick={() => setType('arrival')} className={`px-5 py-2 rounded-lg font-medium text-sm transition ${type === 'arrival' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Прилеты</button>
          </div>

          <input 
            type="text" 
            placeholder="Поиск по номеру, авиакомпании, городу..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-slate-500 flex-1 max-w-md"
          />

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button onClick={() => setDate('today')} className={`px-4 py-2 rounded-lg text-sm font-medium ${date === 'today' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Сегодня</button>
            <button onClick={() => setDate('tomorrow')} className={`px-4 py-2 rounded-lg text-sm font-medium ${date === 'tomorrow' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Завтра</button>
          </div>
        </div>

        {/* Таблица онлайн-табло */}
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700">
                <th className="p-4">Время</th>
                <th className="p-4">{type === 'departure' ? 'Куда' : 'Откуда'}</th>
                <th className="p-4">Авиакомпания</th>
                <th className="p-4">Рейс</th>
                <th className="p-4">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredFlights.map((f) => {
                const timeStr = new Date(type === 'departure' ? f.scheduledDeparture : f.scheduledArrival).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={f.id} className="hover:bg-slate-700/30 transition cursor-pointer">
                    <td className="p-4 font-mono font-bold text-white">{timeStr}</td>
                    <td className="p-4 text-base font-medium">{type === 'departure' ? f.destination : f.origin}</td>
                    <td className="p-4 text-slate-300">{f.airline}</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      <Link href={`/flight/${f.id}?type=${type}`} className="hover:underline">{f.flightNumber}</Link>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${f.status === 'Задержан' || f.status === 'Отменен' ? 'bg-red-500/20 text-red-400' : f.status === 'Посадка' || f.status === 'Прибыл' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
