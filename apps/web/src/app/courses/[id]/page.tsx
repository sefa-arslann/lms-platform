"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { formatDurationShort, formatDurationMMSS } from "@/utils/duration";

interface CourseData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  instructor: {
    name: string;
    bio?: string;
    avatar?: string;
    rating?: number;
    students?: number;
    courses?: number;
    experience?: string;
  };
  price: number;
  originalPrice?: number;
  currency: string;
  rating?: number;
  totalReviews?: number;
  students?: number;
  duration: string;
  level: string;
  category: string;
  language: string;
  lastUpdated?: string;
  certificate?: boolean;
  lifetimeAccess?: boolean;
  mobileAccess?: boolean;
  assignments?: number;
  quizzes?: number;
  projects?: number;
  image?: string;
  videoPreview?: string;
  tags?: string[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  sections?: any[];
}

export default function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
  // Always call use() first, before any other hooks
  const resolvedParams = use(params);
  
  // All other hooks must be called in the same order every render
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const { addToCart } = useCart();

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        console.log('Fetching course data for slug:', resolvedParams.id);
        
        // Use slug endpoint since params.id contains the slug
        const response = await fetch(`http://localhost:3001/courses/slug/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Course data received:', data);
        
        // Transform API data to match our interface
        const transformedData: CourseData = {
          id: data.id,
          title: data.title,
          description: data.description,
          longDescription: data.description, // Use description as longDescription for now
          instructor: {
            name: data.instructor?.firstName + ' ' + data.instructor?.lastName || 'Unknown Instructor',
            bio: data.instructor?.bio || 'Experienced instructor',
            avatar: data.instructor?.avatar || '/api/placeholder/100/100',
            rating: 4.5, // Default rating
            students: data.students || 0,
            courses: 1, // Default
            experience: '5+ yıl' // Default
          },
          price: data.price || 0,
          originalPrice: data.originalPrice || data.price || 0,
          currency: data.currency || 'TRY',
          rating: 4.5, // Default rating
          totalReviews: 0, // Default
          students: data.students || 0,
          duration: `${data.duration || 0} saat`,
          level: data.level || 'Başlangıç',
          category: data.category || 'Web Geliştirme',
          language: data.language || 'Türkçe',
          lastUpdated: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('tr-TR') : '2024-01-15',
          certificate: true, // Default
          lifetimeAccess: true, // Default
          mobileAccess: true, // Default
          assignments: 10, // Default
          quizzes: 5, // Default
          projects: 2, // Default
          image: data.thumbnail || '/api/placeholder/800/400',
          videoPreview: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default
          tags: ['Web Development', 'Programming'], // Default
          requirements: [
            'Temel programlama bilgisi',
            'Modern web tarayıcısı',
            'Kod editörü (VS Code önerilir)'
          ],
          whatYouWillLearn: [
            'Modern web geliştirme tekniklerini öğreneceksiniz',
            'Gerçek projeler üzerinde çalışarak deneyim kazanacaksınız',
            'Kariyerinizde bir adım öne çıkabileceksiniz'
          ],
          sections: [] // Will be populated separately if needed
        };
        
        setCourseData(transformedData);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err instanceof Error ? err.message : 'Kurs bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchCourseData();
    }
  }, [resolvedParams.id]);

  // Helper functions
  const formatPrice = (price: number, currency: string = "TRY") => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!courseData?.originalPrice) return 0;
    return Math.round(((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kurs Bulunamadı</h2>
            <p className="text-gray-600 mb-6">{error || 'Kurs bilgileri yüklenemedi'}</p>
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kurslara Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Course Hero Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {courseData.category}
                </span>
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {courseData.level}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {courseData.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {courseData.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 fill-current mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="font-semibold">{courseData.rating}</span>
                  <span className="ml-1">({courseData.totalReviews} değerlendirme)</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span>{courseData.students} öğrenci kayıtlı</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{courseData.duration}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Eğitmen</p>
                  <p className="font-semibold text-gray-900">{courseData.instructor.name}</p>
                  <p className="text-sm text-gray-600">{courseData.instructor.experience} deneyim</p>
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-32">
                {/* Course Image */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl mb-6 flex items-center justify-center">
                  <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(courseData.price)}</span>
                    {courseData.originalPrice && (
                      <>
                        <span className="text-lg text-gray-500 line-through">{formatPrice(courseData.originalPrice)}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                          %{calculateDiscount()} İndirim
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Tek seferlik ödeme</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    addToCart({
                      id: courseData.id,
                      courseId: courseData.id,
                      title: courseData.title,
                      instructor: courseData.instructor.name,
                      price: courseData.price,
                      originalPrice: courseData.originalPrice || courseData.price,
                      currency: courseData.currency,
                      image: courseData.image || '/api/placeholder/800/400',
                      duration: parseInt(courseData.duration.replace(' saat', '')),
                      level: courseData.level,
                      category: courseData.category
                    });
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl text-lg font-semibold text-center transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl mb-4"
                >
                  Sepete Ekle
                </button>

                {/* Course Features */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {formatDurationShort(parseInt(courseData.duration) || 0)} video içerik
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {courseData.assignments} ödev
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {courseData.quizzes} quiz
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {courseData.projects} proje
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sertifika
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ömür boyu erişim
                  </div>
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center text-sm text-green-800">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    30 gün para iade garantisi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Genel Bakış" },
                { id: "curriculum", label: "Müfredat" },
                { id: "instructor", label: "Eğitmen" },
                { id: "reviews", label: "Değerlendirmeler" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* What You'll Learn */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Bu Kursta Neler Öğreneceksiniz</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseData.whatYouWillLearn?.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Gereksinimler</h3>
                  <div className="space-y-3">
                    {courseData.requirements?.map((req, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Description */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Kurs Açıklaması</h3>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <p className="whitespace-pre-line">{courseData.longDescription}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Kurs Müfredatı</h3>
                <div className="space-y-4">
                  {courseData.sections?.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-900">{section.title}</h4>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                        <svg
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            expandedSections.includes(section.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedSections.includes(section.id) && (
                        <div className="px-6 pb-4 border-t border-gray-200">
                          <div className="space-y-3 pt-4">
                            {section.lessons?.map((lesson: any) => (
                              <div key={lesson.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-gray-700">{lesson.title}</span>
                                  {/* Assuming lesson has an 'isFree' property */}
                                  {/* {lesson.isFree && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                      Ücretsiz
                                    </span>
                                  )} */}
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-500">
                                  <span>{formatDurationMMSS(lesson.duration || 0)}</span>
                                  <span className="capitalize">{lesson.type}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor Tab */}
            {activeTab === "instructor" && (
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{courseData.instructor.name}</h3>
                    <p className="text-gray-600 mb-4">{courseData.instructor.bio}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{courseData.instructor.rating}</div>
                        <div className="text-sm text-gray-600">Değerlendirme</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{courseData.instructor.students}</div>
                        <div className="text-sm text-gray-600">Öğrenci</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{courseData.instructor.courses}</div>
                        <div className="text-sm text-gray-600">Kurs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{courseData.instructor.experience}</div>
                        <div className="text-sm text-gray-600">Deneyim</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Öğrenci Değerlendirmeleri</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{courseData.rating}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(courseData.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          } fill-current`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">({courseData.totalReviews || 0} değerlendirme)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Assuming courseData.reviews is populated from the API */}
                  {/* {courseData.reviews?.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {review.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{review.user}</div>
                            <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('tr-TR')}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              } fill-current`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))} */}
                </div>
              </div>
            )}
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
