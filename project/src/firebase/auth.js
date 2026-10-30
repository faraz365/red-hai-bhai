import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './config';

let authReadyPromise = null;
const errorListeners = new Set();

function setAuthError(error) {
  authError = error;
  errorListeners.forEach((listener) => listener());
}

let authError = null;

export function getAuthError() {
  return authError;
}

export function subscribeAuthError(listener) {
  errorListeners.add(listener);
  return () => {
    errorListeners.delete(listener);
  };
}

export function dismissAuthError() {
  setAuthError(null);
}

export function getAuthUid() {
  return auth?.currentUser?.uid ?? null;
}

export function getCurrentUser() {
  return auth?.currentUser ?? null;
}

/**
 * Resolves once Firebase reports the initial auth state (signed-in OR signed-out).
 * Unlike the old version, this does NOT sign anyone in anonymously — it simply
 * waits for Firebase to tell us whether a session already exists.
 */
export function waitForAuth() {
  if (!auth) return Promise.resolve(null);
  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (authError) setAuthError(null);
        unsub();
        resolve(user);
      });
    });
  }
  return authReadyPromise;
}

export async function signUpWithEmail(email, password) {
  if (!auth) throw new Error('Firebase Auth is not configured.');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithEmail(email, password) {
  if (!auth) throw new Error('Firebase Auth is not configured.');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOut() {
  if (!auth) return;
  await firebaseSignOut(auth);
}
