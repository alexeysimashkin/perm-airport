'use client';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../../lib/db';

export default function FlightDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [flight, setFlight] = useState<any>(null);

  useEffect(() => {
    const data = type === 'departure' ? db.getDepartures() : db.getArrivals();
    const found = data.find((f: any) => f.id === Number(params.id));
    setFlight(found);
  }, [params.id, type]);

  if (!flight) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: '#64748b' }}>Загрузка информации о рейсе...</div>;
  }

  const isDeparture = type === 'departure';

  const formatPermTime = (isoString?: string) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleString('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatOnlyTime = (isoString?: string) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleTimeString('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: '#f8fafc' }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', width: '100%', maxWidth: '650px', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: isDeparture ? '#059669' : '#2563eb' }} />
        
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, color: '#64748b', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Вернуться в табло
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontFamily: 'monospace', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{flight.flightNumber}</h1>
            <p style={{ color: '#475569', fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{flight.airline}</p>
          </div>
          <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#0f172a', fontSize: '14px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            {flight.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr md:1fr', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>Маршрут</p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                {isDeparture ? `Кондратово (KON) → ${flight.destination}` : `${flight.origin} → Кондратово (KON)`}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>Время по расписанию (Пермь)</p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', marginTop: '4px' }}>
                {formatPermTime(isDeparture ? flight.scheduledDeparture : flight.scheduledArrival)}
              </p>
            </div>
          </div>

          {isDeparture ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Регистрация и Стойки</p>
                <p style={{ fontSize: '15px', color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>Стойки: <span style={{ color: '#b45309', fontFamily: 'monospace' }}>{flight.checkInDesks}</span></p>
                <p style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                  {formatOnlyTime(flight.registrationStart)} — {formatOnlyTime(flight.registrationEnd)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Посадка и Выход (Gate)</p>
                <p style={{ fontSize: '15px', color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>Выход: <span style={{ color: '#1d4ed8', fontFamily: 'monospace' }}>{flight.gate}</span></p>
                <p style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                  {flight.boardingStart ? `${formatOnlyTime(flight.boardingStart)} — ${formatOnlyTime(flight.boardingEnd)}` : 'Время будет объявлено'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Лента выдачи багажа</p>
              <p style={{ fontSize: '24px', fontWeight: 900, color: '#b45309', fontFamily: 'monospace', marginTop: '4px' }}>{flight.baggageBelt || '—'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
