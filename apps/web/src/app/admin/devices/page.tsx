'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface DeviceEnrollRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  installId: string;
  platform: string;
  model: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  createdAt: string;
}

interface UserDevice {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  deviceName: string;
  platform: string;
  model: string;
  isActive: boolean;
  isTrusted: boolean;
  lastSeenAt: string;
}

export default function DevicesPage() {
  const [enrollRequests, setEnrollRequests] = useState<DeviceEnrollRequest[]>([]);
  const [userDevices, setUserDevices] = useState<UserDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'devices'>('requests');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching live data from API...');
      
      // Fetch device enrollment requests
      const requestsResponse = await fetch('http://localhost:3001/admin/devices/requests');
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setEnrollRequests(requestsData.requests || []);
        console.log('Device requests loaded:', requestsData.requests?.length || 0);
      } else {
        console.error('Failed to fetch device requests:', requestsResponse.status);
        setEnrollRequests([]);
      }

      // Fetch user devices
      const devicesResponse = await fetch('http://localhost:3001/admin/devices');
      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json();
        setUserDevices(devicesData.devices || []);
        console.log('User devices loaded:', devicesData.devices?.length || 0);
      } else {
        console.error('Failed to fetch user devices:', devicesResponse.status);
        setUserDevices([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setEnrollRequests([]);
      setUserDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      DENIED: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      PENDING: 'Onay Bekliyor',
      APPROVED: 'Onaylandı',
      DENIED: 'Reddedildi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      iOS: '📱',
      Android: '🤖',
      macOS: '💻',
      Windows: '🪟',
      Linux: '🐧'
    };
    return icons[platform as keyof typeof icons] || '📱';
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/devices/requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Device request approved successfully');
        alert('Cihaz isteği onaylandı!');
        // Refresh data to get updated lists
        await fetchData();
      } else {
        console.error('Failed to approve device request');
        alert('Cihaz isteği onaylanamadı!');
      }
    } catch (error) {
      console.error('Error approving device request:', error);
      alert('Cihaz isteği onaylanırken hata oluştu!');
    }
  };

  const handleDenyRequest = async (requestId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/devices/requests/${requestId}/deny`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Device request denied successfully');
        alert('Cihaz isteği reddedildi!');
        // Refresh data to get updated lists
        await fetchData();
      } else {
        console.error('Failed to deny device request');
        alert('Cihaz isteği reddedilemedi!');
      }
    } catch (error) {
      console.error('Error denying device request:', error);
      alert('Cihaz isteği reddedilirken hata oluştu!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cihaz Yönetimi</h1>
        <p className="text-gray-600 mt-2">Kullanıcı cihazlarını ve kayıt isteklerini yönetin</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Kayıt İstekleri
              {enrollRequests.filter(r => r.status === 'PENDING').length > 0 && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                  {enrollRequests.filter(r => r.status === 'PENDING').length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'devices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="h-5 w-5" />
              Aktif Cihazlar
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'requests' ? (
        <div className="space-y-6">
          {/* Enroll Requests */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Cihaz Kayıt İstekleri</h2>
              <p className="text-sm text-gray-500 mt-1">
                Kullanıcıların yeni cihaz kayıt istekleri
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cihaz Bilgisi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.userName}
                          </div>
                          <div className="text-sm text-gray-500">{request.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getPlatformIcon(request.platform)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.platform}
                            </div>
                            <div className="text-sm text-gray-500">{request.model}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'PENDING' ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                              Onayla
                            </button>
                            <button
                              onClick={() => handleDenyRequest(request.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1 text-sm"
                            >
                              <XCircleIcon className="h-4 w-4" />
                              Reddet
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {enrollRequests.length === 0 && (
              <div className="text-center py-12">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">İstek bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Henüz cihaz kayıt isteği bulunmuyor.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Devices */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Aktif Cihazlar</h2>
              <p className="text-sm text-gray-500 mt-1">
                Kullanıcıların aktif cihazları
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cihaz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Görülme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {device.userName}
                          </div>
                          <div className="text-sm text-gray-500">{device.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getPlatformIcon(device.platform)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {device.deviceName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {device.platform} • {device.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            device.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {device.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          {device.isTrusted && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Güvenilir
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(device.lastSeenAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userDevices.length === 0 && (
              <div className="text-center py-12">
                <DevicePhoneMobileIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Cihaz bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Henüz aktif cihaz bulunmuyor.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DevicePhoneMobileIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Cihaz</p>
              <p className="text-2xl font-bold text-gray-900">{userDevices.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen İstek</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrollRequests.filter(r => r.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Cihaz</p>
              <p className="text-2xl font-bold text-gray-900">
                {userDevices.filter(d => d.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Güvenilir Cihaz</p>
              <p className="text-2xl font-bold text-gray-900">
                {userDevices.filter(d => d.isTrusted).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
