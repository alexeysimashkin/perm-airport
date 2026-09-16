import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'departure';
  const dateParam = searchParams.get('date') || 'today';

  const now = new Date();
  const isTomorrowRequested = dateParam === 'tomorrow';

  if (type === 'departure') {
    // Получаем рейсы текущего дня и фильтруем по дате (сегодня/завтра)
    const flights = db.getDepartures().filter(f => {
      const flightDate = new Date(f.scheduledDeparture);
      const isTomorrow = flightDate.getDate() === (now.getDate() + 1);
      return isTomorrowRequested ? isTomorrow : !isTomorrow;
    });

    // Принудительная сортировка от 00:00 до 23:59 (по возрастанию времени)
    flights.sort((a, b) => new Date(a.scheduledDeparture).getTime() - new Date(b.scheduledDeparture).getTime());

    const mapped = flights.map(f => {
      let currentStatus = f.status;

      if (!['Вылетел', 'Задержан', 'Отменен'].includes(f.status)) {
        // Защита от пустых значений начала/конца посадки при авторасчете
        const bEnd = f.boardingEnd ? new Date(f.boardingEnd) : null;
        const bStart = f.boardingStart ? new Date(f.boardingStart) : null;
        const rEnd = new Date(f.registrationEnd);
        const rStart = new Date(f.registrationStart);

        if (bEnd && now >= bEnd) currentStatus = 'Посадка закончена';
        else if (bStart && now >= bStart) currentStatus = 'Посадка';
        else if (now >= rEnd) currentStatus = 'Регистрация закончена';
        else if (now >= rStart) currentStatus = 'Регистрация';
        else currentStatus = 'По расписанию';
      }
      return { ...f, status: currentStatus };
    });

    return NextResponse.json(mapped);
  } else {
    const flights = db.getArrivals().filter(f => {
      const flightDate = new Date(f.scheduledArrival);
      const isTomorrow = flightDate.getDate() === (now.getDate() + 1);
      return isTomorrowRequested ? isTomorrow : !isTomorrow;
    });

    // Сортировка прилетов от 00:00 до 23:59
    flights.sort((a, b) => new Date(a.scheduledArrival).getTime() - new Date(b.scheduledArrival).getTime());

    const mapped = flights.map(f => {
      let currentStatus = f.status;

      if (!['Отправлен на запасной аэродром', 'Задержан', 'Отменен', 'Прибыл'].includes(f.status)) {
        const arrivalTime = f.actualArrival ? new Date(f.actualArrival) : new Date(f.scheduledArrival);
        if (now >= arrivalTime) currentStatus = 'Прибыл';
        else currentStatus = 'Прибытие ожидается';
      }
      return { ...f, status: currentStatus };
    });

    return NextResponse.json(mapped);
  }
}
