'use client';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FlightDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [flight, setFlight] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/flights?type=${type}`)
      .then(res => res.json())
      .then((data: any[]) => {
        const found = data.find(f => f.id === Number(params.id));
        setFlight(found);
      });
  }, [params.id, type]);

  if (!flight) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono">Загрузка информации о рейсе...</div>;

  const isDeparture = type === 'departure';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-2 ${isDeparture ? 'bg-emerald-500' : 'bg-blue-500'}`} />
        
        <button onClick={() => router.back()} className="text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-2 mb-6">
          ← Вернуться в табло
        </button>

        <div className="flex justify-between items-start border-b border-slate-700 pb-4 mb-6">
          <div>
            <h1 className="text-4xl font-mono font-black tracking-wider text-white">{flight.flightNumber}</h1>
            <p className="text-slate-400 text-lg mt-1">{flight.airline}</p>
          </div>
          <span className="bg-slate-900 border border-slate-700 text-emerald-400 px-4 py-1.5 rounded-xl font-bold font-mono text-sm shadow">
            {flight.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase text-slate-400 tracking-wider">Маршрут</p>
            <p className="text-xl font-bold text-white mt-1">
              {isDeparture ? `Кондратово (KON) → ${flight.destination}` : `${flight.origin} → Кондратово (KON)`}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-400 tracking-wider">Время по расписанию</p>
            <p className="text-xl font-bold text-white font-mono mt-1">
              {new Date(isDeparture ? flight.scheduledDeparture : flight.scheduledArrival).toLocaleString('ru-RU')}
            </p>
          </div>

          {isDeparture ? (
            <>
              <div>
                <p className="text-xs uppercase text-slate-400 tracking-wider">Регистрация и Стойки</p>
                <p className="text-base text-slate-200 mt-1 font-semibold">Стойки: <span className="text-amber-400 font-mono">{flight.checkInDesks}</span></p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(flight.registrationStart).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})} — {new Date(flight.registrationEnd).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400 tracking-wider">Посадка и Выход (Gate)</p>
                <p className="text-base text-slate-200 mt-1 font-semibold">Выход: <span className="text-blue-400 font-mono">{flight.gate}</span></p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(flight.boardingStart).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})} — {new Date(flight.boardingEnd).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})}
                </p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs uppercase text-slate-400 tracking-wider">Лента багажа</p>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">{flight.baggageBelt || '—'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
