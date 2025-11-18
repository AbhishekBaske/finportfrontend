import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage if available
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('finport_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false); // Changed to false since we're not checking auth on init
  const isAuthenticated = !!user;

  // Get API URL from environment or fall back to production URL
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' 
        ? 'https://finportbackend.onrender.com'
        : 'https://finportbackend.onrender.com';
    }
    return 'https://finportbackend.onrender.com';
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/user/verify-auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    // Save user to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('finport_user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/api/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
    // Remove user from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finport_user');
    }
  };

  useEffect(() => {
    // Authentication state is now persisted in localStorage
    // No need to check auth on every page load until CORS is fixed
    setIsLoading(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};