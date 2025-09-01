"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
  PaperAirplaneIcon, 
  PlusIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  subject: string;
  content: string;
  messageType: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
  createdAt: string;
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }>;
  replies: Array<{
    id: string;
    content: string;
    isAdmin: boolean;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      role: string;
    };
  }>;
  _count: {
    replies: number;
  };
}

export default function MessagesPage() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // New message form
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [messageType, setMessageType] = useState<'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL'>('QUESTION');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyContent, setReplyContent] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch messages
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMessages();
      
      // Real-time güncelleme için her 10 saniyede bir kontrol et
      const interval = setInterval(() => {
        fetchMessages();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/messages/my-messages", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📨 Fetched messages:', data);
        setMessages(data);
      } else {
        console.error('❌ Failed to fetch messages:', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    try {
      setSending(true);
      
      // Handle file uploads (simplified - in real app you'd upload to cloud storage)
      const attachmentData = attachments.map(file => ({
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // This is temporary - should upload to cloud storage
        fileType: file.type,
        fileSize: file.size,
      }));

      const response = await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          content,
          messageType,
          attachments: attachmentData,
        }),
      });

      if (response.ok) {
        console.log('✅ Message sent successfully');
        
        // Reset form
        setSubject("");
        setContent("");
        setMessageType('QUESTION');
        setAttachments([]);
        setShowNewMessageForm(false);
        
        // Refresh messages
        fetchMessages();
      } else {
        console.error('❌ Failed to send message:', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/messages/my-messages/${messageId}/reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        setReplyContent("");
        fetchMessages();
        // Refresh selected message
        if (selectedMessage) {
          const updatedMessage = messages.find(m => m.id === messageId);
          if (updatedMessage) {
            setSelectedMessage(updatedMessage);
          }
        }
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UNREAD':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
      case 'READ':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'REPLIED':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-500" />;
      case 'CLOSED':
        return <XMarkIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'Okunmadı';
      case 'READ': return 'Okundu';
      case 'REPLIED': return 'Yanıtlandı';
      case 'CLOSED': return 'Kapatıldı';
      default: return 'Bilinmiyor';
    }
  };

  const getMessageTypeText = (type: string) => {
    switch (type) {
      case 'QUESTION': return 'Soru';
      case 'SUPPORT': return 'Destek';
      case 'FEEDBACK': return 'Geri Bildirim';
      case 'GENERAL': return 'Genel';
      default: return 'Bilinmiyor';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Mesajlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3 text-blue-600" />
                Mesajlarım
              </h1>
              <p className="text-gray-600 mt-2">Admin ile iletişim kurun, sorularınızı sorun</p>
            </div>
            <button
              onClick={() => setShowNewMessageForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Yeni Mesaj
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mesaj Geçmişi</h2>
              
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Henüz mesajınız yok</p>
                  <p className="text-sm">Admin ile iletişime geçmek için yeni mesaj gönderin</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={async () => {
                        setSelectedMessage(message);
                        
                        // Mesaj okundu olarak işaretle
                        if (!message.isRead) {
                          try {
                            await fetch(`http://localhost:3001/messages/my-messages/${message.id}/status`, {
                              method: 'PUT',
                              headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ status: 'READ' }),
                            });
                            
                            // Local state'i güncelle
                            setMessages(prev => prev.map(m => 
                              m.id === message.id ? { ...m, isRead: true } : m
                            ));
                            setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
                            
                            // Header badge'ini güncelle
                            window.dispatchEvent(new Event('messageRead'));
                          } catch (error) {
                            console.error('Error marking message as read:', error);
                          }
                        }

                        // Admin yanıtlarını okundu olarak işaretle
                        if (message.replies && message.replies.some((reply: any) => reply.isAdmin && !reply.isRead)) {
                          try {
                            await fetch(`http://localhost:3001/messages/my-messages/${message.id}/admin-replies/read`, {
                              method: 'PUT',
                              headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                            });
                            // Local state'i güncelle
                            setMessages(prev => prev.map(m =>
                              m.id === message.id ? {
                                ...m,
                                replies: m.replies?.map((reply: any) =>
                                  reply.isAdmin ? { ...reply, isRead: true } : reply
                                )
                              } : m
                            ));
                            setSelectedMessage(prev => prev ? {
                              ...prev,
                              replies: prev.replies?.map((reply: any) =>
                                reply.isAdmin ? { ...reply, isRead: true } : reply
                              )
                            } : null);
                            // Badge'i güncelle
                            window.dispatchEvent(new Event('messageRead'));
                          } catch (error) {
                            console.error('Error marking admin replies as read:', error);
                          }
                        }
                      }}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-50 border-blue-200 shadow-md'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                          {message.subject}
                        </h3>
                        {getStatusIcon(message.status)}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {getMessageTypeText(message.messageType)}
                        </span>
                        <span>{getStatusText(message.status)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(message.createdAt).toLocaleDateString('tr-TR')}</span>
                        {message._count.replies > 0 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {message._count.replies} yanıt
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {getMessageTypeText(selectedMessage.messageType)}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {new Date(selectedMessage.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center">
                        {getStatusIcon(selectedMessage.status)}
                        {getStatusText(selectedMessage.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Original Message */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">Siz</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{selectedMessage.content}</p>
                  
                  {/* Attachments */}
                  {selectedMessage.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Ekler:</h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center space-x-2">
                            <DocumentIcon className="w-4 h-4 text-gray-500" />
                            <a
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {attachment.fileName}
                            </a>
                            <span className="text-xs text-gray-500">
                              ({(attachment.fileSize / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Replies */}
                {selectedMessage.replies.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Yanıtlar</h3>
                    {selectedMessage.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-xl ${
                          reply.isAdmin
                            ? 'bg-blue-50 border-l-4 border-blue-500 ml-0 mr-auto max-w-[80%]'
                            : 'bg-gray-50 border-l-4 border-gray-400 ml-auto mr-0 max-w-[80%]'
                        }`}
                      >
                        <div className={`flex items-center mb-2 ${
                          reply.isAdmin ? 'justify-start' : 'justify-end'
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                            reply.isAdmin ? 'bg-blue-600' : 'bg-gray-600'
                          }`}>
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className={`text-right ${reply.isAdmin ? 'text-left' : 'text-right'}`}>
                            <p className="font-semibold text-gray-800">
                              {reply.user.firstName} {reply.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {reply.isAdmin ? 'Admin' : 'Siz'} • {new Date(reply.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <p className={`text-gray-700 ${reply.isAdmin ? 'text-left' : 'text-right'}`}>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Yanıt Ver</h3>
                  <div className="space-y-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleReply(selectedMessage.id)}
                        disabled={!replyContent.trim()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                      >
                        <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                        Yanıt Gönder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Mesaj seçin</p>
                  <p className="text-sm">Detayları görmek için sol taraftan bir mesaj seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Yeni Mesaj</h2>
                <button
                  onClick={() => setShowNewMessageForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleNewMessage} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Mesaj konusunu yazın..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj Türü
                  </label>
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value as any)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="QUESTION">Soru</option>
                    <option value="SUPPORT">Destek</option>
                    <option value="FEEDBACK">Geri Bildirim</option>
                    <option value="GENERAL">Genel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Mesajınızı detaylı olarak yazın..."
                    className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosya Ekle
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <PhotoIcon className="w-5 h-5 inline mr-2" />
                      Dosya Seç
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Resim, PDF, Word veya metin dosyaları ekleyebilirsiniz
                    </p>
                  </div>
                  
                  {/* Selected Files */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DocumentIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewMessageForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !subject.trim() || !content.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                        Mesaj Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
