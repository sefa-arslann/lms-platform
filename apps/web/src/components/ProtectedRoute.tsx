'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Role check if required
      if (requiredRole && user?.role !== requiredRole) {
        if (user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, redirectTo, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Güvenlik kontrolü yapılıyor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // Role check failed, don't render children
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
}
