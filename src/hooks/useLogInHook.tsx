// contexts/AuthContext.tsx
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { API_URL } from '@/utils/Rutes';

interface AuthContextType {
  isLoginModalOpen: boolean;
  user: User | null;
  isSessionActive: boolean;
  isLoading: boolean;
  openLoginModal: () => void;
  logout: () => void;
  setIsSessionActive: (active: boolean) => void;
  setUser: (user: User | null) => void;
  closeLoginModal: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const logout = () => {
    setUser(null);
    setIsSessionActive(false);
    try {
      localStorage.removeItem('token');
    } catch {
      // ignore
    }
  };

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await axios.get(`${API_URL}auth/me`, {
        headers: { Authorization: `Bearer ${tokenToVerify}` },
      });
      return { status: response.status, data: response.data };
    } catch (error: any) {
      try {
        const postRes = await axios.post(`${API_URL}auth/verifyToken`, { token: tokenToVerify });
        return { status: postRes.status, data: postRes.data };
      } catch {
        return { status: error.response?.status || 500, data: null };
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const { status, data } = await verifyToken(storedToken);

      if (status !== 200) {
        setIsLoading(false);
        return;
      }

      const userData = data.user ?? data.decoded;
      setUser(userData ?? null);
      setIsSessionActive(!!userData);
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        user,
        setUser,
        logout,
        isLoading,
        isSessionActive,
        setIsSessionActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
