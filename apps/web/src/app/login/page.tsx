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

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    alert(`${provider} ile giriş yapılıyor...`);
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Veya</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
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
    </div>
  );
}
