import { useEffect, useState } from 'react';
import { getUserProfile, getDriverProfile } from '@/firebase/database';

export function useUserProfile(user) {
  const [profile, setProfile] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setDriverProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([getUserProfile(user.uid), getDriverProfile(user.uid)])
      .then(([p, d]) => {
        if (cancelled) return;
        setProfile(p);
        setDriverProfile(d);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { profile, driverProfile, loading };
}
