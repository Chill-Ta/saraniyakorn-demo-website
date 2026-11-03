import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import { getAuthErrorMessage } from './errors';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: auth !== null,
    error: null,
  });

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(
      auth,
      (user) => setState({ user, loading: false, error: null }),
      (error) =>
        setState({
          user: null,
          loading: false,
          error: getAuthErrorMessage(error),
        }),
    );
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
