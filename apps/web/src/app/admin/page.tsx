'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  BookOpenIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  DevicePhoneMobileIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  PlayIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useWebSocket } from '../../hooks/useWebSocket';

interface DashboardStats {
  users: {
    total: number;
    students: number;
    instructors: number;
    admins: number;
  };
  courses: {
    total: number;
    pendingApproval: number;
  };
  revenue: {
    total: number;
    currency: string;
  };
  devices: {
    pendingRequests: number;
  };
  analytics: {
    activeUsers: number;
    totalVideoViews: number;
    totalCourseViews: number;
    averageSessionDuration: number;
    todayEvents: number;
    todayUniqueUsers: number;
  };
  recent: {
    users: Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: string;
    }>;
    courses: Array<{
      id: string;
      title: string;
      isPublished: boolean;
      createdAt: string;
    }>;
    activity: any[];
    courseViews: any[];
    videoActions: any[];
  };
  topCourses: any[];
  // Yeni raporlama alanları
  reports: {
    totalQuestions: number;
    totalNotes: number;
    unansweredQuestions: number;
    totalMessages: number;
    unreadMessages: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month'>('day');
  const [isClient, setIsClient] = useState(false);
  
  // WebSocket connection for real-time updates
  const { isConnected, lastMessage, error: wsError, reconnect } = useWebSocket('ws://localhost:3001/admin-dashboard');

  // Client-side rendering control
  useEffect(() => {
    setIsClient(true);
  }, []);



  // Real data for charts based on stats
  const userGrowthData = stats ? [
    { month: 'Oca', users: Math.floor(stats.users.total * 0.3), growth: 15 },
    { month: 'Şub', users: Math.floor(stats.users.total * 0.5), growth: 50 },
    { month: 'Mar', users: Math.floor(stats.users.total * 0.7), growth: 22 },
    { month: 'Nis', users: Math.floor(stats.users.total * 0.8), growth: 27 },
    { month: 'May', users: Math.floor(stats.users.total * 0.9), growth: 25 },
    { month: 'Haz', users: stats.users.total, growth: 20 },
  ] : [];

  const revenueData = [
    { day: 'Pzt', revenue: 1200, orders: 8 },
    { day: 'Sal', revenue: 1800, orders: 12 },
    { day: 'Çar', revenue: 1500, orders: 10 },
    { day: 'Per', revenue: 2200, orders: 15 },
    { day: 'Cum', revenue: 1900, orders: 13 },
    { day: 'Cmt', revenue: 2500, orders: 18 },
    { day: 'Paz', revenue: 2100, orders: 16 },
  ];

  const coursePopularityData = [
    { course: 'React', views: 450, students: 120 },
    { course: 'Node.js', views: 380, students: 95 },
    { course: 'Python', views: 320, students: 85 },
    { course: 'Vue.js', views: 280, students: 70 },
    { course: 'Angular', views: 250, students: 65 },
  ];

  const activityHoursData = [
    { hour: '00:00', users: 15 },
    { hour: '04:00', users: 8 },
    { hour: '08:00', users: 45 },
    { hour: '12:00', users: 120 },
    { hour: '16:00', users: 180 },
    { hour: '20:00', users: 95 },
    { hour: '23:00', users: 35 },
  ];

  // Mock dashboard data for fallback
  const mockDashboardData: DashboardStats = {
    users: {
      total: 0,
      students: 0,
      instructors: 0,
      admins: 0,
    },
    courses: {
      total: 0,
      pendingApproval: 0,
    },
    revenue: {
      total: 0,
      currency: 'TRY',
    },
    devices: {
      pendingRequests: 0,
    },
    analytics: {
      activeUsers: 0,
      totalVideoViews: 0,
      totalCourseViews: 0,
      averageSessionDuration: 0,
      todayEvents: 0,
      todayUniqueUsers: 0,
    },
    recent: {
      users: [],
      courses: [],
      activity: [],
      courseViews: [],
      videoActions: [],
    },
    topCourses: [],
    reports: {
      totalQuestions: 0,
      totalNotes: 0,
      unansweredQuestions: 0,
      totalMessages: 0,
      unreadMessages: 0,
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/admin/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API response not ok:', response.status, errorText);
          throw new Error(`Failed to fetch dashboard data: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        console.log('API data received:', data);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(`Dashboard verileri yüklenirken hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
        // Fallback to mock data if API fails
        console.log('API failed, using mock data');
        setStats(mockDashboardData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle real-time WebSocket updates
  useEffect(() => {
    if (lastMessage && stats) {
      console.log('WebSocket message received:', lastMessage);
      switch (lastMessage.type) {
        case 'dashboard-update':
          setStats(prevStats => ({
            ...prevStats!,
            ...lastMessage.data,
          }));
          break;
        case 'user-activity':
          // Update recent activity
          console.log('User activity update:', lastMessage.data);
          break;
        case 'course-view':
          // Update course views
          console.log('Course view update:', lastMessage.data);
          break;
        case 'video-analytics':
          // Update video analytics
          console.log('Video analytics update:', lastMessage.data);
          break;
        default:
          console.log('Unknown WebSocket message type:', lastMessage.type);
      }
    }
  }, [lastMessage, stats]);

  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Hata oluştu!</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Sistem genel bakışı ve gerçek zamanlı veriler</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Periyot:</span>
                  <select
                    value={activePeriod}
                    onChange={(e) => setActivePeriod(e.target.value as 'day' | 'week' | 'month')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <option value="day" className="text-gray-900 font-medium">Günlük</option>
                    <option value="week" className="text-gray-900 font-medium">Haftalık</option>
                    <option value="month" className="text-gray-900 font-medium">Aylık</option>
                  </select>
                </div>
                
                {/* WebSocket Connection Status */}
                <div className={`flex items-center space-x-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`}></div>
                  <span>{isConnected ? 'Gerçek Zamanlı' : 'Bağlantı Yok'}</span>
                  {!isConnected && (
                    <button
                      onClick={reconnect}
                      className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Yeniden Bağlan
                    </button>
                  )}
                </div>
                
                {wsError && (
                  <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    {wsError}
                  </div>
                )}
                
                {/* API Status */}
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  API: {stats ? 'Bağlı' : 'Bağlantı Yok'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Toplam Kullanıcı</p>
                <p className="text-xl font-bold text-gray-900">{stats.users.total.toLocaleString()}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs text-gray-500">Öğrenci: {stats.users.students}</span>
                  <span className="text-xs text-gray-500">Eğitmen: {stats.users.instructors}</span>
                  <span className="text-xs text-gray-500">Admin: {stats.users.admins}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <BookOpenIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Toplam Kurs</p>
                <p className="text-xl font-bold text-gray-900">{stats.courses.total}</p>
                <div className="mt-1">
                  {stats.courses.pendingApproval > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      {stats.courses.pendingApproval} onay bekliyor
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Tümü onaylandı
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Toplam Gelir</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.revenue.total.toLocaleString()} {stats.revenue.currency}
                </p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  <span>Bu ay</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <DevicePhoneMobileIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Cihaz İstekleri</p>
                <p className="text-xl font-bold text-gray-900">{stats.devices.pendingRequests}</p>
                <div className="mt-1">
                  {stats.devices.pendingRequests > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      {stats.devices.pendingRequests} onay bekliyor
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Tümü onaylandı
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <UserGroupIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Aktif Kullanıcı</p>
                <p className="text-xl font-bold text-gray-900">{stats.analytics.activeUsers}</p>
                <div className="mt-1">
                  {stats.analytics.activeUsers > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">
                      Şu anda online
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      Offline
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
                <PlayIcon className="h-5 w-5 text-pink-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Video İzlenme</p>
                <p className="text-xl font-bold text-gray-900">{stats.analytics.totalVideoViews.toLocaleString()}</p>
                <div className="mt-1">
                  <span className="text-xs text-gray-500">Toplam izlenme</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <EyeIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Kurs Görüntüleme</p>
                <p className="text-xl font-bold text-gray-900">{stats.analytics.totalCourseViews.toLocaleString()}</p>
                <div className="mt-1">
                  {stats.analytics.averageSessionDuration > 0 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                      Ort: {stats.analytics.averageSessionDuration}dk
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                <ChartBarIcon className="h-5 w-5 text-teal-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Bugünkü Olaylar</p>
                <p className="text-xl font-bold text-gray-900">{stats.analytics.todayEvents.toLocaleString()}</p>
                <div className="mt-1">
                  {stats.analytics.todayUniqueUsers > 0 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-teal-100 text-teal-600 rounded-full">
                      Benzersiz: {stats.analytics.todayUniqueUsers}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Raporlama Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Toplam Soru</p>
                <p className="text-xl font-bold text-gray-900">{stats.reports?.totalQuestions || 0}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                    Tüm zamanlar
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Toplam Not</p>
                <p className="text-xl font-bold text-gray-900">{stats.reports?.totalNotes || 0}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                    Tüm zamanlar
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Cevaplanmamış</p>
                <p className="text-xl font-bold text-gray-900">{stats.reports?.unansweredQuestions || 0}</p>
                <div className="mt-1">
                  {stats.reports?.unansweredQuestions > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      Dikkat gerekli
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Tümü cevaplandı
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Toplam Mesaj</p>
                <p className="text-xl font-bold text-gray-900">{stats.reports?.totalMessages || 0}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    Tüm zamanlar
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Okunmamış</p>
                <p className="text-xl font-bold text-gray-900">{stats.reports?.unreadMessages || 0}</p>
                <div className="mt-1">
                  {stats.reports?.unreadMessages > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
                      {stats.reports.unreadMessages} yeni
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Tümü okundu
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Büyümesi</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Gelir</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Course Popularity */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kurs Popülerliği</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePopularityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Aktiflik Saatleri</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Top Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
            <div className="space-y-4">
              {stats.recent.users.length > 0 ? (
                stats.recent.users.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UsersIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 capitalize">
                        {user.role.toLowerCase()}
                      </span>
                      <p className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <UsersIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p>Henüz kullanıcı bulunmuyor</p>
                </div>
              )}
              
              {stats.recent.courses.length > 0 ? (
                stats.recent.courses.slice(0, 2).map((course) => (
                  <div key={course.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpenIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <p className="text-xs text-gray-500">
                        {course.isPublished ? 'Yayında' : 'Taslak'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">
                        {new Date(course.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <BookOpenIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p>Henüz kurs bulunmuyor</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Popüler Kurslar</h3>
            <div className="space-y-4">
              {stats.topCourses.length > 0 ? (
                stats.topCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{course.views} görüntüleme</span>
                        <span>{course.students} öğrenci</span>
                        <span>{course.revenue} {stats.revenue.currency}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpenIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Henüz kurs bulunmuyor</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
