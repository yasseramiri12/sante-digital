import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsRole: (role: UserRole) => void;  // demo shortcut
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Persist session across hot-reloads in dev
    try {
      const saved = sessionStorage.getItem('sd_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) sessionStorage.setItem('sd_user', JSON.stringify(u));
    else sessionStorage.removeItem('sd_user');
  };

  const login = useCallback(async (email: string, _password: string) => {
    // Real implementation: POST /auth/login → receive JWT → store token
    await new Promise(r => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email);
    if (!found) throw new Error('Email ou mot de passe incorrect');
    persist(found);
  }, []);

  const loginAsRole = useCallback((role: UserRole) => {
    const found = MOCK_USERS.find(u => u.role === role);
    if (found) persist(found);
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginAsRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// Role-based navigation helper
export const ROLE_NAV: Record<UserRole, string[]> = {
  ADMIN:      ['dashboard', 'patients', 'medecins', 'consultations', 'ordonnances', 'laboratoire', 'pharmacie'],
  MEDECIN:    ['dashboard', 'patients', 'consultations', 'ordonnances', 'laboratoire'],
  PATIENT:    ['dashboard', 'consultations', 'ordonnances', 'laboratoire'],
  PHARMACIEN: ['dashboard', 'ordonnances', 'pharmacie'],
};

export const canAccess = (user: AuthUser | null, module: string): boolean => {
  if (!user) return false;
  return ROLE_NAV[user.role].includes(module);
};
