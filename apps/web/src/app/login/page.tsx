"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";


interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Combined useEffect for all redirects
  useEffect(() => {
    setIsClient(true);
    
    console.log('=== COMBINED USE EFFECT ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user?.role:', user?.role);
    
    if (user && user.role) {
      console.log('=== REDIRECT LOGIC ===');
      console.log('User state changed to:', user);
      console.log('User role:', user.role);
      
      // Role-based redirection
      if (user.role === 'ADMIN') {
        console.log('🚀 ADMIN DETECTED - Redirecting to /admin');
        console.log('Current URL before redirect:', window.location.pathname);
        router.push('/admin');
        console.log('Router.push(/admin) called');
      } else if (user.role === 'STUDENT' || user.role === 'INSTRUCTOR') {
        console.log('🚀 USER DETECTED - Redirecting to /profile');
        console.log('Current URL before redirect:', window.location.pathname);
        router.push('/profile');
        console.log('Router.push(/profile) called');
      } else {
        console.log('❓ UNKNOWN ROLE:', user.role);
      }
    } else if (isAuthenticated && user) {
      console.log('=== AUTHENTICATED BUT NO ROLE ===');
      console.log('User authenticated but no role found');
    }
  }, [isAuthenticated, user, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation with null/undefined check
    if (!formData?.email || typeof formData.email !== 'string' || !formData.email.trim()) {
      newErrors.email = "Email adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir email adresi giriniz";
    }

    // Password validation with null/undefined check
    if (!formData?.password || typeof formData.password !== 'string' || !formData.password.trim()) {
      newErrors.password = "Şifre gereklidir";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Additional safety check before login
      if (!formData?.email || !formData?.password) {
        setErrors({
          general: "Email ve şifre gereklidir"
        });
        return;
      }
      
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        console.log('=== LOGIN DEBUG START ===');
        console.log('Login result:', result);
        console.log('Current user state:', user);
        console.log('User role from context:', user?.role);
        console.log('✅ Login successful! User state will be updated by AuthContext');
        console.log('🔄 useEffect will handle redirection when user state changes');
      } else {
        if (result.requiresApproval) {
          setShowApprovalMessage(true);
          setErrors({});
        } else {
          setErrors({
            general: result.message || "Email veya şifre hatalı. Lütfen tekrar deneyin."
          });
        }
      }
      
    } catch (error) {
      setErrors({
        general: "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin."
      });
    } finally {
      setIsLoading(false);
    }
  };



  // Client-side rendering kontrolü
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Giriş sayfası yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">


      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/Logo-Dark.png" 
                  alt="LMS Platform Logo" 
                  className="w-48 h-auto"
                  style={{ width: '200px' }}
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Hesabınıza Giriş Yapın
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Veya{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                yeni hesap oluşturun
              </Link>
            </p>
          </div>

          {/* Device Approval Message */}
          {showApprovalMessage && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Cihaz Onayı Gerekiyor
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Giriş yapmak için cihazınızın onaylanması gerekiyor. Bu durum şu nedenlerle olabilir:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>İlk kez bu cihazdan giriş yapıyorsunuz</li>
                      <li>Maksimum cihaz limitine ulaştınız</li>
                      <li>Güvenlik nedeniyle cihaz onayı beklemede</li>
                    </ul>
                    <p className="mt-3">
                      <strong>Ne yapmalısınız?</strong>
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Yöneticinizle iletişime geçin</li>
                      <li>Cihaz onayınızı bekleyin</li>
                      <li>Birkaç dakika sonra tekrar deneyin</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowApprovalMessage(false)}
                      className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg transition-colors"
                    >
                      Anladım
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="ml-3 text-sm text-red-600">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Bakiye Aktarma Alanı */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center mb-3">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-700">Bakiye Aktarma</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Kart Numarası"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Tutar (₺)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                >
                  Bakiye Aktar
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Beni hatırla</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Şifremi unuttum
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Giriş yapılıyor...
                  </div>
                ) : (
                  "Giriş Yap"
                )}
              </button>


            </form>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Hemen kayıt olun
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/Logo-Dark.png" 
                  alt="LMS Platform Logo" 
                  className="h-8 w-auto"
                />
                <div>
                  <span className="text-xl font-bold text-white">
                    LMS Platform
                  </span>
                  <p className="text-sm text-gray-400">Online Eğitim</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4 max-w-md">
                Modern teknolojiler ile kaliteli eğitim içerikleri sunarak, öğrencilerin kariyer hedeflerine ulaşmasına yardımcı oluyoruz.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Hızlı Linkler</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Kurslar
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-6 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 LMS Platform. Tüm hakları saklıdır.
              </div>
              <div className="flex space-x-4 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Gizlilik
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Şartlar
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Çerezler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
