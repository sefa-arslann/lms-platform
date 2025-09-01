'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  UsersIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  phone?: string;
  address?: string;
}

interface UserDevice {
  id: string;
  deviceName: string;
  platform: string;
  userAgent: string;
  lastUsedAt: string;
  isActive: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userDevices, setUserDevices] = useState<UserDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback to mock data if API fails
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@lms.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          isActive: true,
          createdAt: '2024-01-15',
          lastLoginAt: '2024-08-12'
        },
        {
          id: '2',
          email: 'instructor1@lms.com',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          role: 'INSTRUCTOR',
          isActive: true,
          createdAt: '2024-02-20',
          lastLoginAt: '2024-08-11'
        },
        {
          id: '3',
          email: 'student1@lms.com',
          firstName: 'Ayşe',
          lastName: 'Demir',
          role: 'STUDENT',
          isActive: true,
          createdAt: '2024-03-10',
          lastLoginAt: '2024-08-10'
        },
        {
          id: '4',
          email: 'instructor2@lms.com',
          firstName: 'Mehmet',
          lastName: 'Kaya',
          role: 'INSTRUCTOR',
          isActive: false,
          createdAt: '2024-04-05',
          lastLoginAt: '2024-07-25'
        }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: 'bg-red-100 text-red-800',
      INSTRUCTOR: 'bg-blue-100 text-blue-800',
      STUDENT: 'bg-green-100 text-green-800'
    };
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to change user role');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ));
    } catch (error) {
      console.error('Failed to change user role:', error);
      alert('Kullanıcı rolü değiştirilemedi!');
    }
  };

  const changeUserStatus = async (userId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to change user status');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: newStatus } : user
      ));
    } catch (error) {
      console.error('Failed to change user status:', error);
      alert('Kullanıcı durumu değiştirilemedi!');
    }
  };

  const openUserModal = async (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
    await fetchUserDevices(user.id);
  };

  const fetchUserDevices = async (userId: string) => {
    try {
      setLoadingDevices(true);
      const response = await fetch(`http://localhost:3001/admin/devices/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user devices');
      }
      const data = await response.json();
      setUserDevices(data.devices || []);
    } catch (error) {
      console.error('Failed to fetch user devices:', error);
      setUserDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserDevices([]);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      password: '',
      confirmPassword: ''
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: ''
    });
    setEditErrors({});
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEditForm = () => {
    const errors: {[key: string]: string} = {};

    if (!editFormData.firstName.trim()) {
      errors.firstName = 'Ad alanı zorunludur';
    }

    if (!editFormData.lastName.trim()) {
      errors.lastName = 'Soyad alanı zorunludur';
    }

    if (!editFormData.email.trim()) {
      errors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (editFormData.password && editFormData.password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async () => {
    if (!validateEditForm() || !selectedUser) return;

    try {
      setEditLoading(true);
      
      const updateData: any = {
        firstName: editFormData.firstName.trim(),
        lastName: editFormData.lastName.trim(),
        email: editFormData.email.trim(),
      };

      if (editFormData.phone.trim()) {
        updateData.phone = editFormData.phone.trim();
      }

      if (editFormData.address.trim()) {
        updateData.address = editFormData.address.trim();
      }

      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const response = await fetch(`http://localhost:3001/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...updateData }
          : user
      ));

      // Update selected user in detail modal if open
      if (selectedUser) {
        setSelectedUser(prev => prev ? { ...prev, ...updateData } : null);
      }

      alert('Kullanıcı başarıyla güncellendi!');
      closeEditModal();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Kullanıcı güncellenirken hata oluştu!');
    } finally {
      setEditLoading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Sistem kullanıcılarını yönetin ve izleyin</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <UserPlusIcon className="h-5 w-5" />
          Yeni Kullanıcı
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
          >
            <option value="all" className="text-gray-900 font-medium">Tüm Roller</option>
            <option value="ADMIN" className="text-gray-900 font-medium">Admin</option>
            <option value="INSTRUCTOR" className="text-gray-900 font-medium">Eğitmen</option>
            <option value="STUDENT" className="text-gray-900 font-medium">Öğrenci</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
          >
            <option value="all" className="text-gray-900 font-medium">Tüm Durumlar</option>
            <option value="active" className="text-gray-900 font-medium">Aktif</option>
            <option value="inactive" className="text-gray-900 font-medium">Pasif</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-2 font-medium transition-colors bg-white shadow-sm"
          >
            <FunnelIcon className="h-4 w-4" />
            Filtreleri Temizle
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role === 'ADMIN' ? 'Admin' : 
                       user.role === 'INSTRUCTOR' ? 'Eğitmen' : 'Öğrenci'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.isActive)}`}>
                      {user.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString('tr-TR')
                      : 'Hiç giriş yapmamış'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900" 
                        title="Görüntüle"
                        onClick={() => openUserModal(user)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      {/* Role Change Dropdown */}
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={(e) => changeUserRole(user.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors min-w-[80px]"
                        >
                          <option value="STUDENT" className="text-gray-900 font-medium">Öğrenci</option>
                          <option value="INSTRUCTOR" className="text-gray-900 font-medium">Eğitmen</option>
                          <option value="ADMIN" className="text-gray-900 font-medium">Admin</option>
                        </select>
                      </div>

                      {/* Status Toggle */}
                      <button
                        onClick={() => changeUserStatus(user.id, !user.isActive)}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                          user.isActive 
                            ? 'text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200 border border-red-200 hover:border-red-300' 
                            : 'text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 border border-green-200 hover:border-green-300'
                        }`}
                        title={user.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                      >
                        {user.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                      </button>

                      <button className="text-indigo-600 hover:text-indigo-900" title="Düzenle">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Kullanıcı bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun kullanıcı bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Eğitmen</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'INSTRUCTOR').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Öğrenci</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'STUDENT').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <p className="text-gray-600 mt-1">Kullanıcı Detayları</p>
              </div>
              <button
                onClick={closeUserModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Kişisel Bilgiler
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-posta</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rol</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(selectedUser.role)}`}>
                        {selectedUser.role === 'ADMIN' ? 'Admin' : 
                         selectedUser.role === 'INSTRUCTOR' ? 'Eğitmen' : 'Öğrenci'}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Durum</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedUser.isActive)}`}>
                        {selectedUser.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kayıt Tarihi</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    
                    {selectedUser.lastLoginAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Son Giriş</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedUser.lastLoginAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Device List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Kayıtlı Cihazlar
                  </h3>
                  
                  {loadingDevices ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : userDevices.length > 0 ? (
                    <div className="space-y-3">
                      {userDevices.map((device) => (
                        <div key={device.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {device.platform === 'iOS' || device.platform === 'Android' ? (
                                <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600" />
                              ) : (
                                <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{device.deviceName}</p>
                              <p className="text-xs text-gray-500">{device.platform}</p>
                              <p className="text-xs text-gray-400 truncate">{device.userAgent}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                device.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {device.isActive ? 'Aktif' : 'Pasif'}
                              </span>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(device.lastUsedAt).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DevicePhoneMobileIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Cihaz bulunamadı</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Bu kullanıcının henüz kayıtlı cihazı yok.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeUserModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
                <button 
                  onClick={() => openEditModal(selectedUser)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Kullanıcı Düzenle
                </h2>
                <p className="text-gray-700 mt-1 font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium ${
                      editErrors.firstName ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Kullanıcının adını girin"
                  />
                  {editErrors.firstName && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{editErrors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium ${
                      editErrors.lastName ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Kullanıcının soyadını girin"
                  />
                  {editErrors.lastName && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{editErrors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium ${
                      editErrors.email ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="ornek@email.com"
                  />
                  {editErrors.email && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{editErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                    placeholder="+90 555 123 45 67"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Adres
                  </label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) => handleEditFormChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400 resize-none"
                    placeholder="Kullanıcının adres bilgisini girin"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={editFormData.password}
                    onChange={(e) => handleEditFormChange('password', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium ${
                      editErrors.password ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Şifre değiştirmek istemiyorsanız boş bırakın (min. 6 karakter)"
                  />
                  {editErrors.password && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{editErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                {editFormData.password && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Şifre Tekrar *
                    </label>
                    <input
                      type="password"
                      value={editFormData.confirmPassword}
                      onChange={(e) => handleEditFormChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium ${
                        editErrors.confirmPassword ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Şifreyi tekrar girin"
                    />
                    {editErrors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{editErrors.confirmPassword}</p>
                    )}
                  </div>
                )}
              </form>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={editLoading}
                >
                  İptal
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Güncelleniyor...
                    </>
                  ) : (
                    'Güncelle'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
