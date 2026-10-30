import { NavLink } from 'react-router-dom';
import { Compass, MessageCircle, Navigation, UserRound, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export function BottomNav() {
  const { user } = useAuth();
  const { driverProfile } = useUserProfile(user);
  const isDriver = !!driverProfile && driverProfile.active === true;

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end><Navigation size={18} /><span>Explore</span></NavLink>
      <NavLink to="/lost-found"><Compass size={18} /><span>Lost & Found</span></NavLink>
      <NavLink to="/assistant"><MessageCircle size={18} /><span>Assistant</span></NavLink>
      {isDriver ? (
        <NavLink to="/driver"><UserRound size={18} /><span>Driver</span></NavLink>
      ) : user ? (
        <NavLink to="/passenger/dashboard"><LayoutDashboard size={18} /><span>Dashboard</span></NavLink>
      ) : (
        <NavLink to="/passenger/login"><UserRound size={18} /><span>Sign in</span></NavLink>
      )}
    </nav>
  );
}
