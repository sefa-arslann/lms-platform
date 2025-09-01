'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';
import SecureStorage from '@/utils/secureStorage';

// ContinueLearningButton Component
function ContinueLearningButton() {
  const { user } = useAuth();
  const [lastWatchedCourse, setLastWatchedCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLastWatchedCourse();
    }
  }, [user]);

  const fetchLastWatchedCourse = async () => {
    try {
      setIsLoading(true);
      const token = SecureStorage.getToken();
      if (!token) return;

      const response = await fetch("http://localhost:3001/lesson-progress/user/last-watched", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLastWatchedCourse(data);
      } else {
        setLastWatchedCourse(null);
      }
    } catch (error) {
      console.log("Error fetching last watched course:", error);
      setLastWatchedCourse(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Yükleniyor...</span>
      </div>
    );
  }

  if (lastWatchedCourse) {
    return (
      <Link
        href={`/courses/${lastWatchedCourse.slug}/learn?lesson=${lastWatchedCourse.lastLessonId}&section=${lastWatchedCourse.lastSectionId}&position=${lastWatchedCourse.lastPosition}`}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
        </svg>
        <span>Çalışmaya Devam Et</span>
      </Link>
    );
  }

  return (
    <Link
      href="/courses"
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
      </svg>
      <span>Çalışmaya Devam Et</span>
    </Link>
  );
}


export default function Header() {
  const pathname = usePathname();
  
  // Check if current page is admin page - early check before hooks
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Only call hooks if not on admin page
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { cartItems, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);

  // Check if current page is active
  const isActivePage = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Close cart popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isCartOpen && !target.closest('.cart-popup') && !target.closest('.cart-button')) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen]);

    // Fetch unread message count
  useEffect(() => {
    console.log('🔍 Header - useEffect triggered:', { isAuthenticated, userId: user?.id, currentCount: unreadMessageCount });
    if (isAuthenticated && user) {
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch('http://localhost:3001/messages/my-messages', {
            headers: {
              'Authorization': `Bearer ${SecureStorage.getToken()}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const messages = await response.json();
            console.log('🔍 Header - Fetched messages for count:', messages);
            
            // Count only unread admin replies
            const unreadCount = messages.reduce((total: number, msg: any) => {
              let count = 0;
              
              // Sadece okunmamış admin yanıtlarını say
              if (msg.replies && msg.replies.length > 0) {
                const unreadAdminReplies = msg.replies.filter((reply: any) => 
                  reply.isAdmin && !reply.isRead
                );
                
                count += unreadAdminReplies.length;
                console.log(`🔍 Message ${msg.id}: ${unreadAdminReplies.length} unread admin replies`);
              }
              
              return total + count;
            }, 0);
            
            console.log('🔍 Header - Total unread count:', unreadCount);
            console.log('🔍 Header - All messages:', messages);
            setUnreadMessageCount(unreadCount);
          } else {
            console.error('❌ Header - Failed to fetch messages:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching unread message count:', error);
        }
      };

      fetchUnreadCount();
      // Refresh every 30 seconds for real-time updates when admin replies (reduced from 3 seconds)
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  // Listen for message read events from other components
  useEffect(() => {
    const handleMessageRead = () => {
      // Mesaj okunduğunda badge'i hemen güncelle (timeout kaldırıldı)
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch('http://localhost:3001/messages/my-messages', {
            headers: {
              'Authorization': `Bearer ${SecureStorage.getToken()}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const messages = await response.json();
            const unreadCount = messages.reduce((total: number, msg: any) => {
              let count = 0;
              if (msg.replies && msg.replies.length > 0) {
                const unreadAdminReplies = msg.replies.filter((reply: any) => 
                  reply.isAdmin && !reply.isRead
                );
                count += unreadAdminReplies.length;
              }
              return total + count;
            }, 0);
            setUnreadMessageCount(unreadCount);
          }
        } catch (error) {
          console.error('Error updating badge after message read:', error);
        }
      };
      fetchUnreadCount();
    };

    window.addEventListener('messageRead', handleMessageRead);
    return () => window.removeEventListener('messageRead', handleMessageRead);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  // Show loading state
  if (isLoading) {
    return (
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/Logo-Dark.png" 
                alt="LMS Platform Logo" 
                className="w-48 h-auto"
                style={{ width: '200px' }}
              />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePage('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/courses" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePage('/courses') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Kurslar
            </Link>
            <Link 
              href="/about" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePage('/about') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Hakkımızda
            </Link>
            <Link 
              href="/contact" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePage('/contact') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              İletişim
            </Link>
            

          </nav>

          {/* Continue Learning Card - Only show when authenticated */}
          {isAuthenticated && !pathname.startsWith('/admin') && (
            <div className="hidden lg:block">
              <ContinueLearningButton />
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon - Only show on main pages */}
            {!pathname.startsWith('/admin') && (
              <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="cart-button relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Cart Popup */}
              {isCartOpen && (
                <div className="cart-popup absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Sepet ({cartItems.length})</h3>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {cartItems.length > 0 ? (
                    <>
                      <div className="max-h-64 overflow-y-auto px-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                              <p className="text-xs text-gray-500">{item.instructor}</p>
                              <p className="text-sm font-semibold text-blue-600">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5.007 7H5m4 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="px-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-900">Toplam:</span>
                          <span className="text-lg font-bold text-blue-600">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
                              cartItems.reduce((sum, item) => sum + item.price, 0)
                            )}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <Link
                            href="/cart"
                            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-blue-700 transition-colors"
                          >
                            Sepeti Görüntüle
                          </Link>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            Alışverişe Devam Et
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-gray-500 mb-3">Sepetiniz boş</p>
                      <Link
                        href="/courses"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Kursları Keşfet
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            )}

            {/* Messages Icon - Only show when authenticated */}
            {isAuthenticated && !pathname.startsWith('/admin') && (
              <div className="relative">
                <Link
                  href="/messages"
                  className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 group border border-transparent hover:border-blue-200"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {/* Message notification badge */}
                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                      {unreadMessageCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user?.firstName}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profilim
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    

                    
                    <Link
                      href="/notifications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bildirimler
                    </Link>
                    
                    <Link
                      href="/purchases"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Satın Almalarım
                    </Link>
                    
                    <Link
                      href="/favorites"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Favorilerim
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Giriş Yap
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
