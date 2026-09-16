'use client';
import { useState, useEffect } from 'react';
import { db } from '../../lib/db';

export default function TerminalPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    document.body.style.backgroundColor = '#0b0f19';
    
    const load = () => {
      const data = db.getDepartures();
      const now = new Date();

      // Фильтруем только сегодняшние рейсы
      const todayDeps = data.filter((f: any) => {
        const flightDate = new Date(f.scheduledDeparture);
        return flightDate.getDate() === now.getDate();
      });

      // Сортировка от 00:00 до 23:59
      todayDeps.sort((a: any, b: any) => 
        new Date(a.scheduledDeparture).getTime() - new Date(b.scheduledDeparture).getTime()
      );

      setFlights(todayDeps);
    };

    load();
    const fInterval = setInterval(load, 5000); // Обновление сетки каждые 5 сек
    const tInterval = setInterval(() => setTime(new Date()), 1000);
    
    return () => { 
      clearInterval(fInterval); 
      clearInterval(tInterval);
      document.body.style.backgroundColor = ''; 
    };
  }, []);

  const currentPermTime = time.toLocaleTimeString('ru-RU', {
    timeZone: 'Asia/Yekaterinburg',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const currentPermDate = time.toLocaleDateString('ru-RU', {
    timeZone: 'Asia/Yekaterinburg',
    day: 'numeric',
    month: 'long'
  });

  const formatPermFlightTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ backgroundColor: '#0b0f19', minHeight: '100vh', color: '#fff', margin: '-24px', padding: '24px' }}>
      <div className="terminal-header">
        <div className="terminal-title">
          <svg style={{ width: '36px', height: '36px', transform: 'rotate(-45deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <div>
            Отправление <span style={{ color: '#a7f3d0', fontWeight: 300, fontSize: '20px' }}>/ Departures</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontFamily: 'monospace', fontWeight: 'bold', color: '#ffffff' }}>
            {currentPermTime}
          </div>
          <div style={{ color: '#a7f3d0', fontSize: '16px', fontWeight: 500, marginTop: '2px' }}>
            {currentPermDate} (ПЕРМЬ UTC+5)
          </div>
        </div>
      </div>

      <div className="terminal-grid-th">
        <div>Время <span style={{ fontSize: '10px', fontWeight: 300 }}>Time</span></div>
        <div>Направление <span style={{ fontSize: '10px', fontWeight: 300 }}>Destination</span></div>
        <div>Авиакомпания <span style={{ fontSize: '10px', fontWeight: 300 }}>Airline</span></div>
        <div>Рейс <span style={{ fontSize: '10px', fontWeight: 300 }}>Flight</span></div>
        <div style={{ textAlign: 'center' }}>Выход <span style={{ fontSize: '10px', fontWeight: 300 }}>Gate</span></div>
        <div style={{ textAlign: 'center' }}>Статус <span style={{ fontSize: '10px', fontWeight: 300 }}>Status</span></div>
      </div>

      <div style={{ backgroundColor: '#0f172a' }}>
        {flights.map((f) => {
          const isDelayed = f.status === 'Задержан';
          const sched = formatPermFlightTime(f.scheduledDeparture);
          const actual = f.actualDeparture ? formatPermFlightTime(f.actualDeparture) : '';

          return (
            <div key={f.id} className="terminal-row">
              <div>
                {isDelayed ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '22px' }}>{actual}</span>
                    <span style={{ color: '#64748b', fontSize: '14px', textDecoration: 'line-through' }}>{sched}</span>
                  </div>
                ) : (
                  <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{sched}</span>
                )}
              </div>
              
              <div style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '22px', color: '#ffffff' }}>{f.destination}</div>
              <div style={{ fontFamily: 'sans-serif', fontSize: '16px', color: '#cbd5e1' }}>{f.airline}</div>
              <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '22px' }}>{f.flightNumber}</div>
              <div style={{ textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '6px', color: '#fbbf24', fontWeight: 'bold' }}>{f.gate || '—'}</div>
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span className={`terminal-status ${
                  isDelayed ? 'term-status-delayed' :
                  f.status === 'Посадка' ? 'term-status-boarding' :
                  f.status === 'Регистрация' ? 'term-status-checkin' : 'term-status-default'
                }`} style={{ minWidth: '160px', display: 'block' }}>
                  {f.status}
                </span>
              </div>
            </div>
          );
        })}
        {flights.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontFamily: 'sans-serif' }}>Нет ближайших вылетов</div>
        )}
      </div>
    </div>
  );
}
