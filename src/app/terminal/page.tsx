'use client';
import { useState, useEffect } from 'react';

export default function TerminalPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const load = () => {
      fetch('/api/flights?type=departure&date=today')
        .then(res => res.json())
        .then(data => setFlights(data));
    };
    load();
    const fInterval = setInterval(load, 5000);
    const tInterval = setInterval(() => setTime(new Date()), 1000);
    return () => { clearInterval(fInterval); clearInterval(tInterval); };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-white p-6 font-sans select-none">
      {/* Шапка табло */}
      <div className="bg-[#10b981] p-4 rounded-t-xl flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <svg className="w-10 h-10 transform -rotate-45 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <h1 className="text-3xl font-bold tracking-wide flex items-center gap-2">
            Отправление <span className="text-emerald-100 font-light text-2xl">/ Departures</span>
          </h1>
        </div>
        <div className="text-right">
          <div className="text-4xl font-mono font-bold">{time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-xl text-emerald-100 font-medium">{time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</div>
        </div>
      </div>

      {/* Шапка таблицы */}
      <div className="grid grid-cols-12 bg-[#1e293b] p-3 text-sm font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-700 font-mono">
        <div className="col-span-1">Время <br/><span className="text-xs font-light lowercase">Time</span></div>
        <div className="col-span-3">Направление <br/><span className="text-xs font-light lowercase">Destination</span></div>
        <div className="col-span-3">Авиакомпания <br/><span className="text-xs font-light lowercase">Airline</span></div>
        <div className="col-span-2">Рейс <br/><span className="text-xs font-light lowercase">Flight</span></div>
        <div className="col-span-1 text-center">Выход <br/><span className="text-xs font-light lowercase">Gate</span></div>
        <div className="col-span-2 pl-2">Статус <br/><span className="text-xs font-light lowercase">Status</span></div>
      </div>

      {/* Список рейсов */}
      <div className="divide-y divide-slate-800 bg-[#0f172a] rounded-b-xl overflow-hidden">
        {flights.map((f) => {
          const isDelayed = f.status === 'Задержан';
          const sched = new Date(f.scheduledDeparture).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
          const actual = f.actualDeparture ? new Date(f.actualDeparture).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '';

          return (
            <div key={f.id} className="grid grid-cols-12 items-center p-4 font-mono text-xl tracking-wide">
              <div className="col-span-1 flex flex-col justify-center">
                {isDelayed ? (
                  <>
                    <span className="text-red-500 font-bold text-2xl">{actual}</span>
                    <span className="text-slate-500 line-through text-sm">{sched}</span>
                  </>
                ) : (
                  <span className="text-white font-bold">{sched}</span>
                )}
              </div>
              <div className="col-span-3 font-sans font-bold text-2xl text-slate-100">{f.destination}</div>
              <div className="col-span-3 font-sans text-lg text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> {f.airline}
              </div>
              <div className="col-span-2 text-emerald-400 font-bold text-2xl">{f.flightNumber}</div>
              <div className="col-span-1 text-center bg-slate-800/80 rounded py-1 font-bold text-2xl text-amber-400">{f.gate || '—'}</div>
              <div className="col-span-2 pl-2">
                <span className={`px-3 py-1.5 rounded text-sm font-sans font-bold block text-center ${
                  isDelayed ? 'bg-red-600 text-white animate-pulse' :
                  f.status === 'Посадка' ? 'bg-blue-600 text-white' :
                  f.status === 'Регистрация' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {f.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
