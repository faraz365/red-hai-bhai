import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/passenger/login" state={{ from: location }} replace />;
  return children;
}

export function RequirePassenger({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/passenger/login" state={{ from: location }} replace />;
  return children;
}

export function RequireDriver({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/driver/login" state={{ from: location }} replace />;

  return <DriverGate user={user}>{children}</DriverGate>;
}

function DriverGate({ user, children }) {
  const { driverProfile, loading } = useUserProfile(user);
  if (loading) return null;
  if (!driverProfile || driverProfile.active !== true) return <Navigate to="/driver/login" replace />;
  return children;
}
