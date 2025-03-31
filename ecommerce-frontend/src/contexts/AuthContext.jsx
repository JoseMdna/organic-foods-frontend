import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.auth.getCurrentUser();
        setCurrentUser(response.data);
      } catch (error) {
        // Don't log 403 errors since they're expected when not logged in
        if (!error.response || error.response.status !== 403) {
          console.error("Error checking user status:", error);
        }
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    checkUserStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.auth.login({ username, password });
      if (response.data.success) {
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await api.auth.register({ username, password });
      if (response.data.success) {
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Registration failed'
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      setCurrentUser(null);
      return { success: true };
    }
  };
  
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    loading
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