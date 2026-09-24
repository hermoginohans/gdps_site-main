import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserSavedAccount } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  addSavedAccount: (account: Omit<UserSavedAccount, 'id'>) => void;
  removeSavedAccount: (id: string) => void;
  addLoyaltyPoints: (points: number) => void;
}

const configuredApiUrl = import.meta.env.VITE_API_URL || '';
const isLocalFrontend = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const apiUrl = new URL((!isLocalFrontend && configuredApiUrl.includes('localhost'))
  ? 'https://gdpssite-main-production.up.railway.app'
  : configuredApiUrl || (isLocalFrontend ? 'http://localhost:8000' : 'https://gdpssite-main-production.up.railway.app'));
if (import.meta.env.DEV &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
    ['localhost', '127.0.0.1'].includes(apiUrl.hostname)) {
  apiUrl.hostname = window.location.hostname;
}
const API_URL = apiUrl.toString().replace(/\/$/, '');
const LOADER_DURATION_MS = 1000;

const csrfToken = () => {
  const token = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  return token ? decodeURIComponent(token) : undefined;
};

export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const xsrfToken = csrfToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || payload?.errors?.email?.[0] || 'Authentication request failed.');
  }

  return response.status === 204 ? null : response.json();
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => setIsLoading(false), LOADER_DURATION_MS);

    apiRequest('/api/user')
      .then((data) => setUser(data.user ?? data))
      .catch(() => setUser(null));

    return () => window.clearTimeout(loaderTimer);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setUser(data.user ?? data);
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const data = await apiRequest('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation })
    });
    setUser(data.user ?? data);
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google/redirect`;
  };

  const logout = async () => {
    await apiRequest('/api/logout', { method: 'POST' });
    setUser(null);
  };

  const addSavedAccount = (account: Omit<UserSavedAccount, 'id'>) => {
    if (!user) return;
    const newAcc: UserSavedAccount = {
      ...account,
      id: `acc_${Date.now()}`
    };
    setUser({
      ...user,
      savedAccounts: [...user.savedAccounts, newAcc]
    });
  };

  const removeSavedAccount = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      savedAccounts: user.savedAccounts.filter((a) => a.id !== id)
    });
  };

  const addLoyaltyPoints = (points: number) => {
    if (!user) return;
    setUser({
      ...user,
      loyaltyPoints: user.loyaltyPoints + points
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        addSavedAccount,
        removeSavedAccount,
        addLoyaltyPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
