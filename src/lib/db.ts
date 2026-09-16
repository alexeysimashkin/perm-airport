export interface DepartureFlight {
  id: number;
  flightNumber: string;
  airline: string;
  destination: string;
  scheduledDeparture: string;
  actualDeparture?: string;
  registrationStart: string;
  registrationEnd: string;
  checkInDesks: string;
  boardingStart?: string;
  boardingEnd?: string;
  gate: string;
  status: string;
}

export interface ArrivalFlight {
  id: number;
  flightNumber: string;
  airline: string;
  origin: string;
  scheduledArrival: string;
  actualArrival?: string;
  baggageBelt?: string;
  status: string;
}

// Прослойка безопасности для пре-рендера Next.js (SSR)
const isClient = typeof window !== 'undefined';

const getInitialData = () => {
  if (!isClient) return { departures: [], arrivals: [], nextId: 5 };

  if (!window.localStorage.getItem('kon_initialized')) {
    const today = new Date();
    const setPermTime = (h: number, m: number) => {
      const d = new Date(today);
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };

    const deps: DepartureFlight[] = [
      { id: 1, flightNumber: 'RT-256', airline: 'UVT aero', destination: 'Пермь', scheduledDeparture: setPermTime(13, 50), actualDeparture: setPermTime(18, 30), registrationStart: setPermTime(11, 50), registrationEnd: setPermTime(13, 10), checkInDesks: '1-2', gate: '2', status: 'По расписанию' },
      { id: 2, flightNumber: 'SU-1519', airline: 'АЭРОФЛОТ', destination: 'Москва(ШРМ)', scheduledDeparture: setPermTime(19, 0), registrationStart: setPermTime(17, 0), registrationEnd: setPermTime(18, 20), checkInDesks: '3-4', gate: '1', status: 'По расписанию' },
      { id: 3, flightNumber: 'N4-748', airline: 'Nordwind', destination: 'Казань', scheduledDeparture: setPermTime(9, 55), actualDeparture: setPermTime(14, 5), registrationStart: setPermTime(7, 55), registrationEnd: setPermTime(9, 15), checkInDesks: '5', gate: '3', status: 'Задержан' }
    ];

    const arrs: ArrivalFlight[] = [
      { id: 4, flightNumber: 'S7-2630', airline: 'S7 Airlines', origin: 'Москва(ДМД)', scheduledArrival: setPermTime(8, 15), baggageBelt: '1', status: 'Прибытие ожидается' }
    ];

    window.localStorage.setItem('kon_departures', JSON.stringify(deps));
    window.localStorage.setItem('kon_arrivals', JSON.stringify(arrs));
    window.localStorage.setItem('kon_next_id', '5');
    window.localStorage.setItem('kon_initialized', 'true');
  }

  return {
    departures: JSON.parse(window.localStorage.getItem('kon_departures') || '[]'),
    arrivals: JSON.parse(window.localStorage.getItem('kon_arrivals') || '[]'),
    nextId: Number(window.localStorage.getItem('kon_next_id') || '5')
  };
};

// Функция динамического авторасчета статусов на клиенте
export const calculateStatuses = (flights: any[], type: 'departure' | 'arrival') => {
  const now = new Date();
  return flights.map(f => {
    let currentStatus = f.status;

    if (type === 'departure') {
      if (!['Вылетел', 'Задержан', 'Отменен'].includes(f.status)) {
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
    } else {
      if (!['Отправлен на запасной аэродром', 'Задержан', 'Отменен', 'Прибыл'].includes(f.status)) {
        const arrivalTime = f.actualArrival ? new Date(f.actualArrival) : new Date(f.scheduledArrival);
        if (now >= arrivalTime) currentStatus = 'Прибыл';
        else currentStatus = 'Прибытие ожидается';
      }
    }
    return { ...f, status: currentStatus };
  });
};

export const db = {
  getDepartures: () => {
    const data = getInitialData().departures;
    return calculateStatuses(data, 'departure') as DepartureFlight[];
  },
  getArrivals: () => {
    const data = getInitialData().arrivals;
    return calculateStatuses(data, 'arrival') as ArrivalFlight[];
  },
  addDeparture: (flight: Omit<DepartureFlight, 'id'>) => {
    const storage = getInitialData();
    const newFlight = { ...flight, id: storage.nextId };
    storage.departures.push(newFlight);
    window.localStorage.setItem('kon_departures', JSON.stringify(storage.departures));
    window.localStorage.setItem('kon_next_id', String(storage.nextId + 1));
    return newFlight;
  },
  addArrival: (flight: Omit<ArrivalFlight, 'id'>) => {
    const storage = getInitialData();
    const newFlight = { ...flight, id: storage.nextId };
    storage.arrivals.push(newFlight);
    window.localStorage.setItem('kon_arrivals', JSON.stringify(storage.arrivals));
    window.localStorage.setItem('kon_next_id', String(storage.nextId + 1));
    return newFlight;
  },
  deleteDeparture: (id: number) => {
    const storage = getInitialData();
    const filtered = storage.departures.filter((f: any) => f.id !== id);
    window.localStorage.setItem('kon_departures', JSON.stringify(filtered));
  },
  deleteArrival: (id: number) => {
    const storage = getInitialData();
    const filtered = storage.arrivals.filter((f: any) => f.id !== id);
    window.localStorage.setItem('kon_arrivals', JSON.stringify(filtered));
  },
  updateDeparture: (id: number, data: Partial<DepartureFlight>) => {
    const storage = getInitialData();
    const updated = storage.departures.map((f: any) => f.id === id ? { ...f, ...data } : f);
    window.localStorage.setItem('kon_departures', JSON.stringify(updated));
  },
  updateArrival: (id: number, data: Partial<ArrivalFlight>) => {
    const storage = getInitialData();
    const updated = storage.arrivals.map((f: any) => f.id === id ? { ...f, ...data } : f);
    window.localStorage.setItem('kon_arrivals', JSON.stringify(updated));
  }
};
