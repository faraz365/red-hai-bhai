import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { BottomNav } from './BottomNav';
import { SideMenu } from './SideMenu';
import { ErrorBanner } from './ErrorBanner';
import { useAuthError } from '@/hooks/useAuthError';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { dismissAuthError, signOut } from '@/firebase/auth';
import { Menu, UserRound, LogOut } from 'lucide-react';

export function Shell({ children, title, subtitle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const authError = useAuthError();
  const { user } = useAuth();
  const { profile, driverProfile } = useUserProfile(user);
  const navigate = useNavigate();

  const displayName = profile?.name ?? (user?.email ? user.email.split('@')[0] : 'Guest');
  const isDriver = !!driverProfile && driverProfile.active === true;

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
        <div className="topbar-title">
          {title && (
            <>
              <span>{title}</span>
              {subtitle && <small>{subtitle}</small>}
            </>
          )}
        </div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Passenger profile" onClick={() => setProfileOpen(true)}>
            <UserRound size={20} />
          </button>
          <button className="icon-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={21} />
          </button>
        </div>
      </header>
      <ErrorBanner type="auth" error={authError} onDismiss={dismissAuthError} />
      {children}
      <BottomNav />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {profileOpen && (
        <div className="modal-backdrop" onClick={() => setProfileOpen(false)}>
          <div className="profile-card" onClick={(e) => e.stopPropagation()}>
            <div className="profile-icon"><UserRound size={30} /></div>
            <h3>{displayName}</h3>
            <p>{user?.email ?? 'Guest'} {isDriver ? '· Driver' : '· Passenger'}</p>
            {user ? (
              <button className="secondary-button full" onClick={handleLogout}>
                <LogOut size={16} /> Sign out
              </button>
            ) : (
              <button className="primary-button full" onClick={() => { setProfileOpen(false); navigate('/passenger/login'); }}>
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
