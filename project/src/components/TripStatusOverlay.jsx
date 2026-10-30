import { useNavigate } from 'react-router-dom';
import { Navigation, Square } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export function TripStatusOverlay() {
  const trip = useTrip();
  const navigate = useNavigate();

  if (!trip.tracking) return null;

  return (
    <div className="trip-overlay">
      <button className="trip-overlay-btn" onClick={() => navigate('/driver')}>
        <Navigation size={16} /> Trip active · {trip.gpsStatus}
      </button>
      <button className="trip-overlay-stop" onClick={trip.stopTrip}>
        <Square size={15} fill="currentColor" /> Stop
      </button>
    </div>
  );
}
