"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ordersApi } from "@/utils/api/orders";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Form states for credit card
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [taxRate, setTaxRate] = useState(0.20); // Default %20 KDV
  
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Fetch tax rate from API
  useEffect(() => {
    const fetchTaxRate = async () => {
      try {
        const response = await fetch('http://localhost:3001/admin/tax/settings');
        if (response.ok) {
          const data = await response.json();
          setTaxRate(data.taxRate || 0.20);
        }
      } catch (error) {
        console.log('Tax rate not available, using default');
      }
    };
    
    fetchTaxRate();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/payment');
      return;
    }
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, cartItems, router]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || cartItems.length === 0) {
      setError("Lütfen giriş yapın ve sepetinizde kurs bulunduğundan emin olun.");
      return;
    }

    // Validate credit card form
    if (paymentMethod === "credit-card") {
      if (!cardHolder.trim()) {
        setError("Lütfen kart üzerindeki ismi girin.");
        return;
      }
      if (!cardNumber || cardNumber.length !== 16) {
        setError("Lütfen geçerli bir kart numarası girin.");
        return;
      }
      if (!expiryMonth || !expiryYear) {
        setError("Lütfen son kullanma tarihini girin.");
        return;
      }
      if (!cvv || cvv.length !== 3) {
        setError("Lütfen geçerli bir CVV girin.");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      const orders = await Promise.all(
        cartItems.map(item => 
          ordersApi.createOrder({
            userId: user!.id,
            courseId: item.courseId,
            amount: item.price,
            paymentMethod: paymentMethod === "credit-card" ? "CREDIT_CARD" : "BANK_TRANSFER",
            metadata: {
              courseTitle: item.title,
              instructor: item.instructor,
              category: item.category
            }
          })
        )
      );

      console.log('Siparişler oluşturuldu:', orders);
      clearCart();
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/payment/success');
      }, 3000);
      
    } catch (error) {
      console.error('Ödeme hatası:', error);
      if (error instanceof Error) {
        setError(`Ödeme hatası: ${error.message}`);
      } else {
        setError("Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ödeme Başarılı!</h1>
          <p className="text-lg text-gray-600 mb-6">Siparişiniz başarıyla alındı. Kurslarınız hesabınıza eklendi.</p>
          <div className="animate-pulse text-sm text-gray-500">
            Başarı sayfasına yönlendiriliyorsunuz...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Page Title Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Güvenli Ödeme
          </h1>
          <p className="text-xl text-blue-100">
            Kurslarınızı satın almak için ödeme bilgilerinizi girin
          </p>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ödeme Bilgileri</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemi Seçin</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Credit Card */}
                      <label className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === "credit-card" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit-card"
                          checked={paymentMethod === "credit-card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            paymentMethod === "credit-card" ? "bg-blue-500" : "bg-gray-100"
                          }`}>
                            <svg className={`w-6 h-6 ${
                              paymentMethod === "credit-card" ? "text-white" : "text-gray-600"
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Kredi Kartı</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                            <div className="text-xs text-blue-600 mt-1">Anında işlem</div>
                          </div>
                        </div>
                        {paymentMethod === "credit-card" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </label>

                      {/* Bank Transfer */}
                      <label className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === "bank-transfer" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank-transfer"
                          checked={paymentMethod === "bank-transfer"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            paymentMethod === "bank-transfer" ? "bg-blue-500" : "bg-gray-100"
                          }`}>
                            <svg className={`w-6 h-6 ${
                              paymentMethod === "bank-transfer" ? "text-white" : "text-gray-600"
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Havale/EFT</div>
                            <div className="text-sm text-gray-500">Banka transferi</div>
                            <div className="text-xs text-orange-600 mt-1">1-2 iş günü</div>
                          </div>
                        </div>
                        {paymentMethod === "bank-transfer" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Ad Soyad"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ay
                          </label>
                          <input
                            type="text"
                            value={expiryMonth}
                            onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                            placeholder="MM"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yıl
                          </label>
                          <input
                            type="text"
                            value={expiryYear}
                            onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                            placeholder="YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === "bank-transfer" && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">Banka Bilgileri</h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-medium">Banka:</span>
                          <span>Garanti BBVA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">IBAN:</span>
                          <span>TR12 0006 2000 0000 0000 0000 00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Alıcı:</span>
                          <span>LMS Platform A.Ş.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Açıklama:</span>
                          <span>Sipariş No: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        İşleniyor...
                      </div>
                    ) : (
                      `${formatPrice(cartTotal * (1 + taxRate))} Öde`
                    )}
                  </button>
                </form>

                {/* Security Info */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>256-bit SSL ile güvenli ödeme</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-32">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h3>
                
                {/* Cart Items Summary */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium truncate">{item.title}</p>
                        <p className="text-gray-500 text-xs">{item.instructor}</p>
                      </div>
                      <span className="text-gray-900 font-medium ml-2">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="text-gray-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%{Math.round(taxRate * 100)})</span>
                                          <span className="text-gray-900">{formatPrice(cartTotal * taxRate)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span>{formatPrice(cartTotal * (1 + taxRate))}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Seçilen Ödeme Yöntemi</h4>
                  <p className="text-sm text-blue-700">
                    {paymentMethod === "credit-card" ? "Kredi Kartı" : "Havale/EFT"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
