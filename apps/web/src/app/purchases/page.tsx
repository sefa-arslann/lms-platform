"use client";

import Link from "next/link";
import { useState, useEffect } from "react";


export default function PurchasesPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Client-side rendering kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock purchase data - later will come from API
  const purchases = [
    {
      id: 1,
      courseId: "react-web-dev",
      courseTitle: "React.js ile Modern Web Geliştirme",
      instructor: "Mehmet Özkan",
      purchaseDate: "2024-01-15",
      amount: 299.99,
      currency: "TRY",
      status: "completed",
      progress: 85,
      lastAccessed: "2 gün önce",
      image: "/api/placeholder/120/80",
      invoiceNumber: "INV-2024-001",
      paymentMethod: "Kredi Kartı",
      expiresAt: "2025-01-15"
    },
    {
      id: 2,
      courseId: "python-data-science",
      courseTitle: "Python ile Veri Bilimi",
      instructor: "Ayşe Demir",
      purchaseDate: "2024-01-10",
      amount: 199.99,
      currency: "TRY",
      status: "completed",
      progress: 60,
      lastAccessed: "1 hafta önce",
      image: "/api/placeholder/120/80",
      invoiceNumber: "INV-2024-002",
      paymentMethod: "Havale/EFT",
      expiresAt: "2025-01-10"
    },
    {
      id: 3,
      courseId: "ui-ux-design",
      courseTitle: "UI/UX Tasarım Temelleri",
      instructor: "Can Yıldız",
      purchaseDate: "2024-01-05",
      amount: 149.99,
      currency: "TRY",
      status: "completed",
      progress: 100,
      lastAccessed: "2 hafta önce",
      image: "/api/placeholder/120/80",
      invoiceNumber: "INV-2024-003",
      paymentMethod: "Kredi Kartı",
      expiresAt: "2025-01-05"
    },
    {
      id: 4,
      courseId: "nodejs-backend",
      courseTitle: "Node.js Backend Geliştirme",
      instructor: "Zeynep Kaya",
      purchaseDate: "2024-01-20",
      amount: 399.99,
      currency: "TRY",
      status: "pending",
      progress: 0,
      lastAccessed: "Henüz başlanmadı",
      image: "/api/placeholder/120/80",
      invoiceNumber: "INV-2024-004",
      paymentMethod: "Kredi Kartı",
      expiresAt: "2025-01-20"
    }
  ];

  const filters = [
    { id: "all", label: "Tümü", count: purchases.length },
    { id: "completed", label: "Tamamlanan", count: purchases.filter(p => p.status === "completed").length },
    { id: "pending", label: "Bekleyen", count: purchases.filter(p => p.status === "pending").length },
    { id: "expired", label: "Süresi Dolan", count: 0 }
  ];

  const filteredPurchases = purchases.filter(purchase => {
    const matchesFilter = activeFilter === "all" || purchase.status === activeFilter;
    const matchesSearch = purchase.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Tamamlandı";
      case "pending": return "Bekliyor";
      case "expired": return "Süresi Doldu";
      default: return "Bilinmiyor";
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalSpent = purchases
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const averageProgress = purchases
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.progress, 0) / purchases.filter(p => p.status === "completed").length;

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
                Satın Almalarım
              </h1>
              <p className="text-xl text-blue-100">
                Kurs satın alma geçmişinizi ve ilerlemenizi takip edin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/courses" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Yeni Kurs Al
              </Link>
              <Link href="/profile" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
                Profilime Git
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Harcama</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalSpent, "TRY")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Kurs</p>
                  <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ortalama İlerleme</p>
                  <p className="text-2xl font-bold text-gray-900">%{Math.round(averageProgress)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Kurs veya eğitmen ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
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
          </div>

          {/* Purchases List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {filteredPurchases.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <div key={purchase.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* Course Image */}
                      <div className="flex-shrink-0">
                        <img src={purchase.image} alt={purchase.courseTitle} className="w-24 h-16 rounded-lg object-cover" />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {purchase.courseTitle}
                            </h3>
                            <p className="text-gray-600 mb-2">Eğitmen: {purchase.instructor}</p>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">İlerleme</span>
                                <span className="text-sm font-medium text-gray-900">{purchase.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${purchase.progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Purchase Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Satın Alma:</span>
                                <p className="font-medium">{formatDate(purchase.purchaseDate)}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Fiyat:</span>
                                <p className="font-medium">{formatPrice(purchase.amount, purchase.currency)}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Son Erişim:</span>
                                <p className="font-medium">{purchase.lastAccessed}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Durum:</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                                  {getStatusLabel(purchase.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <Link
                          href={`/courses/${purchase.courseId}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                        >
                          {purchase.progress === 0 ? "Kursa Başla" : "Devam Et"}
                        </Link>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          Fatura İndir
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          Detaylar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Satın alma bulunamadı</h3>
                <p className="text-gray-600 mb-4">Seçilen filtreye uygun satın alma yok.</p>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Tümünü Göster
                </button>
              </div>
            )}
          </div>

          {/* Empty State for No Purchases */}
          {purchases.length === 0 && (
            <div className="text-center py-16">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kurs satın almadınız</h3>
              <p className="text-gray-600 mb-4">İlk kursunuzu seçerek öğrenmeye başlayın!</p>
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
