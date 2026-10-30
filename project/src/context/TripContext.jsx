import { createContext, useContext, useMemo } from 'react';
import { useGeolocationTrip } from '@/hooks/useGeolocationTrip';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const trip = useGeolocationTrip();
  const value = useMemo(() => trip, [trip]);
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const value = useContext(TripContext);
  if (!value) throw new Error('useTrip must be used inside TripProvider');
  return value;
}
