'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SecureStorage from '@/utils/secureStorage';
import { getDeviceInfo, DeviceInfo } from '@/utils/deviceDetection';
import { ApiClient } from '@/utils/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatar?: string;
}

interface LoginResult {
  success: boolean;
  requiresApproval?: boolean;
  message?: string;
  userRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = new ApiClient();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = SecureStorage.getToken();
      console.log('🔍 Checking stored token:', storedToken ? 'EXISTS' : 'NOT FOUND');
      
      if (storedToken) {
        try {
          // First try to decode token locally to get user info
          const tokenPayload = decodeJwtToken(storedToken);
          console.log('🔍 Token payload:', tokenPayload);
          
          if (tokenPayload && tokenPayload.email && tokenPayload.role) {
            // Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (tokenPayload.exp && tokenPayload.exp < currentTime) {
              // Token expired, remove it
              console.log('❌ Token expired, removing...');
              SecureStorage.removeToken();
              setToken(null);
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            // Set user from token payload
            const userData = {
              id: tokenPayload.sub,
              email: tokenPayload.email,
              firstName: tokenPayload.firstName || 'User',
              lastName: tokenPayload.lastName || 'Name',
              role: tokenPayload.role,
            };
            
            console.log('✅ Setting user from token:', userData);
            setUser(userData);
            setToken(storedToken);
            setIsLoading(false);
            return;
          }
          
          // Fallback: Verify token with backend
          console.log('🔄 Verifying token with backend...');
          const response = await apiClient.request('auth/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response) {
            console.log('✅ Backend verification successful:', response);
            setUser(response);
            setToken(storedToken);
          } else {
            // Token invalid, remove it
            console.log('❌ Backend verification failed, removing token');
            SecureStorage.removeToken();
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('❌ Token verification failed:', error);
          SecureStorage.removeToken();
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('❌ No stored token found');
        setToken(null);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      const tokenPayload = decodeJwtToken(token);
      if (tokenPayload && tokenPayload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = tokenPayload.exp - currentTime;
        
        // If token expires in less than 1 hour, refresh it
        if (timeUntilExpiry < 3600) {
          console.log('Token expires soon, refreshing...');
          refreshToken();
        }
      }
    };

    // Check every 30 minutes
    const interval = setInterval(checkTokenExpiration, 30 * 60 * 1000);
    
    // Initial check
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [token]);

  // Refresh token function
  const refreshToken = async () => {
    try {
      // For now, just log that we would refresh
      // In a real implementation, you would call the refresh endpoint
      console.log('Would refresh token here...');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  };

  // Helper function to decode JWT token
  const decodeJwtToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Get device info from frontend
      const deviceInfo = getDeviceInfo();
      console.log('🔍 Frontend device info:', deviceInfo);
      
      const response = await apiClient.request('auth/login', {
        method: 'POST',
        body: { 
          email, 
          password,
          deviceInfo // Include device info
        },
      });

      if (response) {
        // Check if it's a device approval required response
        if (response.status === 'pending_approval') {
          return { 
            success: false, 
            requiresApproval: true,
            message: 'Cihaz onayı gerekiyor. Lütfen yöneticinizle iletişime geçin veya onay bekleyin.'
          };
        }
        
        // Normal login response with token
        const { accessToken: newToken, user: userData } = response;
        
        // Validate token and user data
        if (!newToken || typeof newToken !== 'string') {
          console.error('Invalid token received from server:', newToken);
          return { 
            success: false, 
            message: 'Sunucudan geçersiz token alındı. Lütfen tekrar deneyin.'
          };
        }
        
        if (!userData || !userData.id) {
          console.error('Invalid user data received from server:', userData);
          return { 
            success: false, 
            message: 'Sunucudan geçersiz kullanıcı bilgisi alındı. Lütfen tekrar deneyin.'
          };
        }
        
        // Store token and user data securely
        console.log('=== AUTH CONTEXT DEBUG ===');
        console.log('Setting token:', newToken);
        console.log('Setting user:', userData);
        console.log('User role:', userData?.role);
        
        // Store in secure storage first
        SecureStorage.setToken(newToken);
        
        // Then update state
        setToken(newToken);
        setUser(userData);
        
        console.log('✅ State updated successfully, token:', newToken ? 'EXISTS' : 'NULL');
        console.log('✅ User state:', userData);
        
        // Return success with user role for proper redirection
        return { 
          success: true, 
          userRole: userData.role 
        };
      } else {
        console.error('Login failed:', data.message);
        
        // Check if it's a device approval required error
        if (data.status === 'pending_approval' || (data.message && data.message.includes('Device approval required'))) {
          return { 
            success: false, 
            requiresApproval: true,
            message: 'Cihaz onayı gerekiyor. Lütfen yöneticinizle iletişime geçin veya onay bekleyin.'
          };
        } else if (data.message && data.message.includes('Maximum device limit reached')) {
          return { 
            success: false, 
            requiresApproval: true,
            message: 'Maksimum cihaz limitine ulaştınız. Lütfen yöneticinizle iletişime geçin.'
          };
        }
        
        return { 
          success: false, 
          message: data.message || 'Email veya şifre hatalı. Lütfen tekrar deneyin.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out, clearing all data...');
    SecureStorage.removeToken();
    setToken(null);
    setUser(null);
    console.log('✅ Logout completed, states cleared');
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
