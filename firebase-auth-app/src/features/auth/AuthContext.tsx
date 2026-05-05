import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { Unsubscribe } from 'firebase/auth';
import { auth, authPersistenceReady } from '../../firebase/config';
import type { AppUser } from '../../types';
import { getAuthErrorMessage } from './authErrors';
import { AuthContext } from './authContextValue';
import type { AuthContextValue, LoginValues, RegisterValues } from './authContextValue';

function toAppUser(firebaseUser: NonNullable<typeof auth.currentUser>): AppUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName: firebaseUser.displayName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => undefined;

    authPersistenceReady
      .then(() => {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser ? toAppUser(firebaseUser) : null);
          setLoading(false);
        });
      })
      .catch((authError: unknown) => {
        setError(getAuthErrorMessage(authError));
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  async function login(values: LoginValues) {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      throw authError;
    } finally {
      setLoading(false);
    }
  }

  async function register(values: RegisterValues) {
    setLoading(true);
    setError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(credential.user, { displayName: values.displayName });
      setUser(toAppUser(credential.user));
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      throw authError;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      throw authError;
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearAuthError: () => setError(null),
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
