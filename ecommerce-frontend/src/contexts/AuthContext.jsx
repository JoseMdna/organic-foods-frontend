import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('currentUser');
        
        if (token && savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setLoading(false);
          return;
        } else if (!token) {
          setCurrentUser(null);
          localStorage.removeItem('currentUser');
          setLoading(false);
          return;
        }
        
        const response = await api.auth.getCurrentUser();
        if (response.data) {
          setCurrentUser(response.data);
          localStorage.setItem('currentUser', JSON.stringify(response.data));
        }
      } catch (error) {
        setCurrentUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
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
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Login failed'
        };
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors.join(', ');
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await api.auth.register({ username, password });
      if (response.data.success) {
        setCurrentUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Registration failed'
        };
      }
    } catch (error) {
      let errorMessage = 'Registration failed.';
      if (error.response?.data?.username) {
        errorMessage = `Username: ${error.response.data.username.join(', ')}`;
      } else if (error.response?.data?.password) {
        errorMessage = `Password: ${error.response.data.password.join(', ')}`;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors.join(', ');
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
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