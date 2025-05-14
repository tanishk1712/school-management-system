import React, { createContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiLogout, apiCheckAuth } from '../services/authService';

export interface User {
  id: string;
  adminName: string;
  schoolName: string;
  schoolEmail: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (schoolName: string, password: string) => Promise<void>;
  register: (adminName: string, schoolName: string, schoolEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await apiCheckAuth();
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (schoolName: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await apiLogin(schoolName, password);
      setUser(userData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    adminName: string, 
    schoolName: string, 
    schoolEmail: string, 
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await apiRegister(adminName, schoolName, schoolEmail, password);
      setUser(userData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};