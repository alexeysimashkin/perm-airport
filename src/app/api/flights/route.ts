import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'departure';
  const dateParam = searchParams.get('date') || 'today';

  const now = new Date();
  const isTomorrowRequested = dateParam === 'tomorrow';

  if (type === 'departure') {
    const flights = db.getDepartures().filter(f => {
      const flightDate = new Date(f.scheduledDeparture);
      const isTomorrow = flightDate.getDate() === (now.getDate() + 1);
      return isTomorrowRequested ? isTomorrow : !isTomorrow;
    });

    const mapped = flights.map(f => {
      let currentStatus = f.status;

      if (!['Вылетел', 'Задержан', 'Отменен'].includes(f.status)) {
        const bEnd = new Date(f.boardingEnd);
        const bStart = new Date(f.boardingStart);
        const rEnd = new Date(f.registrationEnd);
        const rStart = new Date(f.registrationStart);

        if (now >= bEnd) currentStatus = 'Посадка закончена';
        else if (now >= bStart) currentStatus = 'Посадка';
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
