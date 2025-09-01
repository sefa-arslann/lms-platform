"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";


// Course interface
interface Course {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  studentCount?: number;
  instructor?: {
    firstName: string;
    lastName: string;
  };
  category?: string;
  level?: string;
  duration?: number;
  slug?: string;
}

// Category Section Component
function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setIsDetailOpen(false);
    } else {
      setSelectedCategory(categoryId);
      setIsDetailOpen(true);
      
      // Smooth scroll to category detail section
      setTimeout(() => {
        const detailSection = document.getElementById('category-detail');
        if (detailSection) {
          detailSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  };

  const categories = [
    {
      id: 'oabt',
      title: 'ÖABT',
      description: 'Öğretmen Atama ve Kariyer Bilgi Sistemi - Matematik Odaklı',
      icon: '🎓',
      color: 'from-purple-500 to-pink-500',
      courses: [
        {
          title: 'Matematik ÖABT Temel',
          description: 'Matematik öğretmenliği için temel konular ve problem çözme',
          duration: '120 saat',
          level: 'Orta-İleri',
          price: '899',
          originalPrice: '1299',
          instructor: 'Hakan Onbaşı',
          rating: 4.8,
          students: 1250
        },
        {
          title: 'Matematik ÖABT İleri',
          description: 'Matematik öğretmenliği için ileri seviye konular',
          duration: '150 saat',
          level: 'İleri',
          price: '999',
          originalPrice: '1499',
          instructor: 'Hakan Onbaşı',
          rating: 4.9,
          students: 980
        },
        {
          title: 'Matematik ÖABT Geometri',
          description: 'Geometri ve analitik geometri konuları',
          duration: '140 saat',
          level: 'Orta-İleri',
          price: '949',
          originalPrice: '1399',
          instructor: 'Hakan Onbaşı',
          rating: 4.7,
          students: 1100
        },
        {
          title: 'Matematik ÖABT Analiz',
          description: 'Limit, türev ve integral konuları',
          duration: '130 saat',
          level: 'Orta',
          price: '899',
          originalPrice: '1299',
          instructor: 'Hakan Onbaşı',
          rating: 4.6,
          students: 850
        }
      ],
      bgImage: 'https://images.unsplash.com/photo-1523240798137-5c6c79d78042?w=800&fit=crop&auto=format',
      gradient: 'from-purple-600 via-pink-500 to-purple-700',
      accent: 'via-purple-400',
      features: ['Video Dersler', 'Soru Bankası', 'Deneme Sınavları', 'Canlı Destek', 'Sertifika']
    },
    {
      id: 'ib',
      title: 'IB',
      description: 'International Baccalaureate Matematik Programı',
      icon: '🌍',
      color: 'from-blue-500 to-indigo-500',
      courses: [
        {
          title: 'IB Mathematics SL',
          description: 'Standard Level matematik programı - Temel konular',
          duration: '200 saat',
          level: 'İleri',
          price: '1299',
          originalPrice: '1799',
          instructor: 'Hakan Onbaşı',
          rating: 4.9,
          students: 650
        },
        {
          title: 'IB Mathematics HL',
          description: 'Higher Level matematik programı - İleri seviye',
          duration: '250 saat',
          level: 'Çok İleri',
          price: '1499',
          originalPrice: '1999',
          instructor: 'Hakan Onbaşı',
          rating: 4.8,
          students: 420
        },
        {
          title: 'IB Mathematics AI',
          description: 'Applications and Interpretation - Uygulamalı matematik',
          duration: '220 saat',
          level: 'İleri',
          price: '1399',
          originalPrice: '1899',
          instructor: 'Hakan Onbaşı',
          rating: 4.7,
          students: 380
        },
        {
          title: 'IB Mathematics AA',
          description: 'Analysis and Approaches - Analiz ve yaklaşımlar',
          duration: '240 saat',
          level: 'Çok İleri',
          price: '1499',
          originalPrice: '1999',
          instructor: 'Hakan Onbaşı',
          rating: 4.9,
          students: 520
        }
      ],
      bgImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&fit=crop&auto=format',
      gradient: 'from-blue-600 via-indigo-500 to-blue-700',
      accent: 'via-blue-400',
      features: ['Uluslararası Standart', 'Video Dersler', 'Practice Tests', 'Online Support', 'IB Diploma']
    },
    {
      id: 'ayt',
      title: 'AYT',
      description: 'Alan Yeterlilik Testi Matematik Hazırlığı',
      icon: '📚',
      color: 'from-green-500 to-teal-500',
      courses: [
        {
          title: 'AYT Matematik Temel',
          description: 'Temel matematik konuları ve problem çözme teknikleri',
          duration: '180 saat',
          level: 'İleri',
          price: '1099',
          originalPrice: '1599',
          instructor: 'Hakan Onbaşı',
          rating: 4.8,
          students: 2100
        },
        {
          title: 'AYT Geometri',
          description: 'Geometri ve analitik geometri konuları',
          duration: '120 saat',
          level: 'Orta-İleri',
          price: '799',
          originalPrice: '1199',
          instructor: 'Hakan Onbaşı',
          rating: 4.7,
          students: 1650
        },
        {
          title: 'AYT Analiz',
          description: 'Limit, türev ve integral konuları',
          duration: '150 saat',
          level: 'İleri',
          price: '899',
          originalPrice: '1399',
          instructor: 'Hakan Onbaşı',
          rating: 4.9,
          students: 1850
        },
        {
          title: 'AYT Problem Çözme',
          description: 'Matematik problem çözme teknikleri ve stratejileri',
          duration: '100 saat',
          level: 'Orta',
          price: '699',
          originalPrice: '999',
          instructor: 'Hakan Onbaşı',
          rating: 4.6,
          students: 1200
        }
      ],
      bgImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&fit=crop&auto=format',
      gradient: 'from-green-600 via-teal-500 to-green-700',
      accent: 'via-green-400',
      features: ['Video Dersler', 'Soru Bankası', 'Deneme Sınavları', 'Çözüm Videoları', 'Sertifika']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent animate-gradient-x">
              Kategorilere Göre Keşfedin
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            İhtiyacınıza uygun kursları bulun ve kariyerinizi bir üst seviyeye taşıyın
          </p>
          
          {/* Animated Underline */}
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 cursor-pointer block animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated Background Image with Parallax Effect */}
              <div className="absolute inset-0">
                <img
                  src={category.bgImage}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                {/* Animated Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>
              </div>
              
              {/* Floating Particles Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-white/60 rounded-full animate-bounce animation-delay-300"></div>
                <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce animation-delay-600"></div>
              </div>
              
              {/* Content with Enhanced Animations */}
              <div className="relative p-8 h-full flex flex-col justify-end">
                {/* Animated Icon Container */}
                <div className="mb-6">
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-2xl`}>
                    <span className="group-hover:animate-bounce">{category.icon}</span>
                    
                    {/* Glowing Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.accent} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700`}></div>
                    
                    {/* Animated Border */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow`}></div>
                  </div>
                  
                  {/* Enhanced Title with Typing Effect */}
                  <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-all duration-500 transform group-hover:scale-105">
                    {category.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                    {category.description}
                  </p>
                </div>
                
                {/* Animated Course List */}
                <div className="space-y-3 mb-8">
                  {category.courses.slice(0, 3).map((course, courseIndex) => (
                    <div 
                      key={courseIndex} 
                      className="flex items-center space-x-3 text-gray-300 text-sm transform translate-x-0 group-hover:translate-x-2 transition-all duration-500"
                      style={{ transitionDelay: `${courseIndex * 100}ms` }}
                    >
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                      <span className="group-hover:text-white transition-colors duration-300">{course.title}</span>
                    </div>
                  ))}
                  {category.courses.length > 3 && (
                    <div className="text-yellow-400 text-sm font-medium transform translate-x-0 group-hover:translate-x-2 transition-all duration-500 animation-delay-300">
                      +{category.courses.length - 3} daha fazla kurs
                    </div>
                  )}
                </div>
                
                {/* Enhanced Action Button with Morphing Effect */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0">
                  <div className={`w-full bg-gradient-to-r ${category.gradient} backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-500 flex items-center justify-center space-x-3 group-hover:scale-105`}>
                    <span>Kursları Gör</span>
                    <svg className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
                             {/* Animated Corner Accents */}
               <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-white/30 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform -translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>
               <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-white/30 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0"></div>
            </div>
          ))}
        </div>
        
        {/* Enhanced View All Categories Button */}
        <div className="text-center mt-16">
          <Link 
            href="/courses" 
            className="group inline-flex items-center space-x-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-10 py-5 rounded-3xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-3xl relative overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content */}
            <span className="relative z-10">Tüm Kategorileri Keşfet</span>
            <svg className="relative z-10 w-7 h-7 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 bg-white/20 rounded-3xl scale-0 group-hover:scale-100 transition-transform duration-700 origin-center"></div>
          </Link>
        </div>

        {/* Category Detail Section */}
        {isDetailOpen && selectedCategory && (
          <div id="category-detail" className="mt-20 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${categories.find(c => c.id === selectedCategory)?.gradient} p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-4xl font-bold mb-2">
                    {categories.find(c => c.id === selectedCategory)?.title}
                  </h3>
                  <p className="text-xl opacity-90">
                    {categories.find(c => c.id === selectedCategory)?.description}
                  </p>
                </div>
                <div className="text-6xl">
                  {categories.find(c => c.id === selectedCategory)?.icon}
                </div>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setTimeout(() => {
                        const detailSection = document.getElementById('category-detail');
                        if (detailSection) {
                          detailSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                          });
                        }
                      }, 100);
                    }}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category.icon} {category.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="p-8 bg-gradient-to-r from-gray-50 to-white">
              <h4 className="text-2xl font-bold text-gray-800 mb-6">Özellikler</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.find(c => c.id === selectedCategory)?.features.map((feature, index) => (
                  <div key={index} className="bg-white p-4 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="p-8">
              <h4 className="text-2xl font-bold text-gray-800 mb-6">Kurslar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.find(c => c.id === selectedCategory)?.courses.map((course, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h5>
                        <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{course.price}₺</div>
                        <div className="text-sm text-gray-500 line-through">{course.originalPrice}₺</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-gray-600">{course.level}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{course.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">{course.students} öğrenci</div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Eğitmen:</strong> {course.instructor}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                      Kursa Git
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Stats Section Component
function StatsSection() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch courses count
        const coursesResponse = await fetch('http://localhost:3001/courses/public');
        const coursesData = await coursesResponse.ok ? await coursesResponse.json() : [];
        
        // Fetch orders count (if endpoint exists)
        let ordersCount = 0;
        try {
          const ordersResponse = await fetch('http://localhost:3001/orders/stats', {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            ordersCount = ordersData.totalOrders || 0;
          } else if (ordersResponse.status === 401) {
            console.log('Orders stats requires authentication, using default value');
            ordersCount = 0;
          }
        } catch (error) {
          console.log('Orders stats not available:', error);
        }

        setStats({
          totalCourses: coursesData.length || 0,
          totalStudents: Math.floor(Math.random() * 1000) + 100, // Placeholder until we have user stats
          totalInstructors: Math.floor(Math.random() * 50) + 10, // Placeholder until we have instructor stats
          totalOrders: ordersCount
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to placeholder stats
        setStats({
          totalCourses: 0,
          totalStudents: Math.floor(Math.random() * 1000) + 100, // Fallback value
          totalInstructors: Math.floor(Math.random() * 50) + 10, // Fallback value
          totalOrders: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform İstatistikleri
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Binlerce öğrenci ve eğitmenin güvendiği platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform İstatistikleri
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Binlerce öğrenci ve eğitmenin güvendiği platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalCourses}+</div>
            <div className="text-gray-600 font-medium">Profesyonel Kurs</div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalStudents}+</div>
            <div className="text-gray-600 font-medium">Mutlu Öğrenci</div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalInstructors}+</div>
            <div className="text-gray-600 font-medium">Uzman Eğitmen</div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-orange-600 mb-2">{stats.totalOrders}+</div>
            <div className="text-gray-600 font-medium">Başarılı Sipariş</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Slider data - will be replaced with live data
const sliderData: Course[] = [];

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < sliderData.length) {
      setCurrentSlide(index);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  }, []);

  useEffect(() => {
    setIsClient(true);
    
    // Fetch live course data
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/courses/public');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.slice(0, 4)); // Take first 4 courses for slider
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(courses.length, 1));
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [courses.length]);

  // Client-side rendering kontrolü
  if (!isClient || loading) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Öne Çıkan Kurslar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En popüler ve güncel kurslarımızı keşfedin
            </p>
          </div>
          <div className="h-[500px] md:h-[600px] bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Yükleniyor...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No courses available
  if (courses.length === 0) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Henüz Kurs Yok
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Yakında harika kurslar eklenecek
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan Kurslar
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En popüler ve güncel kurslarımızı keşfedin
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Slides */}
          <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden">
            {courses.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <div className="relative h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                      {/* Text Content */}
                      <div className="text-white p-8 lg:p-12">
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium text-white">
                            {slide.category}
                          </span>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                          {slide.title}
                        </h3>
                        
                        <p className="text-xl md:text-2xl text-blue-100 mb-6">
                          {slide.shortDescription || slide.description?.substring(0, 100) + '...'}
                        </p>
                        
                        <p className="text-lg text-blue-50 mb-8 max-w-lg">
                          {slide.description}
                        </p>
                        
                        {/* Course Stats */}
                        <div className="flex items-center space-x-6 mb-8">
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span className="text-white font-medium">{slide.rating}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <span className="text-white font-medium">{slide.studentCount || 0} öğrenci</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-white font-medium">
                              {slide.instructor ? `${slide.instructor.firstName} ${slide.instructor.lastName}` : 'Bilinmeyen Eğitmen'}
                            </span>
                          </div>
                        </div>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Link
                            href={`/courses/${slide.slug || slide.id}`}
                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold text-center transition-colors"
                          >
                            Kursu İncele
                          </Link>
                          <div className="flex items-center justify-center sm:justify-start">
                            <span className="text-3xl font-bold text-white mr-2">
                              {slide.price ? `₺${slide.price}` : 'Ücretsiz'}
                            </span>
                            <span className="text-blue-100">ile başlayın</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Visual Content */}
                      <div className="hidden lg:flex items-center justify-center p-8">
                        <div className="relative">
                          <div className="w-80 h-80 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm border border-white border-opacity-20 flex items-center justify-center">
                            <svg className="h-32 w-32 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          
                          {/* Floating Elements */}
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          
                          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-green-400 rounded-full flex items-center justify-center">
                            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Önceki slide"
            type="button"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Sonraki slide"
            type="button"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white bg-opacity-75 hover:bg-opacity-75"
                }`}
                aria-label={`Slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Header */}

      {/* Category Section - En Üstte */}
      <CategorySection />

      {/* Slider Section */}
      <Slider />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Geleceğinizi
            <span className="text-blue-600"> Şekillendirin</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Binlerce profesyonel kurs ile yeni beceriler kazanın, kariyerinizi geliştirin ve hayallerinizi gerçekleştirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center">
              Kursları Keşfet
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Demo İzle
            </button>
          </div>
        </div>
      </section>



      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden LMS Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern eğitim teknolojileri ile desteklenen platformumuzda öğrenme deneyiminizi en üst seviyeye çıkarın.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100 transform hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Uzman Eğitmenler</h3>
              <p className="text-gray-600 leading-relaxed">
                Alanında uzman eğitmenlerden öğrenin. Her kurs, sektör profesyonelleri tarafından hazırlanır ve güncel teknolojileri içerir.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100 transform hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Esnek Öğrenme</h3>
              <p className="text-gray-600 leading-relaxed">
                Kendi hızınızda öğrenin. İstediğiniz zaman, istediğiniz yerden kurslara erişin ve öğrenme sürecinizi kontrol edin.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg border border-purple-100 transform hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Topluluk Desteği</h3>
              <p className="text-gray-600 leading-relaxed">
                Diğer öğrencilerle etkileşime geçin, sorularınızı sorun ve deneyimlerinizi paylaşın. Aktif bir öğrenme topluluğuna katılın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Kurslar
            </h2>
            <p className="text-xl text-gray-600">
              En çok tercih edilen kurslarımızı keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <svg className="h-4 w-4 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm text-gray-600 ml-1">4.8 (120 değerlendirme)</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">React.js ile Modern Web Geliştirme</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Sıfırdan ileri seviyeye React.js öğrenin ve modern web uygulamaları geliştirin.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">₺299</span>
                  <Link href="/courses/react-js" className="text-blue-600 hover:text-blue-700 font-medium">
                    Detayları Gör →
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <svg className="h-4 w-4 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm text-gray-600 ml-1">4.9 (95 değerlendirme)</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Python ile Veri Bilimi</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Python kullanarak veri analizi, makine öğrenmesi ve yapay zeka projeleri geliştirin.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">₺399</span>
                  <Link href="/courses/python-data-science" className="text-blue-600 hover:text-blue-700 font-medium">
                    Detayları Gör →
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <svg className="h-4 w-4 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm text-gray-600 ml-1">4.7 (78 değerlendirme)</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">UI/UX Tasarım Temelleri</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Kullanıcı deneyimi tasarımının temellerini öğrenin ve etkileyici arayüzler tasarlayın.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">₺249</span>
                  <Link href="/courses/ui-ux-design" className="text-blue-600 hover:text-blue-700 font-medium">
                    Detayları Gör →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/courses" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-flex items-center">
              Tüm Kursları Gör
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Öğrenmeye Başlamaya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Hemen ücretsiz hesap oluşturun ve ilk kursunuzu keşfetmeye başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold">
              Ücretsiz Kayıt Ol
            </Link>
            <Link href="/courses" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold">
              Kursları İncele
            </Link>
          </div>
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
              <div className="flex items-center space-x-3 text-gray-400 text-sm mb-4 md:mb-0">
                <img 
                  src="/Logo-Dark.png" 
                  alt="LMS Platform Logo" 
                  className="w-48 h-auto"
                  style={{ width: '200px' }}
                />
                <span>© 2024 LMS Platform. Tüm hakları saklıdır.</span>
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
