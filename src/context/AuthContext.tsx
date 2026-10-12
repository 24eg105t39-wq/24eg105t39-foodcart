import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { getErrorMessage } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cravekart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cravekart_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('cravekart_token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('cravekart_user', JSON.stringify(res.data.data));
      }
    } catch {
      // Token might be invalid
      localStorage.removeItem('cravekart_token');
      localStorage.removeItem('cravekart_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data.data;
        localStorage.setItem('cravekart_token', newToken);
        localStorage.setItem('cravekart_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        closeAuthModal();
        return { success: true, message: 'Logged in successfully!' };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password, phone });
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data.data;
        localStorage.setItem('cravekart_token', newToken);
        localStorage.setItem('cravekart_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        closeAuthModal();
        return { success: true, message: 'Account created successfully!' };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const logout = () => {
    localStorage.removeItem('cravekart_token');
    localStorage.removeItem('cravekart_user');
    setUser(null);
    setToken(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        refreshUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
