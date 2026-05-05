import { createContext } from 'react';
import type { AppUser } from '../../types';

export interface RegisterValues {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  login(values: LoginValues): Promise<void>;
  register(values: RegisterValues): Promise<void>;
  logout(): Promise<void>;
  clearAuthError(): void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
