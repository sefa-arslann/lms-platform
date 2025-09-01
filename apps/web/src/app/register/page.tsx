"use client";

import Link from "next/link";
import { useState } from "react";


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
    general?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ad gereklidir";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Ad en az 2 karakter olmalıdır";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Soyad gereklidir";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Soyad en az 2 karakter olmalıdır";
    }

    if (!formData.email) {
      newErrors.email = "Email adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir email adresi giriniz";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (formData.password.length < 8) {
      newErrors.password = "Şifre en az 8 karakter olmalıdır";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gereklidir";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Kullanım şartlarını kabul etmelisiniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to login or show success message
      console.log("Registration successful:", formData);
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      
    } catch (error) {
      setErrors({
        general: "Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Registering with ${provider}`);
    // Social registration logic will be implemented here
    alert(`${provider} ile kayıt olunuyor...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

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
            Ücretsiz Hesap Oluşturun
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Giriş yapın
            </Link>
          </p>
        </div>

        {/* Registration Form */}
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

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.firstName 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Adınız"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.lastName 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Soyadınız"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresi *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="ornek@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.password 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre Tekrarı *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.confirmPassword 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Şifre Gereksinimleri:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center">
                  <svg className={`h-4 w-4 mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  En az 8 karakter
                </li>
                <li className="flex items-center">
                  <svg className={`h-4 w-4 mr-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  En az bir küçük harf
                </li>
                <li className="flex items-center">
                  <svg className={`h-4 w-4 mr-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  En az bir büyük harf
                </li>
                <li className="flex items-center">
                  <svg className={`h-4 w-4 mr-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  En az bir rakam
                </li>
              </ul>
            </div>

            {/* Terms and Marketing */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Kullanım Şartları
                  </Link>{" "}
                  ve{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Gizlilik Politikası
                  </Link>{" "}
                  kabul ediyorum *
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.agreeToTerms}
                </p>
              )}

              <div className="flex items-start">
                <input
                  id="agreeToMarketing"
                  name="agreeToMarketing"
                  type="checkbox"
                  checked={formData.agreeToMarketing}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agreeToMarketing" className="ml-2 block text-sm text-gray-700">
                  Eğitim ve güncellemeler hakkında email almak istiyorum (isteğe bağlı)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Hesap oluşturuluyor...
                </div>
              ) : (
                "Ücretsiz Hesap Oluştur"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Veya</span>
              </div>
            </div>
          </div>

          {/* Social Registration Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleSocialRegister("Google")}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile devam et
            </button>

            <button
              onClick={() => handleSocialRegister("GitHub")}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub ile devam et
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Giriş yapın
            </Link>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Hesap oluşturarak{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Kullanım Şartları
            </Link>{" "}
            ve{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Gizlilik Politikası
            </Link>{" "}
            kabul etmiş olursunuz.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
