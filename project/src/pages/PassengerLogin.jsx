import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, CircleAlert } from 'lucide-react';
import { Logo } from '../components/Logo';
import { signInWithEmail } from '@/firebase/auth';
import { isFirebaseConfigured } from '@/firebase';

export function PassengerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmail(email.trim(), password);
      navigate('/passenger/dashboard');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Logo />
        <div className="auth-header">
          <p className="eyebrow">Passenger</p>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to track your bus and check live arrivals.</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="auth-warning"><CircleAlert size={16} /> Firebase is not configured. Set up your .env file to enable sign-in.</div>
        )}

        {error && <div className="auth-error"><CircleAlert size={16} /> {error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label className="auth-field">
            <Mail size={17} />
            <input type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="auth-field">
            <Lock size={17} />
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          <button type="submit" className="primary-button full auth-submit" disabled={busy}>
            <LogIn size={18} /> {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">New to RoutVia? <Link to="/passenger/signup">Create an account</Link></p>
        <p className="auth-switch"><Link to="/">Back to home</Link></p>
        <p className="auth-switch">Are you a driver? <Link to="/driver/login">Driver sign-in</Link></p>
      </div>
    </div>
  );
}

function friendlyError(err) {
  const code = err?.code ?? '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'Incorrect email or password.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Try again later.';
  if (code.includes('network-request-failed')) return 'Network problem. Check your connection.';
  return err?.message ?? 'Could not sign in.';
}
