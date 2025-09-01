'use client';

import { useState } from 'react';
import { BellIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src="/Logo-Dark.png" 
            alt="LMS Platform Logo" 
            className="w-48 h-auto"
            style={{ width: '200px' }}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@lms.com'}</p>
              </div>
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@lms.com'}</p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => router.push('/admin/settings')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                    Ayarlar
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
