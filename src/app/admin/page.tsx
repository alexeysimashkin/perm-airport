'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [formType, setFormType] = useState<'departure' | 'arrival'>('departure');
  const [fields, setFields] = useState<any>({ status: 'По расписанию' });
  const [flights, setFlights] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadFlights = async () => {
    const res = await fetch(`/api/flights?type=${formType}&date=today`);
    const data = await res.json();
    setFlights(data);
  };

  useEffect(() => { loadFlights(); }, [formType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/${editingId}?type=${formType}` : '/api/admin';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType: formType, ...fields })
    });

    if (res.ok) {
      alert(editingId ? 'Рейс изменен!' : 'Рейс успешно добавлен!');
      setFields({ status: formType === 'departure' ? 'По расписанию' : 'Прибытие ожидается' });
      setEditingId(null);
      loadFlights();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот рейс?')) return;
    const res = await fetch(`/api/admin/${id}?type=${formType}`, { method: 'DELETE' });
    if (res.ok) loadFlights();
  };

  const handleEditInit = (flight: any) => {
    setEditingId(flight.id);
    const formattedFields = { ...flight };
    const dateFields = ['scheduledDeparture', 'actualDeparture', 'registrationStart', 'registrationEnd', 'boardingStart', 'boardingEnd', 'scheduledArrival', 'actualArrival'];
    dateFields.forEach(field => {
      if (formattedFields[field]) {
        formattedFields[field] = new Date(formattedFields[field]).toISOString().slice(0, 16);
      }
    });
    setFields(formattedFields);
  };

  const handleChange = (e: any) => setFields({ ...fields, [e.target.name]: e.target.value });

  const formatPermTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div style={{ padding: '12px' }}>
      <header className="airport-header">
        <div>
          <div className="airport-logo">КОНДРАТОВО</div>
          <div className="airport-sub">ПАНЕЛЬ УПРАВЛЕНИЯ РЕЙСАМИ (UTC+5)</div>
        </div>
        <div className="nav-buttons">
          <a href="/" className="btn-secondary">На главную сайта 🏠</a>
        </div>
      </header>

      <div className="admin-grid">
        {/* ЛЕВАЯ СЕКЦИЯ: ФОРМА ДОБАВЛЕНИЯ / РЕДАКТИРОВАНИЯ */}
        <div className="admin-box">
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
            {editingId ? '✏️ Изменение рейса' : '➕ Добавить новый рейс'}
          </h2>
          
          <div className="toggle-group" style={{ marginBottom: '20px' }}>
            <button disabled={editingId !== null} type="button" onClick={() => { setFormType('departure'); setFields({status:'По расписанию'}); }} className={`toggle-btn ${formType === 'departure' ? 'active-dep' : ''}`} style={{ flex: 1 }}>Вылеты</button>
            <button disabled={editingId !== null} type="button" onClick={() => { setFormType('arrival'); setFields({status:'Прибытие ожидается'}); }} className={`toggle-btn ${formType === 'arrival' ? 'active-arr' : ''}`} style={{ flex: 1 }}>Прилеты</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Рейс</label>
                <input required type="text" name="flightNumber" value={fields.flightNumber || ''} onChange={handleChange} className="form-control" placeholder="RT-100" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Авиакомпания</label>
                <input required type="text" name="airline" value={fields.airline || ''} onChange={handleChange} className="form-control" placeholder="S7 Airlines" />
              </div>
            </div>
            
            <div>
              <label className="form-label">{formType === 'departure' ? 'Куда (Город)' : 'Откуда (Город)'}</label>
              <input required type="text" name={formType === 'departure' ? 'destination' : 'origin'} value={formType === 'departure' ? (fields.destination || '') : (fields.origin || '')} onChange={handleChange} className="form-control" placeholder="Москва" />
            </div>

            {formType === 'departure' ? (
              <>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}><label className="form-label">План вылета</label><input required type="datetime-local" name="scheduledDeparture" value={fields.scheduledDeparture || ''} onChange={handleChange} className="form-control" /></div>
                  <div style={{ flex: 1 }}><label className="form-label">Факт вылета</label><input type="datetime-local" name="actualDeparture" value={fields.actualDeparture || ''} onChange={handleChange} className="form-control" /></div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}><label className="form-label">Регистрация Нач.</label><input required type="datetime-local" name="registrationStart" value={fields.registrationStart || ''} onChange={handleChange} className="form-control" /></div>
                  <div style={{ flex: 1 }}><label className="form-label">Регистрация Кон.</label><input required type="datetime-local" name="registrationEnd" value={fields.registrationEnd || ''} onChange={handleChange} className="form-control" /></div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}><label className="form-label">Стойки</label><input required type="text" name="checkInDesks" value={fields.checkInDesks || ''} onChange={handleChange} className="form-control" placeholder="1-2" /></div>
                  <div style={{ flex: 1 }}><label className="form-label">Выход (Gate)</label><input required type="text" name="gate" value={fields.gate || ''} onChange={handleChange} className="form-control" placeholder="3" /></div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* НЕОБЯЗАТЕЛЬНЫЕ ПОЛЯ ПОСАДКИ (БЕЗ REQUIRED) */}
                  <div style={{ flex: 1 }}><label className="form-label">Посадка Нач. (Опционально)</label><input type="datetime-local" name="boardingStart" value={fields.boardingStart || ''} onChange={handleChange} className="form-control" /></div>
                  <div style={{ flex: 1 }}><label className="form-label">Посадка Кон. (Опционально)</label><input type="datetime-local" name="boardingEnd" value={fields.boardingEnd || ''} onChange={handleChange} className="form-control" /></div>
                </div>
                <div>
                  <label className="form-label">Статус</label>
                  <select name="status" value={fields.status || 'По расписанию'} onChange={handleChange} className="form-control">
                    <option value="По расписанию">По расписанию</option>
                    <option value="Задержан">Задержан</option>
                    <option value="Отменен">Отменен</option>
                    <option value="Вылетел">Вылетел (Вручную)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}><label className="form-label">План прилета</label><input required type="datetime-local" name="scheduledArrival" value={fields.scheduledArrival || ''} onChange={handleChange} className="form-control" /></div>
                  <div style={{ flex: 1 }}><label className="form-label">Факт прилета</label><input type="datetime-local" name="actualArrival" value={fields.actualArrival || ''} onChange={handleChange} className="form-control" /></div>
                </div>
                <div><label className="form-label">Лента багажа</label><input type="text" name="baggageBelt" value={fields.baggageBelt || ''} onChange={handleChange} className="form-control" placeholder="Лента 1" /></div>
                <div>
                  <label className="form-label">Статус</label>
                  <select name="status" value={fields.status || 'Прибытие ожидается'} onChange={handleChange} className="form-control">
                    <option value="Прибытие ожидается">Прибытие ожидается</option>
                    <option value="Задержан">Задержан</option>
                    <option value="Отменен">Отменен</option>
                    <option value="Отправлен на запасной аэродром">Отправлен на запасной аэродром</option>
                  </select>
                </div>
              </>
            )}
            <button type="submit" className="btn-primary" style={{ border: 'none', padding: '12px', cursor: 'pointer', marginTop: '10px', fontSize: '14px', borderRadius: '12px' }}>
              {editingId ? 'Сохранить изменения' : 'Добавить рейс в табло'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFields({ status: formType === 'departure' ? 'По расписанию' : 'Прибытие ожидается' }); }} className="btn-secondary" style={{ padding: '12px' }}>Отмена</button>}
          </form>
        </div>

        {/* ПРАВАЯ СЕКЦИЯ: ТАБЛИЦА С КНОПКАМИ КАРАНДАША И КОРЗИНЫ */}
        <div className="admin-box">
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>📋 Список добавленных рейсов</h2>
          <div className="table-wrapper">
            <table className="tablo-table">
              <thead>
                <tr>
                  <th>Рейс</th>
                  <th>{formType === 'departure' ? 'Куда' : 'Откуда'}</th>
                  <th>Время (Пермь)</th>
                  <th>Статус</th>
                  <th style={{ textAlign: 'center' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => (
                  <tr key={f.id}>
                    <td className="time-cell" style={{ color: '#059669' }}>{f.flightNumber}</td>
                    <td style={{ fontWeight: 500 }}>{formType === 'departure' ? f.destination : f.origin}</td>
                    <td className="time-cell">{formatPermTime(formType === 'departure' ? f.scheduledDeparture : f.scheduledArrival)}</td>
                    <td><span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{f.status}</span></td>
                    <td className="action-btn" style={{ textAlign: 'center' }}>
                      <button onClick={() => handleEditInit(f)} title="Редактировать">✏️</button>
                      <button onClick={() => handleDelete(f.id)} title="Удалить">🗑️</button>
                    </td>
                  </tr>
                ))}
                {flights.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Рейсов пока нет</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
