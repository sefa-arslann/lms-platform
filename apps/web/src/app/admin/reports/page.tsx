"use client";

import { useState, useEffect } from 'react';
import SecureStorage from '@/utils/secureStorage';

interface UserActivity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  todayWatched: number; // seconds
  todayCompleted: number;
  thisWeekWatched: number; // seconds
  thisWeekCompleted: number;
  totalQuestions: number;
  totalNotes: number;
  lastActive: string;
  totalProgress: number;
}

interface DailyStats {
  date: string;
  totalWatched: number; // seconds
  totalCompleted: number;
  totalQuestions: number;
  totalNotes: number;
  activeUsers: number;
}

interface WeeklyStats {
  week: string;
  totalWatched: number; // seconds
  totalCompleted: number;
  totalQuestions: number;
  totalNotes: number;
  activeUsers: number;
  averageProgress: number;
}

export default function AdminReports() {
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [detailedQuestions, setDetailedQuestions] = useState<any[]>([]);
  const [detailedNotes, setDetailedNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'notes' | 'admin-qa'>('overview');

  useEffect(() => {
    fetchReports();
    fetchDetailedReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      const token = SecureStorage.getToken();
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      // Fetch user activities
      const activitiesResponse = await fetch(`http://localhost:3001/admin/reports/user-activities?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setUserActivities(activitiesData);
      } else {
        console.log('Failed to fetch activities');
        setUserActivities([]);
      }

      // Fetch daily stats
      const dailyResponse = await fetch(`http://localhost:3001/admin/reports/daily-stats?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        setDailyStats(dailyData);
      } else {
        console.log('Failed to fetch daily stats');
        setDailyStats([]);
      }

      // Fetch weekly stats
      const weeklyResponse = await fetch(`http://localhost:3001/admin/reports/weekly-stats?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (weeklyResponse.ok) {
        const weeklyData = await weeklyResponse.json();
        setWeeklyStats(weeklyData);
      } else {
        console.log('Failed to fetch weekly stats');
        setWeeklyStats([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setUserActivities([]);
      setDailyStats([]);
      setWeeklyStats([]);
      setDetailedQuestions([]);
      setDetailedNotes([]);
      setLoading(false);
    }
  };

  const fetchDetailedReports = async () => {
    try {
      const token = SecureStorage.getToken();
      if (!token) return;

      // Fetch detailed questions
      const questionsResponse = await fetch(`http://localhost:3001/admin/reports/detailed-questions?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setDetailedQuestions(questionsData);
      }

      // Fetch detailed notes
      const notesResponse = await fetch(`http://localhost:3001/admin/reports/detailed-notes?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (notesResponse.ok) {
        const notesData = await notesResponse.json();
        setDetailedNotes(notesData);
      }
    } catch (error) {
      console.error('Failed to fetch detailed reports:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = SecureStorage.getToken();
      if (!token) return;

      const response = await fetch(`http://localhost:3001/admin/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDetailedReports(); // Refresh notes
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}s ${minutes}dk ${remainingSeconds}sn`;
    } else if (minutes > 0) {
      return `${minutes}dk ${remainingSeconds}sn`;
    } else {
      return `${remainingSeconds}sn`;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Admin Raporları</h1>
          <p className="text-gray-600">Kullanıcı aktiviteleri, izleme istatistikleri ve platform performansı</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Rapor Dönemi:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Bugün</option>
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
              </select>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Genel Bakış
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'questions'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ❓ Detaylı Sorular
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'notes'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📝 Detaylı Notlar
              </button>
              <button
                onClick={() => setActiveTab('admin-qa')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'admin-qa'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ❓ Admin Soru-Cevap
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>📊 <strong>Bugün:</strong> Günlük kullanıcı aktiviteleri ve platform performansı</p>
            <p>📈 <strong>Bu Hafta:</strong> Haftalık özet ve trend analizi</p>
            <p>📅 <strong>Bu Ay:</strong> Aylık genel bakış ve uzun vadeli performans</p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcılar</p>
                <p className="text-2xl font-bold text-gray-900">{userActivities.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam İzlenen Süre</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(userActivities.reduce((sum, user) => sum + user.todayWatched, 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanan Dersler</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userActivities.reduce((sum, user) => sum + user.todayCompleted, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Sorular</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userActivities.reduce((sum, user) => sum + user.totalQuestions, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Activities Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">👥 Kullanıcı Aktiviteleri</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bugün İzlenen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bugün Tamamlanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bu Hafta İzlenen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam İlerleme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sorular
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notlar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Aktivite
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userActivities.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(user.todayWatched)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.todayCompleted} ders
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(user.thisWeekWatched)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(user.totalProgress)}`}
                            style={{ width: `${user.totalProgress}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getProgressColor(user.totalProgress)}`}>
                          {user.totalProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalNotes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastActive)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Stats Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Günlük Platform İstatistikleri</h3>
            <div className="space-y-4">
              {dailyStats.slice(-7).map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">
                    {new Date(stat.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>👁️ {formatDuration(stat.totalWatched)}</span>
                    <span>✅ {stat.totalCompleted}</span>
                    <span>❓ {stat.totalQuestions}</span>
                    <span>📝 {stat.totalNotes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Stats Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Haftalık Platform Performansı</h3>
            <div className="space-y-4">
              {weeklyStats.slice(-4).map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">
                    {stat.week}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>👁️ {formatDuration(stat.totalWatched)}</span>
                    <span>✅ {stat.totalCompleted}</span>
                    <span>📈 {stat.averageProgress.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">📥 Rapor İndirme</h3>
              <p className="text-sm text-gray-600">Raporları Excel veya PDF formatında indirin</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                📊 Excel İndir
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                📄 PDF İndir
              </button>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">❓ Detaylı Soru Raporu</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soru</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cevaplar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedQuestions.map((question, index) => (
                    <tr key={question.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{question.user?.firstName} {question.user?.lastName}</div>
                          <div className="text-gray-500">{question.user?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {question.lesson?.section?.course?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {question.lesson?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{question.title}</div>
                        <div className="text-gray-500 text-xs mt-1">{question.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(question.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {question.answers?.length || 0} cevap
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📝 Detaylı Not Raporu</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Not</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zaman</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedNotes.map((note, index) => (
                    <tr key={note.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{note.user?.firstName} {note.user?.lastName}</div>
                          <div className="text-gray-500">{note.user?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {note.lesson?.section?.course?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {note.lesson?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{note.content}</div>
                        {note.timestamp && (
                          <div className="text-gray-500 text-xs mt-1">
                            Video: {Math.floor(note.timestamp / 60)}:{(note.timestamp % 60).toString().padStart(2, '0')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {note.timestamp ? `${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60).toString().padStart(2, '0')}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>{formatDate(note.createdAt)}</span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50"
                            title="Notu Sil"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Q&A Tab */}
        {activeTab === 'admin-qa' && (
          <AdminQAPanel />
        )}
      </div>
    </div>
  );
}

// Admin Q&A Panel Component
function AdminQAPanel() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('all');

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  const fetchQuestions = async () => {
    try {
      const token = SecureStorage.getToken();
      if (!token) return;

      const response = await fetch(`http://localhost:3001/admin/questions?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    try {
      const token = SecureStorage.getToken();
      if (!token || !answerContent.trim()) return;

      const response = await fetch(`http://localhost:3001/admin/questions/${questionId}/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: answerContent })
      });

      if (response.ok) {
        setAnswerContent('');
        setSelectedQuestion(null);
        fetchQuestions(); // Refresh questions
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Bu soruyu ve tüm cevaplarını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = SecureStorage.getToken();
      if (!token) return;

      const response = await fetch(`http://localhost:3001/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchQuestions(); // Refresh questions
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!confirm('Bu cevabı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = SecureStorage.getToken();
      if (!token) return;

      const response = await fetch(`http://localhost:3001/admin/answers/${answerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchQuestions(); // Refresh questions
      }
    } catch (error) {
      console.error('Failed to delete answer:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter and Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">❓ Admin Soru-Cevap Paneli</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Tümü ({questions.length})
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'unanswered' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Cevaplanmamış ({questions.filter(q => !q.answers?.length).length})
            </button>
            <button
              onClick={() => setFilter('answered')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'answered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Cevaplanmış ({questions.filter(q => q.answers?.length > 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {question.user?.firstName} {question.user?.lastName}
                    </span>
                    <span className="text-xs text-gray-500">({question.user?.email})</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {question.lesson?.section?.course?.title}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {question.lesson?.title}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{question.title}</h4>
                  <p className="text-gray-700 text-sm mb-3">{question.content}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-500">
                      {new Date(question.createdAt).toLocaleDateString('tr-TR')} • {question.answers?.length || 0} cevap
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                      title="Soruyu Sil"
                    >
                      🗑️ Sil
                    </button>
                  </div>

                  {/* Existing Answers */}
                  {question.answers && question.answers.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <h5 className="font-medium text-gray-900 mb-2">Cevaplar:</h5>
                      {question.answers.map((answer: any, index: number) => (
                        <div key={answer.id || index} className="mb-2 p-2 bg-white rounded border-l-4 border-blue-500">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {answer.user?.firstName} {answer.user?.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {answer.user?.role === 'ADMIN' ? '(Admin)' : '(Öğrenci)'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteAnswer(answer.id)}
                              className="text-red-500 hover:text-red-700 text-xs px-1 py-0.5 rounded hover:bg-red-50"
                              title="Cevabı Sil"
                            >
                              🗑️
                            </button>
                          </div>
                          <p className="text-sm text-gray-700">{answer.content}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(answer.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Answer Form */}
                  {!question.answers?.length && (
                    <div className="border-t pt-3">
                      <textarea
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        placeholder="Cevabınızı yazın..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleAnswerSubmit(question.id)}
                          disabled={!answerContent.trim()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cevabı Gönder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
