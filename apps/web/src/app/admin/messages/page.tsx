'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import SecureStorage from '@/utils/secureStorage';

interface Message {
  id: string;
  subject: string;
  content: string;
  messageType: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _aggr_count_replies: number;
}

interface MessageReply {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface MessageStats {
  total: number;
  unread: number;
  replied: number;
  closed: number;
}

export default function AdminMessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [stats, setStats] = useState<MessageStats>({ total: 0, unread: 0, replied: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    fetchMessages();
    fetchStats();
  }, [isAuthenticated, user, router]);

  const fetchMessages = async () => {
    try {
      console.log('🔍 Fetching messages from API...');
      const token = SecureStorage.getToken();
      console.log('🔑 Token being used:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      const response = await fetch('http://localhost:3001/messages/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('📡 API Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('📨 Messages data received:', data);
        setMessages(data);
      } else {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching stats from API...');
      const token = SecureStorage.getToken();
      console.log('🔑 Stats Token being used:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      const response = await fetch('http://localhost:3001/messages/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('📡 Stats API Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Stats data received:', data);
        setStats(data);
      } else {
        const errorData = await response.json();
        console.error('❌ Stats API Error:', errorData);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  const fetchReplies = async (messageId: string) => {
    try {
      const token = SecureStorage.getToken();
      const response = await fetch(`http://localhost:3001/messages/admin/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const selectMessage = async (message: Message) => {
    setSelectedMessage(message);
    await fetchReplies(message.id);
    
    // Mark as read if unread
    if (!message.isRead) {
      await markAsRead(message.id);
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isRead: true, status: 'READ' as const } : m
      ));
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const token = SecureStorage.getToken();
      await fetch(`http://localhost:3001/messages/admin/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'READ' })
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setSendingReply(true);
    try {
      const token = SecureStorage.getToken();
      const response = await fetch(`http://localhost:3001/messages/admin/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (response.ok) {
        setReplyContent('');
        await fetchReplies(selectedMessage.id);
        setMessages(prev => prev.map(m => 
          m.id === selectedMessage.id ? { ...m, status: 'REPLIED' as const } : m
        ));
        await fetchStats();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const updateStatus = async (messageId: string, status: 'READ' | 'REPLIED' | 'CLOSED') => {
    try {
      const token = SecureStorage.getToken();
      const response = await fetch(`http://localhost:3001/messages/admin/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, status } : m
        ));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, status } : null);
        }
        await fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.status === filter.toUpperCase();
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'QUESTION': return 'bg-blue-100 text-blue-800';
      case 'SUPPORT': return 'bg-green-100 text-green-800';
      case 'FEEDBACK': return 'bg-yellow-100 text-yellow-800';
      case 'GENERAL': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string, hasReplies?: boolean) => {
    // Eğer mesajda yanıt varsa ve status REPLIED değilse, yeşil göster
    if (hasReplies && status !== 'REPLIED' && status !== 'CLOSED') {
      return 'bg-green-100 text-green-800';
    }
    
    switch (status) {
      case 'UNREAD': return 'bg-red-100 text-red-800';
      case 'READ': return 'bg-blue-100 text-blue-800';
      case 'REPLIED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mesaj Yönetimi</h1>
          <p className="text-gray-600">Kullanıcılardan gelen mesajları yönetin ve yanıtlayın</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Mesaj</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Okunmamış</p>
                <p className="text-2xl font-semibold text-red-600">{stats.unread}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Yanıtlandı</p>
                <p className="text-2xl font-semibold text-green-600">{stats.replied}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-black">Kapatıldı</p>
                <p className="text-2xl font-semibold text-black">{stats.closed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              {/* Filters */}
              <div className="p-4 border-b">
                <div className="flex flex-col space-y-3">
                  <input
                    type="text"
                    placeholder="Mesaj veya kullanıcı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      Tümü
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        filter === 'unread' ? 'bg-red-600 text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      Okunmamış
                    </button>
                    <button
                      onClick={() => setFilter('replied')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        filter === 'replied' ? 'bg-green-600 text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      Yanıtlandı
                    </button>
                    <button
                      onClick={() => setFilter('closed')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        filter === 'closed' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      Kapatıldı
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-black">Yükleniyor...</div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-4 text-center text-black">Mesaj bulunamadı</div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => selectMessage(message)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                      } ${!message.isRead ? 'bg-yellow-50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`font-medium text-black ${!message.isRead ? 'font-semibold' : ''}`}>
                            {message.subject}
                          </h3>
                          <p className="text-sm text-black mt-1">
                            {message.user.firstName} {message.user.lastName}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getMessageTypeColor(message.messageType)}`}>
                            {message.messageType === 'QUESTION' && 'Soru'}
                            {message.messageType === 'SUPPORT' && 'Destek'}
                            {message.messageType === 'FEEDBACK' && 'Geri Bildirim'}
                            {message.messageType === 'GENERAL' && 'Genel'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(message.status, message._aggr_count_replies > 0)}`}>
                            {message.status === 'UNREAD' && 'Okunmamış'}
                            {message.status === 'READ' && 'Okundu'}
                            {message.status === 'REPLIED' && 'Yanıtlandı'}
                            {message.status === 'CLOSED' && 'Kapatıldı'}
                            {message._aggr_count_replies > 0 && message.status !== 'REPLIED' && message.status !== 'CLOSED' && 'Yanıtlandı'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-black line-clamp-2">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-black">
                        <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: tr })}</span>
                        {message._aggr_count_replies > 0 && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {message._aggr_count_replies} yanıt
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Detail & Chat */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow">
                {/* Message Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-black mb-2">{selectedMessage.subject}</h2>
                      <div className="flex items-center space-x-4 text-sm text-black">
                        <span>
                          <strong>Gönderen:</strong> {selectedMessage.user.firstName} {selectedMessage.user.lastName}
                        </span>
                        <span>
                          <strong>E-posta:</strong> {selectedMessage.user.email}
                        </span>
                        <span>
                          <strong>Tarih:</strong> {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => updateStatus(selectedMessage.id, e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="READ">Okundu</option>
                        <option value="REPLIED">Yanıtlandı</option>
                        <option value="CLOSED">Kapatıldı</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">{selectedMessage.content}</p>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-black mb-4">Sohbet</h3>
                  
                  {/* Replies */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`flex ${reply.isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            reply.isAdmin
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{reply.content}</p>
                          <div className={`text-xs mt-1 ${
                            reply.isAdmin ? 'text-blue-100' : 'text-black'
                          }`}>
                            {reply.user.firstName} {reply.user.lastName} • {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: tr })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="border-t pt-4">
                    <div className="flex space-x-3">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Yanıtınızı yazın..."
                        rows={3}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <button
                        onClick={sendReply}
                        disabled={sendingReply || !replyContent.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {sendingReply ? 'Gönderiliyor...' : 'Yanıtla'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-black mb-2">Mesaj Seçin</h3>
                <p className="text-black">Görüntülemek ve yanıtlamak için sol taraftan bir mesaj seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
