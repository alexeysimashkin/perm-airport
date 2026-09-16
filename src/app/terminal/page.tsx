'use client';
import { useState, useEffect } from 'react';

export default function TerminalPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Принудительно устанавливаем темный фон для страницы терминала
    document.body.style.backgroundColor = '#0b0f19';
    
    const load = () => {
      fetch('/api/flights?type=departure&date=today')
        .then(res => res.json())
        .then(data => setFlights(data))
        .catch(() => {});
    };
    load();
    const fInterval = setInterval(load, 5000);
    const tInterval = setInterval(() => setTime(new Date()), 1000);
    
    return () => { 
      clearInterval(fInterval); 
      clearInterval(tInterval);
      document.body.style.backgroundColor = ''; // возвращаем стандартный при уходе
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#0b0f19', minHeight: '100vh', color: '#fff', margin: '-24px', padding: '24px' }}>
      {/* Шапка табло */}
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
          <div style={{ fontSize: '36px', fontFamily: 'monospace', fontWeight: 'bold' }}>
            {time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ color: '#a7f3d0', fontSize: '16px', fontWeight: 500, marginTop: '2px' }}>
            {time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* Заголовки столбцов */}
      <div className="terminal-grid-th">
        <div>Время <span style={{ fontSize: '10px', fontWeight: 300 }}>Time</span></div>
        <div>Направление <span style={{ fontSize: '10px', fontWeight: 300 }}>Destination</span></div>
        <div>Авиакомпания <span style={{ fontSize: '10px', fontWeight: 300 }}>Airline</span></div>
        <div>Рейс <span style={{ fontSize: '10px', fontWeight: 300 }}>Flight</span></div>
        <div style={{ textAlign: 'center' }}>Выход <span style={{ fontSize: '10px', fontWeight: 300 }}>Gate</span></div>
        <div style={{ textAlign: 'center' }}>Статус <span style={{ fontSize: '10px', fontWeight: 300 }}>Status</span></div>
      </div>

      {/* Строки рейсов */}
      <div style={{ backgroundColor: '#0f172a' }}>
        {flights.map((f) => {
          const isDelayed = f.status === 'Задержан';
          const sched = new Date(f.scheduledDeparture).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
          const actual = f.actualDeparture ? new Date(f.actualDeparture).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '';

          return (
            <div key={f.id} className="terminal-row">
              {/* Логика зачеркивания старого времени красным */}
              <div>
                {isDelayed ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '22px' }}>{actual}</span>
                    <span style={{ color: '#64748b', lineThrough: 'line-through', fontSize: '14px', textDecoration: 'line-through' }}>{sched}</span>
                  </div>
                ) : (
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{sched}</span>
                )}
              </div>
              
              <div style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '22px' }}>{f.destination}</div>
              <div style={{ fontFamily: 'sans-serif', fontSize: '16px', color: '#cbd5e1' }}>{f.airline}</div>
              <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '22px' }}>{f.flightNumber}</div>
              <div style={{ textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '6px', color: '#fbbf24', fontWeight: 'bold' }}>{f.gate || '—'}</div>
              
              <div>
                <span className={`terminal-status ${
                  isDelayed ? 'term-status-delayed' :
                  f.status === 'Посадка' ? 'term-status-boarding' :
                  f.status === 'Регистрация' ? 'term-status-checkin' : 'term-status-default'
                }`}>
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
