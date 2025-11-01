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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const isTokenExpired = (token) => {
    try {
      if (!token) return true;
      
      // More robust token parsing
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('❌ Invalid token format');
        return true;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if we have expiration time
      if (!payload.exp) {
        console.log('❌ Token missing expiration time');
        return true;
      }
      
      const isExpired = payload.exp * 1000 < Date.now();
      
      console.log('Token expiration check:', {
        issued: payload.iat ? new Date(payload.iat * 1000) : 'No iat',
        expires: new Date(payload.exp * 1000),
        now: new Date(),
        isExpired
      });
      
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Set up axios interceptor once on mount
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Only check expiration for non-auth endpoints
          const isAuthEndpoint = config.url?.includes('/auth/');
          if (!isAuthEndpoint && isTokenExpired(token)) {
            console.log('❌ Token expired, logging out...');
            logout();
            return config; // Still send the request, let server handle 401
          }
          
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Added Authorization header to request:', config.url);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔐 Auth check - Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        console.log('❌ No token found');
        setLoading(false);
        return;
      }

      // Don't check expiration here - let the server decide
      console.log('🔄 Making auth/me request...');
      
      const { data } = await axios({
        method: API_CONFIG.auth.me.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.me.url}`,
      });

      console.log('✅ Auth check successful, user data:', data);
      setUser(data);

    } catch (error) {
      console.error('❌ Auth check failed:', error);
      if (error.response?.status === 401) {
        console.log('🔄 Server returned 401, logging out...');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    console.log('🔑 Login function called with:', { 
      userEmail: userData.email, 
      tokenLength: token?.length || 0,
    });
    
    // Store auth data
    localStorage.setItem('token', token);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Set user state
    setUser(userData);
    
    console.log('✅ Login completed successfully');
  };

  const logout = () => {
    console.log('🚪 Logout initiated');
    
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();
    
    // Reset user state
    setUser(null);
    
    console.log('✅ Logout completed');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};