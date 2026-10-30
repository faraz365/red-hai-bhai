import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, CircleAlert } from 'lucide-react';
import { Logo } from '../components/Logo';
import { signInWithEmail, signUpWithEmail } from '@/firebase/auth';
import { createUserProfile } from '@/firebase/database';
import { isFirebaseConfigured } from '@/firebase';

export function PassengerSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) return setError('Please enter your full name.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setBusy(true);
    try {
      const user = await signUpWithEmail(email.trim(), password);
      await createUserProfile(user.uid, {
        name: fullName.trim(),
        email: email.trim(),
        role: 'passenger',
      });
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
          <h1>Create your account</h1>
          <p className="auth-subtitle">Sign up to track buses, check ETAs, and report lost items.</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="auth-warning"><CircleAlert size={16} /> Firebase is not configured. Set up your .env file to enable sign-up.</div>
        )}

        {error && <div className="auth-error"><CircleAlert size={16} /> {error}</div>}

        <form onSubmit={submit} className="auth-form">
          <label className="auth-field">
            <User size={17} />
            <input type="text" placeholder="Full name" value={fullName}
              onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
          </label>
          <label className="auth-field">
            <Mail size={17} />
            <input type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="auth-field">
            <Lock size={17} />
            <input type="password" placeholder="Password (min 6 characters)" value={password}
              onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
          </label>
          <label className="auth-field">
            <Lock size={17} />
            <input type="password" placeholder="Confirm password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
          </label>
          <button type="submit" className="primary-button full auth-submit" disabled={busy}>
            <UserPlus size={18} /> {busy ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/passenger/login">Sign in</Link></p>
        <p className="auth-switch"><Link to="/">Back to home</Link></p>
      </div>
    </div>
  );
}

function friendlyError(err) {
  const code = err?.code ?? '';
  if (code.includes('email-already-in-use')) return 'An account with this email already exists.';
  if (code.includes('weak-password')) return 'Password is too weak. Use at least 6 characters.';
  if (code.includes('invalid-email')) return 'That email address is not valid.';
  if (code.includes('network-request-failed')) return 'Network problem. Check your connection.';
  return err?.message ?? 'Could not create account.';
}
