'use client';
import { useState, useEffect } from 'react';
import SplashLoader from '../components/SplashLoader';
import Link from 'next/link';
import { db } from '../lib/db';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'departure' | 'arrival'>('departure');
  const [date, setDate] = useState<'today' | 'tomorrow'>('today');
  const [search, setSearch] = useState('');
  const [flights, setFlights] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      const loadFlights = () => {
        const data = type === 'departure' ? db.getDepartures() : db.getArrivals();
        
        const now = new Date();
        const isTomorrowRequested = date === 'tomorrow';

        // Фильтрация по дням
        const filteredByDate = data.filter((f: any) => {
          const flightDate = new Date(type === 'departure' ? f.scheduledDeparture : f.scheduledArrival);
          const isTomorrow = flightDate.getDate() === (now.getDate() + 1);
          return isTomorrowRequested ? isTomorrow : !isTomorrow;
        });

        // Сортировка от 00:00 до 23:59
        filteredByDate.sort((a: any, b: any) => {
          const timeA = new Date(type === 'departure' ? a.scheduledDeparture : a.scheduledArrival).getTime();
          const timeB = new Date(type === 'departure' ? b.scheduledDeparture : b.scheduledArrival).getTime();
          return timeA - timeB;
        });

        setFlights(filteredByDate);
      };

      loadFlights();
      const interval = setInterval(loadFlights, 30000);
      return () => clearInterval(interval);
    }
  }, [type, date, loading]);

  const filteredFlights = flights.filter(f => {
    const term = search.toLowerCase();
    const city = type === 'departure' ? (f.destination || '') : (f.origin || '');
    return (
      f.flightNumber.toLowerCase().includes(term) ||
      f.airline.toLowerCase().includes(term) ||
      city.toLowerCase().includes(term)
    );
  });

  const formatPermTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {loading && <SplashLoader onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px' }}>
          <header className="airport-header">
            <div>
              <div className="airport-logo">КОНДРАТОВО</div>
              <div className="airport-sub">МЕЖДУНАРОДНЫЙ АЭРОПОРТ ПЕРМИ • KON (UTC+5)</div>
            </div>
            <div className="nav-buttons">
              <Link href="/terminal" className="btn-secondary">Табло Терминала 📺</Link>
              <Link href="/login" className="btn-primary">Сотрудникам 🔐</Link>
            </div>
          </header>

          <main className="main-container">
            <div className="filter-bar">
              <div className="toggle-group">
                <button onClick={() => setType('departure')} className={`toggle-btn ${type === 'departure' ? 'active-dep' : ''}`}>Вылеты</button>
                <button onClick={() => setType('arrival')} className={`toggle-btn ${type === 'arrival' ? 'active-arr' : ''}`}>Прилеты</button>
              </div>

              <input type="text" placeholder="Поиск рейса, авиакомпании, города..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />

              <div className="toggle-group">
                <button onClick={() => setDate('today')} className={`toggle-btn ${date === 'today' ? 'btn-secondary' : ''}`} style={date === 'today' ? {backgroundColor: '#e2e8f0', color: '#0f172a'} : {}}>Сегодня</button>
                <button onClick={() => setDate('tomorrow')} className={`toggle-btn ${date === 'tomorrow' ? 'btn-secondary' : ''}`} style={date === 'tomorrow' ? {backgroundColor: '#e2e8f0', color: '#0f172a'} : {}}>Завтра</button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="tablo-table">
                <thead>
                  <tr>
                    <th>Время (Пермь)</th>
                    <th>{type === 'departure' ? 'Куда' : 'Откуда'}</th>
                    <th>Авиакомпания</th>
                    <th>Рейс</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlights.map((f) => {
                    const isBadStatus = ['Задержан', 'Отменен'].includes(f.status);
                    const isInfoStatus = ['Посадка', 'Прибыл', 'Регистрация', 'Посадка закончена', 'Регистрация закончена'].includes(f.status);
                    const badgeClass = isBadStatus ? 'status-bad' : isInfoStatus ? 'status-info' : 'status-ok';

                    return (
                      <tr key={f.id}>
                        <td className="time-cell">{formatPermTime(type === 'departure' ? f.scheduledDeparture : f.scheduledArrival)}</td>
                        <td className="city-cell">{type === 'departure' ? f.destination : f.origin}</td>
                        <td className="airline-cell">{f.airline}</td>
                        <td><Link href={`/flight/${f.id}?type=${type}`} className="flight-cell">{f.flightNumber}</Link></td>
                        <td><span className={`status-badge ${badgeClass}`}>{f.status}</span></td>
                      </tr>
                    );
                  })}
                  {filteredFlights.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Нет доступных рейсов</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
