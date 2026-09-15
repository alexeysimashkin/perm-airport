// Хранилище данных с поддержкой localStorage для Vercel / локальной разработки
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

// Провайдер данных, стабильный в любой среде выполнения
const getStorage = () => {
  if (typeof window !== 'undefined') {
    if (!window.localStorage.getItem('kon_departures')) {
      const today = new Date();
      const setTime = (h: number, m: number) => {
        const d = new Date(today);
        d.setHours(h, m, 0, 0);
        return d.toISOString();
      };
      
      const initialDeps = [
        { id: 1, flightNumber: 'RT-256', airline: 'UVT aero', destination: 'Пермь', scheduledDeparture: setTime(13, 50), actualDeparture: setTime(18, 30), registrationStart: setTime(11, 50), registrationEnd: setTime(13, 10), checkInDesks: '1-2', boardingStart: setTime(13, 15), boardingEnd: setTime(13, 40), gate: '2', status: 'По расписанию' as const },
        { id: 2, flightNumber: 'SU-1519', airline: 'АЭРОФЛОТ', destination: 'Москва(ШРМ)', scheduledDeparture: setTime(19, 0), registrationStart: setTime(17, 0), registrationEnd: setTime(18, 20), checkInDesks: '3-4', boardingStart: setTime(18, 25), boardingEnd: setTime(18, 50), gate: '1', status: 'По расписанию' as const },
        { id: 3, flightNumber: 'N4-748', airline: 'Nordwind', destination: 'Казань', scheduledDeparture: setTime(9, 55), actualDeparture: setTime(14, 5), registrationStart: setTime(7, 55), registrationEnd: setTime(9, 15), checkInDesks: '5', boardingStart: setTime(9, 20), boardingEnd: setTime(9, 45), gate: '3', status: 'Задержан' as const }
      ];
      
      const initialArrs = [
        { id: 4, flightNumber: 'S7-2630', airline: 'S7 Airlines', origin: 'Москва(ДМД)', scheduledArrival: setTime(8, 15), baggageBelt: '1', status: 'Прибытие ожидается' as const }
      ];

      window.localStorage.setItem('kon_departures', JSON.stringify(initialDeps));
      window.localStorage.setItem('kon_arrivals', JSON.stringify(initialArrs));
      window.localStorage.setItem('kon_next_id', '5');
    }
    
    return {
      getDeps: () => JSON.parse(window.localStorage.getItem('kon_departures') || '[]'),
      getArrs: () => JSON.parse(window.localStorage.getItem('kon_arrivals') || '[]'),
      saveDeps: (data: any) => window.localStorage.setItem('kon_departures', JSON.stringify(data)),
      saveArrs: (data: any) => window.localStorage.setItem('kon_arrivals', JSON.stringify(data)),
      getId: () => Number(window.localStorage.getItem('kon_next_id') || '1'),
      incrementId: () => window.localStorage.setItem('kon_next_id', String(Number(window.localStorage.getItem('kon_next_id') || '1') + 1))
    };
  }

  // Заглушка для серверной пре-сборки Next.js (SSR)
  return { getDeps: () => [], getArrs: () => [], saveDeps: () => {}, saveArrs: () => {}, getId: () => 1, incrementId: () => {} };
};

export const db = {
  getDepartures: () => getStorage().getDeps() as DepartureFlight[],
  getArrivals: () => getStorage().getArrs() as ArrivalFlight[],
  
  addDeparture: (flight: Omit<DepartureFlight, 'id'>) => {
    const store = getStorage();
    const newFlight = { ...flight, id: store.getId() };
    const data = store.getDeps();
    data.push(newFlight);
    store.saveDeps(data);
    store.incrementId();
    return newFlight;
  },
  
  addArrival: (flight: Omit<ArrivalFlight, 'id'>) => {
    const store = getStorage();
    const newFlight = { ...flight, id: store.getId() };
    const data = store.getArrs();
    data.push(newFlight);
    store.saveArrs(data);
    store.incrementId();
    return newFlight;
  },

  deleteDeparture: (id: number) => {
    const store = getStorage();
    const data = store.getDeps().filter((f: any) => f.id !== id);
    store.saveDeps(data);
  },

  deleteArrival: (id: number) => {
    const store = getStorage();
    const data = store.getArrs().filter((f: any) => f.id !== id);
    store.saveArrs(data);
  },

  updateDeparture: (id: number, updatedData: Partial<DepartureFlight>) => {
    const store = getStorage();
    const data = store.getDeps().map((f: any) => f.id === id ? { ...f, ...updatedData } : f);
    store.saveDeps(data);
  },

  updateArrival: (id: number, updatedData: Partial<ArrivalFlight>) => {
    const store = getStorage();
    const data = store.getArrs().map((f: any) => f.id === id ? { ...f, ...updatedData } : f);
    store.saveArrs(data);
  }
};
