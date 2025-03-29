import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.get('/auth/user/');
        setCurrentUser(response.data);
      } catch (error) {
        if (error.response && error.response.status !== 403) {
          console.error("Error checking authentication status:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
        
      const response = await api.post('/auth/login/', { username, password }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      setCurrentUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await api.post('/auth/register/', { username, password });
      setCurrentUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
        
      await api.post('/auth/logout/', {}, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
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