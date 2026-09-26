import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ftrack_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore authenticated session on application mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('ftrack_token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(storedToken);
        if (response && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          // Token invalid
          localStorage.removeItem('ftrack_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('[AUTH SESSION RESTORE FAILED]', err.message);
        localStorage.removeItem('ftrack_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Warrior Login
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('ftrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Portal authentication failed');
      throw err;
    }
  };

  // Warrior Registration
  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem('ftrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Warrior registration failed');
      throw err;
    }
  };

  // Portal Logout
  const logout = () => {
    localStorage.removeItem('ftrack_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
