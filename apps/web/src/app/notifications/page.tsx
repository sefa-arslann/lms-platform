"use client";

import Link from "next/link";
import { useState, useEffect } from "react";


export default function NotificationsPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [markAllAsRead, setMarkAllAsRead] = useState(false);

  // Client-side rendering kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock notifications data - later will come from API
  const notifications = [
    {
      id: 1,
      type: "course",
      title: "Yeni kurs güncellemesi",
      message: "React.js ile Modern Web Geliştirme kursuna yeni ders eklendi: 'Advanced Hooks'",
      time: "2 saat önce",
      isRead: false,
      icon: "📚",
      action: "Kursa Git"
    },
    {
      id: 2,
      type: "system",
      title: "Hoş geldiniz!",
      message: "LMS Platform'a başarıyla kayıt oldunuz. İlk kursunuzu seçmeye başlayın!",
      time: "1 gün önce",
      isRead: true,
      icon: "🎉",
      action: "Kursları Keşfet"
    },
    {
      id: 3,
      type: "achievement",
      title: "Tebrikler! Sertifika kazandınız",
      message: "UI/UX Tasarım Temelleri kursunu başarıyla tamamladınız. Sertifikanızı indirin.",
      time: "3 gün önce",
      isRead: false,
      icon: "🏆",
      action: "Sertifikayı İndir"
    },
    {
      id: 4,
      type: "reminder",
      title: "Kurs hatırlatması",
      message: "Python ile Veri Bilimi kursunda kaldığınız yerden devam etmeyi unutmayın.",
      time: "1 hafta önce",
      isRead: true,
      icon: "⏰",
      action: "Devam Et"
    },
    {
      id: 5,
      type: "course",
      title: "Yeni kurs önerisi",
      message: "İlgi alanlarınıza göre 'Node.js Backend Geliştirme' kursunu öneriyoruz.",
      time: "1 hafta önce",
      isRead: true,
      icon: "💡",
      action: "Kursu İncele"
    }
  ];

  const filters = [
    { id: "all", label: "Tümü", count: notifications.length },
    { id: "course", label: "Kurs", count: notifications.filter(n => n.type === "course").length },
    { id: "system", label: "Sistem", count: notifications.filter(n => n.type === "system").length },
    { id: "achievement", label: "Başarı", count: notifications.filter(n => n.type === "achievement").length },
    { id: "reminder", label: "Hatırlatma", count: notifications.filter(n => n.type === "reminder").length }
  ];

  const filteredNotifications = activeFilter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course": return "bg-blue-100 text-blue-800";
      case "system": return "bg-gray-100 text-gray-800";
      case "achievement": return "bg-yellow-100 text-yellow-800";
      case "reminder": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "course": return "Kurs";
      case "system": return "Sistem";
      case "achievement": return "Başarı";
      case "reminder": return "Hatırlatma";
      default: return "Diğer";
    }
  };

  // Client-side rendering kontrolü
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">


      {/* Page Title Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Bildirimler
              </h1>
              <p className="text-xl text-blue-100">
                Önemli güncellemeleri ve hatırlatmaları takip edin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMarkAllAsRead(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Tümünü Okundu İşaretle
              </button>
              <Link href="/profile" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
                Profilime Git
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{notification.icon}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {notification.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                {getTypeLabel(notification.type)}
                              </span>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {notification.time}
                              </span>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                                {notification.action}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01M9 5h.01M9 2h.01M12 2h.01M15 2h.01M18 2h.01M21 2h.01M21 5h.01M21 8h.01M21 11h.01M21 14h.01M21 17h.01M21 20h.01M18 20h.01M15 20h.01M12 20h.01M9 20h.01M6 20h.01M3 20h.01M3 17h.01M3 14h.01M3 11h.01M3 8h.01M3 5h.01M3 2h.01" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim bulunamadı</h3>
                <p className="text-gray-600 mb-4">Seçilen filtreye uygun bildirim yok.</p>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Tüm Bildirimleri Göster
                </button>
              </div>
            )}
          </div>

          {/* Empty State for No Notifications */}
          {notifications.length === 0 && (
            <div className="text-center py-16">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01M9 5h.01M9 2h.01M12 2h.01M15 2h.01M18 2h.01M21 2h.01M21 5h.01M21 8h.01M21 11h.01M21 14h.01M21 17h.01M21 20h.01M18 20h.01M15 20h.01M12 20h.01M9 20h.01M6 20h.01M3 20h.01M3 17h.01M3 14h.01M3 11h.01M3 8h.01M3 5h.01M3 2h.01" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz bildirim yok</h3>
              <p className="text-gray-600 mb-4">Yeni kurslar ve güncellemeler hakkında bildirim alacaksınız.</p>
              <Link href="/courses" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Kursları Keşfet
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    LMS Platform
                  </span>
                  <p className="text-sm text-gray-400">Online Eğitim</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Modern teknolojiler ile kaliteli eğitim içerikleri sunarak, öğrencilerin kariyer hedeflerine ulaşmasına yardımcı oluyoruz.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Hızlı Linkler</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-gray-400 hover:text-white transition-colors">
                    Kurslar
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Destek</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                    Yardım Merkezi
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    Sık Sorulan Sorular
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Teknik Destek
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-gray-400 hover:text-white transition-colors">
                    Topluluk
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-gray-400 hover:text-white transition-colors">
                    Sistem Durumu
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 LMS Platform. Tüm hakları saklıdır.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Kullanım Şartları
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Çerez Politikası
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
