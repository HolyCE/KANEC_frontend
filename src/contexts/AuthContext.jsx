// src/contexts/AuthContext.jsx - UPDATED
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG, API_BASE_URL } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('auth_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      console.log('🔐 Checking auth status with token...');
      
      const { data } = await axios({
        method: API_CONFIG.auth.me.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.me.url}`,
      });

      console.log('✅ Auth check successful, user data:', data);
      setUser(data);

    } catch (error) {
      console.error('❌ Auth check failed:', error);
      
      if (error.response?.status === 401) {
        console.log('🔄 Token invalid, clearing auth data');
        clearAuthData();
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
  };

  const login = (userData, accessToken = null) => {
    console.log('🔑 Login function called with token:', !!accessToken);
    
    setUser(userData);
    
    if (accessToken) {
      setToken(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('auth_token', accessToken);
    }
    
    console.log('✅ Login completed with Authorization header');
  };

  const logout = async () => {
    console.log('🚪 Logout initiated');
    
    try {
      await axios.post(`${API_BASE_URL}/api/v1/auth/logout`);
    } catch (error) {
      console.log('Logout API call failed:', error);
    } finally {
      clearAuthData();
      console.log('✅ Logout completed');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};