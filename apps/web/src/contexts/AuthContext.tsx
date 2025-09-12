'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SecureStorage from '@/utils/secureStorage';
import { getDeviceInfo, DeviceInfo } from '@/utils/deviceDetection';

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

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = SecureStorage.getToken();
      
      if (storedToken) {
        try {
          // First try to decode token locally to get user info
          const tokenPayload = decodeJwtToken(storedToken);
          
          if (tokenPayload && tokenPayload.email && tokenPayload.role) {
            // Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (tokenPayload.exp && tokenPayload.exp < currentTime) {
              // Token expired, remove it
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
            
            setUser(userData);
            setToken(storedToken);
            setIsLoading(false);
            return;
          }
          
          // Fallback: Verify token with backend
          const response = await fetch('http://localhost:3001/auth/verify', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token invalid, remove it
            SecureStorage.removeToken();
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          SecureStorage.removeToken();
          setToken(null);
          setUser(null);
        }
      } else {
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
    } catch (error) {
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
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Get device info from frontend
      const deviceInfo = getDeviceInfo();
      
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          deviceInfo // Include device info
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Check if it's a device approval required response
        if (data.status === 'pending_approval') {
          return { 
            success: false, 
            requiresApproval: true,
            message: 'Cihaz onayı gerekiyor. Lütfen yöneticinizle iletişime geçin veya onay bekleyin.'
          };
        }
        
        // Normal login response with token
        const { accessToken: newToken, user: userData } = data;
        
        // Validate token and user data
        if (!newToken || typeof newToken !== 'string') {
          return { 
            success: false, 
            message: 'Sunucudan geçersiz token alındı. Lütfen tekrar deneyin.'
          };
        }
        
        if (!userData || !userData.id) {
          return { 
            success: false, 
            message: 'Sunucudan geçersiz kullanıcı bilgisi alındı. Lütfen tekrar deneyin.'
          };
        }
        
        // Store token and user data securely
        
        // Store in secure storage first
        SecureStorage.setToken(newToken);
        
        // Then update state
        setToken(newToken);
        setUser(userData);
        
        
        // Return success with user role for proper redirection
        return { 
          success: true, 
          userRole: userData.role 
        };
      } else {
        
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
      return { 
        success: false, 
        message: 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
      };
    }
  };

  const logout = () => {
    SecureStorage.removeToken();
    setToken(null);
    setUser(null);
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
