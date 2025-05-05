import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get('/user');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('auth_token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);

      // Redirect based on user role
      const userRole = response.data.user.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'coach') {
        navigate('/coach');
      } else if (userRole === 'client') {
        navigate('/client');
      } else {
        navigate('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
