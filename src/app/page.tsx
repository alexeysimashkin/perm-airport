'use client';
import { useState, useEffect } from 'react';
import SplashLoader from '../components/SplashLoader';
import Link from 'next/link';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'departure' | 'arrival'>('departure');
  const [date, setDate] = useState<'today' | 'tomorrow'>('today');
  const [search, setSearch] = useState('');
  const [flights, setFlights] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      // Функция загрузки данных
      const loadFlights = () => {
        fetch(`/api/flights?type=${type}&date=${date}`)
          .then(res => res.json())
          .then(data => setFlights(data))
          .catch(() => {});
      };

      // Первичная загрузка при смене фильтров
      loadFlights();

      // Автоматическое обновление табло каждые 30 секунд
      const interval = setInterval(loadFlights, 30000);

      // Очистка интервала при демонтаже компонента
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

  // Получение времени в формате Перми (UTC+5)
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
