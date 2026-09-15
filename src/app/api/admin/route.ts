import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actionType, ...data } = body;

    if (actionType === 'departure') {
      const newFlight = db.addDeparture({
        flightNumber: data.flightNumber,
        airline: data.airline,
        destination: data.destination,
        scheduledDeparture: new Date(data.scheduledDeparture).toISOString(),
        actualDeparture: data.actualDeparture ? new Date(data.actualDeparture).toISOString() : undefined,
        registrationStart: new Date(data.registrationStart).toISOString(),
        registrationEnd: new Date(data.registrationEnd).toISOString(),
        checkInDesks: data.checkInDesks,
        boardingStart: new Date(data.boardingStart).toISOString(),
        boardingEnd: new Date(data.boardingEnd).toISOString(),
        gate: data.gate,
        status: data.status,
      });
      return NextResponse.json(newFlight);
    } else if (actionType === 'arrival') {
      const newFlight = db.addArrival({
        flightNumber: data.flightNumber,
        airline: data.airline,
        origin: data.origin,
        scheduledArrival: new Date(data.scheduledArrival).toISOString(),
        actualArrival: data.actualArrival ? new Date(data.actualArrival).toISOString() : undefined,
        baggageBelt: data.baggageBelt || undefined,
        status: data.status,
      });
      return NextResponse.json(newFlight);
    }
    return NextResponse.json({ error: 'Неверный тип операции' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
