// Хранилище данных в оперативной памяти сервера
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
  boardingStart: string;
  boardingEnd: string;
  gate: string;
  status: 'По расписанию' | 'Задержан' | 'Отменен' | 'Вылетел';
}

export interface ArrivalFlight {
  id: number;
  flightNumber: string;
  airline: string;
  origin: string;
  scheduledArrival: string;
  actualArrival?: string;
  baggageBelt?: string;
  status: 'Прибытие ожидается' | 'Отправлен на запасной аэродром' | 'Задержан' | 'Отменен' | 'Прибыл';
}

const globalStorage = globalThis as unknown as {
  departures: DepartureFlight[];
  arrivals: ArrivalFlight[];
  nextId: number;
};

if (!globalStorage.departures) {
  const today = new Date();
  const setTime = (hours: number, minutes: number) => {
    const d = new Date(today);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  globalStorage.nextId = 1;
  
  // Стартовые данные для табло из вашего макета
  globalStorage.departures = [
    {
      id: globalStorage.nextId++,
      flightNumber: 'RT-256',
      airline: 'UVT aero',
      destination: 'Пермь',
      scheduledDeparture: setTime(13, 50),
      actualDeparture: setTime(18, 30),
      registrationStart: setTime(11, 50),
      registrationEnd: setTime(13, 10),
      checkInDesks: '1-2',
      boardingStart: setTime(13, 15),
      boardingEnd: setTime(13, 40),
      gate: '2',
      status: 'По расписанию',
    },
    {
      id: globalStorage.nextId++,
      flightNumber: 'SU-1519',
      airline: 'АЭРОФЛОТ',
      destination: 'Москва(ШРМ)',
      scheduledDeparture: setTime(19, 0),
      registrationStart: setTime(17, 0),
      registrationEnd: setTime(18, 20),
      checkInDesks: '3-4',
      boardingStart: setTime(18, 25),
      boardingEnd: setTime(18, 50),
      gate: '1',
      status: 'По расписанию',
    },
    {
      id: globalStorage.nextId++,
      flightNumber: 'N4-748',
      airline: 'Nordwind',
      destination: 'Казань',
      scheduledDeparture: setTime(9, 55),
      actualDeparture: setTime(14, 5),
      registrationStart: setTime(7, 55),
      registrationEnd: setTime(9, 15),
      checkInDesks: '5',
      boardingStart: setTime(9, 20),
      boardingEnd: setTime(9, 45),
      gate: '3',
      status: 'Задержан',
    }
  ];

  globalStorage.arrivals = [
    {
      id: globalStorage.nextId++,
      flightNumber: 'S7-2630',
      airline: 'S7 Airlines',
      origin: 'Москва(ДМД)',
      scheduledArrival: setTime(8, 15),
      baggageBelt: '1',
      status: 'Прибытие ожидается',
    }
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
  }
};
