'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  CurrencyDollarIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  metadata?: {
    courseTitle?: string;
    instructor?: string;
    category?: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Siparişler yüklenemedi');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError('Siparişler yüklenirken hata oluştu');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Durum güncellenemedi');
      }

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
    } catch (error) {
      setError('Durum güncellenirken hata oluştu');
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || order.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'FAILED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'CANCELLED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD':
        return <CreditCardIcon className="w-5 h-5 text-blue-600" />;
      case 'BANK_TRANSFER':
        return <BanknotesIcon className="w-5 h-5 text-green-600" />;
      default:
        return <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Siparişler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
                <p className="text-gray-600">Tüm siparişleri görüntüleyin ve yönetin</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchOrders}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Yenile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Kurs, kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="PENDING">Bekliyor</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="FAILED">Başarısız</option>
                <option value="CANCELLED">İptal Edildi</option>
              </select>

              {/* Payment Method Filter */}
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Ödeme Yöntemleri</option>
                <option value="CREDIT_CARD">Kredi Kartı</option>
                <option value="BANK_TRANSFER">Havale/EFT</option>
              </select>

              {/* Results Count */}
              <div className="text-sm text-gray-600 flex items-center">
                {filteredOrders.length} sipariş bulundu
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ödeme Yöntemi
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.metadata?.courseTitle || order.courseTitle || 'Kurs Adı Bulunamadı'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {order.id.slice(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.userName || 'İsim Bulunamadı'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.userEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          <span className="ml-2 text-sm text-gray-900">
                            {order.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' : 'Havale/EFT'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status === 'COMPLETED' ? 'Tamamlandı' :
                             order.status === 'PENDING' ? 'Bekliyor' :
                             order.status === 'FAILED' ? 'Başarısız' :
                             order.status === 'CANCELLED' ? 'İptal Edildi' : order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PENDING">Bekliyor</option>
                          <option value="COMPLETED">Tamamlandı</option>
                          <option value="FAILED">Başarısız</option>
                          <option value="CANCELLED">İptal Edildi</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sipariş bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all' 
                    ? 'Filtreleri değiştirmeyi deneyin.' 
                    : 'Henüz hiç sipariş yok.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
