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

  useEffect(() => {
    loadFlights();
  }, [formType]);

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
      alert(editingId ? 'Рейс успешно обновлен!' : 'Рейс добавлен в систему!');
      setFields({ status: formType === 'departure' ? 'По расписанию' : 'Прибытие ожидается' });
      setEditingId(null);
      loadFlights();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот рейс?')) return;
    const res = await fetch(`/api/admin/${id}?type=${formType}`, { method: 'DELETE' });
    if (res.ok) loadFlights();
  };

  const handleEditInit = (flight: any) => {
    setEditingId(flight.id);
    const formattedFields = { ...flight };
    const dateFields = [
      'scheduledDeparture', 'actualDeparture', 'registrationStart', 
      'registrationEnd', 'boardingStart', 'boardingEnd', 
      'scheduledArrival', 'actualArrival'
    ];
    
    dateFields.forEach(field => {
      if (formattedFields[field]) {
        formattedFields[field] = new Date(formattedFields[field]).toISOString().slice(0, 16);
      }
    });
    setFields(formattedFields);
  };

  const handleChange = (e: any) => setFields({ ...fields, [e.target.name]: e.target.value });
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ЛЕВАЯ ЧАСТЬ: ФОРМА УПРАВЛЕНИЯ */}
        <div className="lg:col-span-5 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl h-fit">
          <h1 className="text-xl font-bold mb-4 tracking-tight">
            {editingId ? '✏️ Редактирование' : '➕ Добавление рейса'}
          </h1>
          
          <div className="flex gap-2 mb-4 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button disabled={editingId !== null} type="button" onClick={() => { setFormType('departure'); setFields({status:'По расписанию'}); }} className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${formType === 'departure' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}>Вылеты</button>
            <button disabled={editingId !== null} type="button" onClick={() => { setFormType('arrival'); setFields({status:'Прибытие ожидается'}); }} className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${formType === 'arrival' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}>Прилеты</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Рейс</label>
                <input required type="text" name="flightNumber" value={fields.flightNumber || ''} onChange={handleChange} placeholder="SU-100" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 font-mono text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Авиакомпания</label>
                <input required type="text" name="airline" value={fields.airline || ''} onChange={handleChange} placeholder="Аэрофлот" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{formType === 'departure' ? 'Куда (Город назначения)' : 'Откуда (Город отправления)'}</label>
              <input required type="text" name={formType === 'departure' ? 'destination' : 'origin'} value={formType === 'departure' ? (fields.destination || '') : (fields.origin || '')} onChange={handleChange} placeholder="Москва" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 text-white" />
            </div>

            {formType === 'departure' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">План вылета</label>
                    <input required type="datetime-local" name="scheduledDeparture" value={fields.scheduledDeparture || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Факт вылета</label>
                    <input type="datetime-local" name="actualDeparture" value={fields.actualDeparture || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Регистрация нач.</label>
                    <input required type="datetime-local" name="registrationStart" value={fields.registrationStart || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Регистрация кон.</label>
                    <input required type="datetime-local" name="registrationEnd" value={fields.registrationEnd || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Стойки</label>
                    <input required type="text" name="checkInDesks" value={fields.checkInDesks || ''} onChange={handleChange} placeholder="1-4" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 font-mono text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Выход (Gate)</label>
                    <input required type="text" name="gate" value={fields.gate || ''} onChange={handleChange} placeholder="A1" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 font-mono text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Посадка нач.</label>
                    <input required type="datetime-local" name="boardingStart" value={fields.boardingStart || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Посадка кон.</label>
                    <input required type="datetime-local" name="boardingEnd" value={fields.boardingEnd || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Статус</label>
                  <select name="status" value={fields.status || 'По расписанию'} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 text-white font-medium focus:outline-none">
                    <option value="По расписанию">По расписанию (автостатус)</option>
                    <option value="Задержан">Задержан (время зачеркнется)</option>
                    <option value="Отменен">Отменен</option>
                    <option value="Вылетел">Вылетел (только вручную)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">План прилета</label>
                    <input required type="datetime-local" name="scheduledArrival" value={fields.scheduledArrival || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Факт прилета</label>
                    <input type="datetime-local" name="actualArrival" value={fields.actualArrival || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 font-mono text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Лента выдачи багажа</label>
                  <input type="text" name="baggageBelt" value={fields.baggageBelt || ''} onChange={handleChange} placeholder="Лента 1" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 font-mono text-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Статус</label>
                  <select name="status" value={fields.status || 'Прибытие ожидается'} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 mt-1 text-white font-medium focus:outline-none">
                    <option value="Прибытие ожидается">Прибытие ожидается (автостатус)</option>
                    <option value="Задержан">Задержан</option>
                    <option value="Отменен">Отменен</option>
                    <option value="Отправлен на запасной аэродром">Отправлен на запасной аэродром</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold p-3 rounded-xl transition shadow-lg text-white">
                {editingId ? 'Сохранить изменения' : 'Добавить рейс'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFields({ status: formType === 'departure' ? 'По расписанию' : 'Прибытие ожидается' }); }} className="bg-slate-700 hover:bg-slate-600 font-bold p-3 rounded-xl transition text-white">
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ТАБЛИЦА РЕЙСОВ */}
        <div className="lg:col-span-7 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4 tracking-tight">📋 Зарегистрированные рейсы</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">Рейс</th>
                  <th className="p-3">Направление</th>
                  <th className="p-3">Время</th>
                  <th className="p-3">Статус</th>
                  <th className="p-3 text-center">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {flights.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{f.flightNumber}</td>
                    <td className="p-3 font-medium text-slate-200">{formType === 'departure' ? f.destination : f.origin}</td>
                    <td className="p-3 font-mono text-white">
                      {new Date(formType === 'departure' ? f.scheduledDeparture : f.scheduledArrival).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${f.status === 'Задержан' || f.status === 'Отменен' ? 'bg-red-500/20 text-red-400' : 'bg-slate-900 text-slate-400'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => handleEditInit(f)} title="Редактировать" className="hover:scale-125 transition duration-150">✏️</button>
                        <button onClick={() => handleDelete(f.id)} title="Удалить" className="hover:scale-125 transition duration-150">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {flights.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-500 font-medium">Список рейсов пуст</td>
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
