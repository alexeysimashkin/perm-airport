import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'departure'; // departure или arrival
  const dateParam = searchParams.get('date') || 'today'; // today или tomorrow

  const now = new Date();
  const startOfPeriod = new Date();
  const endOfPeriod = new Date();

  if (dateParam === 'tomorrow') {
    startOfPeriod.setDate(now.getDate() + 1);
    startOfPeriod.setHours(0, 0, 0, 0);
    endOfPeriod.setDate(now.getDate() + 1);
    endOfPeriod.setHours(23, 59, 59, 999);
  } else {
    startOfPeriod.setHours(0, 0, 0, 0);
    endOfPeriod.setHours(23, 59, 59, 999);
  }

  if (type === 'departure') {
    const flights = await prisma.departure.findMany({
      where: { scheduledDeparture: { gte: startOfPeriod, lte: endOfPeriod } },
      orderBy: { scheduledDeparture: 'asc' },
    });

    const mapped = flights.map(f => {
      let currentStatus = f.status;

      // Если статус не финальный ручной, считаем автоматически по времени
      if (!['Вылетел', 'Задержан', 'Отменен'].includes(f.status)) {
        if (now >= new Date(f.boardingEnd)) currentStatus = 'Посадка закончена';
        else if (now >= new Date(f.boardingStart)) currentStatus = 'Посадка';
        else if (now >= new Date(f.registrationEnd)) currentStatus = 'Регистрация закончена';
        else if (now >= new Date(f.registrationStart)) currentStatus = 'Регистрация';
        else currentStatus = 'По расписанию';
      }
      return { ...f, status: currentStatus };
    });

    return NextResponse.json(mapped);
  } else {
    const flights = await prisma.arrival.findMany({
      where: { scheduledArrival: { gte: startOfPeriod, lte: endOfPeriod } },
      orderBy: { scheduledArrival: 'asc' },
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
