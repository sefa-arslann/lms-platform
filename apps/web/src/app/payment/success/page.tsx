"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/profile');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Success Content */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl mx-auto px-4">
          {/* Success Icon */}
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ödeme Başarılı!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Tebrikler! Kurslarınız başarıyla satın alındı ve hesabınıza eklendi. 
            Artık öğrenmeye başlayabilirsiniz.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Detayları</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Sipariş No:</span>
                <span className="font-medium">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Ödeme Tarihi:</span>
                <span className="font-medium">{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Durum:</span>
                <span className="text-green-600 font-medium">Tamamlandı</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/profile"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Kurslarımı Görüntüle
            </Link>
            
            <div className="text-sm text-gray-500">
              {countdown} saniye sonra otomatik olarak yönlendirileceksiniz
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/courses"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Daha Fazla Kurs Keşfet
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-700 font-medium transition-colors"
              >
                Yardım Al
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
