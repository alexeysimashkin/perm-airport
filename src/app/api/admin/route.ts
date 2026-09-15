import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actionType, ...data } = body;

    if (actionType === 'departure') {
      const flight = await prisma.departure.create({
        data: {
          flightNumber: data.flightNumber,
          airline: data.airline,
          destination: data.destination,
          scheduledDeparture: new Date(data.scheduledDeparture),
          actualDeparture: data.actualDeparture ? new Date(data.actualDeparture) : null,
          registrationStart: new Date(data.registrationStart),
          registrationEnd: new Date(data.registrationEnd),
          checkInDesks: data.checkInDesks,
          boardingStart: new Date(data.boardingStart),
          boardingEnd: new Date(data.boardingEnd),
          gate: data.gate,
          status: data.status,
        }
      });
      return NextResponse.json(flight);
    } else if (actionType === 'arrival') {
      const flight = await prisma.arrival.create({
        data: {
          flightNumber: data.flightNumber,
          airline: data.airline,
          origin: data.origin,
          scheduledArrival: new Date(data.scheduledArrival),
          actualArrival: data.actualArrival ? new Date(data.actualArrival) : null,
          baggageBelt: data.baggageBelt,
          status: data.status,
        }
      });
      return NextResponse.json(flight);
    }
    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
