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
      fetch(`/api/flights?type=${type}&date=${date}`)
        .then(res => res.json())
        .then(data => setFlights(data))
        .catch(() => {});
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

  return (
    <>
      {loading && <SplashLoader onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px' }}>
          <header className="airport-header">
            <div>
              <div className="airport-logo">КОНДРАТОВО</div>
              <div className="airport-sub">МЕЖДУНАРОДНЫЙ АЭРОПОРТ ПЕРМИ • KON</div>
            </div>
            <div className="nav-buttons">
              <Link href="/terminal" className="btn-secondary">Табло Терминала 📺</Link>
              <Link href="/login" className="btn-primary">Сотрудникам 🔐</Link>
            </div>
          </header>

          <main className="main-container">
            <div className="filter-bar">
              <div className="toggle-group">
                <button 
                  onClick={() => setType('departure')} 
                  className={`toggle-btn ${type === 'departure' ? 'active-dep' : ''}`}
                >
                  Вылеты
                </button>
                <button 
                  onClick={() => setType('arrival')} 
                  className={`toggle-btn ${type === 'arrival' ? 'active-arr' : ''}`}
                >
                  Прилеты
                </button>
              </div>

              <input 
                type="text" 
                placeholder="Поиск рейса, авиакомпании, города..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />

              <div className="toggle-group">
                <button 
                  onClick={() => setDate('today')} 
                  className={`toggle-btn ${date === 'today' ? 'btn-secondary' : ''}`}
                  style={date === 'today' ? {backgroundColor: '#334155', color: '#fff'} : {}}
                >
                  Сегодня
                </button>
                <button 
                  onClick={() => setDate('tomorrow')} 
                  className={`toggle-btn ${date === 'tomorrow' ? 'btn-secondary' : ''}`}
                  style={date === 'tomorrow' ? {backgroundColor: '#334155', color: '#fff'} : {}}
                >
                  Завтра
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="tablo-table">
                <thead>
                  <tr>
                    <th>Время</th>
                    <th>{type === 'departure' ? 'Куда' : 'Откуда'}</th>
                    <th>Авиакомпания</th>
                    <th>Рейс</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlights.map((f) => {
                    const timeStr = new Date(type === 'departure' ? f.scheduledDeparture : f.scheduledArrival)
                      .toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                    
                    const isBadStatus = ['Задержан', 'Отменен'].includes(f.status);
                    const isInfoStatus = ['Посадка', 'Прибыл', 'Регистрация'].includes(f.status);
                    const badgeClass = isBadStatus ? 'status-bad' : isInfoStatus ? 'status-info' : 'status-ok';

                    return (
                      <tr key={f.id}>
                        <td className="time-cell">{timeStr}</td>
                        <td className="city-cell">{type === 'departure' ? f.destination : f.origin}</td>
                        <td className="airline-cell">{f.airline}</td>
                        <td>
                          <Link href={`/flight/${f.id}?type=${type}`} className="flight-cell">
                            {f.flightNumber}
                          </Link>
                        </td>
                        <td>
                          <span className={`status-badge ${badgeClass}`}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredFlights.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        Нет доступных рейсов
                      </td>
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
