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
  boardingStart?: string; // Необязательно
  boardingEnd?: string;   // Необязательно
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

const globalStorage = globalThis as unknown as {
  departures: DepartureFlight[];
  arrivals: ArrivalFlight[];
  nextId: number;
};

if (!globalStorage.departures) {
  const today = new Date();
  // Генерация времени в часовом поясе Перми (UTC+5)
  const setPermTime = (hours: number, minutes: number) => {
    const d = new Date(today);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  globalStorage.nextId = 5;
  globalStorage.departures = [
    { id: 1, flightNumber: 'RT-256', airline: 'UVT aero', destination: 'Пермь', scheduledDeparture: setPermTime(13, 50), actualDeparture: setPermTime(18, 30), registrationStart: setPermTime(11, 50), registrationEnd: setPermTime(13, 10), checkInDesks: '1-2', gate: '2', status: 'По расписанию' },
    { id: 2, flightNumber: 'SU-1519', airline: 'АЭРОФЛОТ', destination: 'Москва(ШРМ)', scheduledDeparture: setPermTime(19, 0), registrationStart: setPermTime(17, 0), registrationEnd: setPermTime(18, 20), checkInDesks: '3-4', gate: '1', status: 'По расписанию' },
    { id: 3, flightNumber: 'N4-748', airline: 'Nordwind', destination: 'Казань', scheduledDeparture: setPermTime(9, 55), actualDeparture: setPermTime(14, 5), registrationStart: setPermTime(7, 55), registrationEnd: setPermTime(9, 15), checkInDesks: '5', gate: '3', status: 'Задержан' }
  ];
  globalStorage.arrivals = [
    { id: 4, flightNumber: 'S7-2630', airline: 'S7 Airlines', origin: 'Москва(ДМД)', scheduledArrival: setPermTime(8, 15), baggageBelt: '1', status: 'Прибытие ожидается' }
  ];
}

export const db = {
  getDepartures: () => globalStorage.departures,
  getArrivals: () => globalStorage.arrivals,
  addDeparture: (flight: Omit<DepartureFlight, 'id'>) => {
    const newFlight = { ...flight, id: globalStorage.nextId++ };
    globalStorage.departures.push(newFlight);
    return newFlight;
  },
  addArrival: (flight: Omit<ArrivalFlight, 'id'>) => {
    const newFlight = { ...flight, id: globalStorage.nextId++ };
    globalStorage.arrivals.push(newFlight);
    return newFlight;
  },
  deleteDeparture: (id: number) => {
    globalStorage.departures = globalStorage.departures.filter(f => f.id !== id);
  },
  deleteArrival: (id: number) => {
    globalStorage.arrivals = globalStorage.arrivals.filter(f => f.id !== id);
  },
  updateDeparture: (id: number, data: Partial<DepartureFlight>) => {
    globalStorage.departures = globalStorage.departures.map(f => f.id === id ? { ...f, ...data } : f);
  },
  updateArrival: (id: number, data: Partial<ArrivalFlight>) => {
    globalStorage.arrivals = globalStorage.arrivals.map(f => f.id === id ? { ...f, ...data } : f);
  }
};
