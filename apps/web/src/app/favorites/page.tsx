"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formatDurationShort } from "@/utils/duration";


export default function FavoritesPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Client-side rendering kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock favorites data - later will come from API
  const favorites = [
    {
      id: 1,
      courseId: "react-web-dev",
      title: "React.js ile Modern Web Geliştirme",
      instructor: "Mehmet Özkan",
      price: 299.99,
      originalPrice: 399.99,
      currency: "TRY",
      rating: 4.8,
      reviewCount: 1247,
      duration: 25,
      level: "Orta",
      category: "Web Geliştirme",
      image: "/api/placeholder/120/80",
      isWishlisted: true,
      addedDate: "2024-01-15",
      description: "Modern React.js teknolojileri ile profesyonel web uygulamaları geliştirin. Hooks, Context API, ve modern state management konularını öğrenin."
    },
    {
      id: 2,
      courseId: "python-data-science",
      title: "Python ile Veri Bilimi",
      instructor: "Ayşe Demir",
      price: 199.99,
      originalPrice: 249.99,
      currency: "TRY",
      rating: 4.9,
      reviewCount: 892,
      duration: 18,
      level: "Başlangıç",
      category: "Veri Bilimi",
      image: "/api/placeholder/120/80",
      isWishlisted: true,
      addedDate: "2024-01-10",
      description: "Python kullanarak veri analizi, makine öğrenmesi ve veri görselleştirme konularında uzmanlaşın."
    },
    {
      id: 3,
      courseId: "ui-ux-design",
      title: "UI/UX Tasarım Temelleri",
      instructor: "Can Yıldız",
      price: 149.99,
      originalPrice: 199.99,
      currency: "TRY",
      rating: 4.7,
      reviewCount: 567,
      duration: 12,
      level: "Başlangıç",
      category: "Tasarım",
      image: "/api/placeholder/120/80",
      isWishlisted: true,
      addedDate: "2024-01-05",
      description: "Kullanıcı deneyimi ve arayüz tasarımının temellerini öğrenin. Figma, Adobe XD gibi araçları kullanmayı öğrenin."
    },
    {
      id: 4,
      courseId: "nodejs-backend",
      title: "Node.js Backend Geliştirme",
      instructor: "Zeynep Kaya",
      price: 399.99,
      originalPrice: 499.99,
      currency: "TRY",
      rating: 4.6,
      reviewCount: 423,
      duration: 30,
      level: "İleri",
      category: "Backend",
      image: "/api/placeholder/120/80",
      isWishlisted: true,
      addedDate: "2024-01-20",
      description: "Node.js ile güçlü backend API'leri geliştirin. Express.js, MongoDB, ve authentication konularını öğrenin."
    },
    {
      id: 5,
      courseId: "mobile-app-dev",
      title: "React Native ile Mobil Uygulama",
      instructor: "Ali Özkan",
      price: 349.99,
      originalPrice: 449.99,
      currency: "TRY",
      rating: 4.5,
      reviewCount: 298,
      duration: 22,
      level: "Orta",
      category: "Mobil Geliştirme",
      image: "/api/placeholder/120/80",
      isWishlisted: true,
      addedDate: "2024-01-25",
      description: "React Native kullanarak iOS ve Android için cross-platform mobil uygulamalar geliştirin."
    }
  ];

  const filters = [
    { id: "all", label: "Tümü", count: favorites.length },
    { id: "web", label: "Web Geliştirme", count: favorites.filter(f => f.category === "Web Geliştirme").length },
    { id: "data", label: "Veri Bilimi", count: favorites.filter(f => f.category === "Veri Bilimi").length },
    { id: "design", label: "Tasarım", count: favorites.filter(f => f.category === "Tasarım").length },
    { id: "backend", label: "Backend", count: favorites.filter(f => f.category === "Backend").length },
    { id: "mobile", label: "Mobil", count: favorites.filter(f => f.category === "Mobil Geliştirme").length }
  ];

  const filteredFavorites = favorites.filter(favorite => {
    const matchesFilter = activeFilter === "all" || 
      (activeFilter === "web" && favorite.category === "Web Geliştirme") ||
      (activeFilter === "data" && favorite.category === "Veri Bilimi") ||
      (activeFilter === "design" && favorite.category === "Tasarım") ||
      (activeFilter === "backend" && favorite.category === "Backend") ||
      (activeFilter === "mobile" && favorite.category === "Mobil Geliştirme");
    
    const matchesSearch = favorite.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

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

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const totalValue = favorites.reduce((sum, f) => sum + f.originalPrice, 0);
  const totalSavings = favorites.reduce((sum, f) => sum + (f.originalPrice - f.price), 0);

  // Client-side rendering kontrolü
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spirn rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                Favorilerim
              </h1>
              <p className="text-xl text-blue-100">
                Beğendiğiniz kursları takip edin ve fırsatları kaçırmayın
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/courses" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Yeni Kurs Keşfet
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
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Favori</p>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Değer</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue, "TRY")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Tasarruf</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalSavings, "TRY")}</p>
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
                    placeholder="Kurs, eğitmen veya kategori ara..."
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

          {/* Favorites Grid */}
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((favorite) => (
                <div key={favorite.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Course Image */}
                  <div className="relative">
                    <img src={favorite.image} alt={favorite.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 right-3">
                      <button className="w-10 h-10 bg-white/90 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200">
                        <svg className="h-5 w-5 text-red-500 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                    {favorite.originalPrice > favorite.price && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          %{calculateDiscount(favorite.originalPrice, favorite.price)} İndirim
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {favorite.category}
                      </span>
                      <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                        {favorite.level}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {favorite.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {favorite.description}
                    </p>

                    <p className="text-sm text-gray-500 mb-3">
                      Eğitmen: <span className="font-medium text-gray-700">{favorite.instructor}</span>
                    </p>

                    {/* Rating and Duration */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900 ml-1">{favorite.rating}</span>
                          <span className="text-sm text-gray-500">({favorite.reviewCount})</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDurationShort(favorite.duration)}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(favorite.price, favorite.currency)}
                        </span>
                        {favorite.originalPrice > favorite.price && (
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(favorite.originalPrice, favorite.currency)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/courses/${favorite.courseId}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                      >
                        Kursu İncele
                      </Link>
                      <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Sepete Ekle
                      </button>
                    </div>

                    {/* Added Date */}
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      Favorilere eklendi: {formatDate(favorite.addedDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Favori bulunamadı</h3>
              <p className="text-gray-600 mb-4">Seçilen filtreye uygun favori kurs yok.</p>
              <button
                onClick={() => setActiveFilter("all")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Tümünü Göster
              </button>
            </div>
          )}

          {/* Empty State for No Favorites */}
          {favorites.length === 0 && (
            <div className="text-center py-16">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz favori kursunuz yok</h3>
              <p className="text-gray-600 mb-4">Beğendiğiniz kursları favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
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
