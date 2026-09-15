'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [formType, setFormType] = useState<'departure' | 'arrival'>('departure');
  const [fields, setFields] = useState<any>({ status: 'По расписанию' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType: formType, ...fields })
    });
    if (res.ok) {
      alert('Рейс успешно добавлен в базу Neon!');
      setFields({ status: formType === 'departure' ? 'По расписанию' : 'Прибытие ожидается' });
    }
  };

  const handleChange = (e: any) => setFields({ ...fields, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h1 className="text-2xl font-bold mb-6">Административная панель KON</h1>
        
        <div className="flex gap-4 mb-6 bg-slate-900 p-1 rounded-xl">
          <button type="button" onClick={() => { setFormType('departure'); setFields({status:'По расписанию'}); }} className={`flex-1 py-2 rounded-lg text-sm font-medium ${formType === 'departure' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Новый Вылет</button>
          <button type="button" onClick={() => { setFormType('arrival'); setFields({status:'Прибытие ожидается'}); }} className={`flex-1 py-2 rounded-lg text-sm font-medium ${formType === 'arrival' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Новый Прилет</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase">Номер рейса</label>
            <input required type="text" name="flightNumber" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase">Авиакомпания</label>
            <input required type="text" name="airline" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-400 uppercase">{formType === 'departure' ? 'Город назначения' : 'Город отправления'}</label>
            <input required type="text" name={formType === 'departure' ? 'destination' : 'origin'} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
          </div>

          {formType === 'departure' ? (
            <>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Вылет по расписанию</label>
                <input required type="datetime-local" name="scheduledDeparture" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Вылет фактический (при задержке)</label>
                <input type="datetime-local" name="actualDeparture" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Начало регистрации</label>
                <input required type="datetime-local" name="registrationStart" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Конец регистрации</label>
                <input required type="datetime-local" name="registrationEnd" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Стойки регистрации</label>
                <input required type="text" name="checkInDesks" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Выход (Gate)</label>
                <input required type="text" name="gate" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Начало посадки</label>
                <input required type="datetime-local" name="boardingStart" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Конец посадки</label>
                <input required type="datetime-local" name="boardingEnd" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 uppercase">Статус</label>
                <select name="status" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1 text-white">
                  <option value="По расписанию">По расписанию (пересчитывается автоматически)</option>
                  <option value="Задержан">Задержан</option>
                  <option value="Отменен">Отменен</option>
                  <option value="Вылетел">Вылетел (только вручную)</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Прилет по расписанию</label>
                <input required type="datetime-local" name="scheduledArrival" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Прилет фактический</label>
                <input type="datetime-local" name="actualArrival" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase">Лента багажа</label>
                <input type="text" name="baggageBelt" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 uppercase">Статус</label>
                <select name="status" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mt-1 text-white">
                  <option value="Прибытие ожидается">Прибытие ожидается (автостатус)</option>
                  <option value="Задержан">Задержан</option>
                  <option value="Отменен">Отменен</option>
                  <option value="Отправлен на запасной аэродром">Отправлен на запасной аэродром</option>
                </select>
              </div>
            </>
          )}
          
          <button type="submit" className="md:col-span-2 bg-emerald-600 hover:bg-emerald-500 font-bold p-3 rounded-xl mt-4 transition shadow-lg">
            Добавить рейс в расписание
          </button>
        </form>
      </div>
    </div>
  );
}
