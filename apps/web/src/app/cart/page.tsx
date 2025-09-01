"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import SecureStorage from "@/utils/secureStorage";

export default function CartPage() {
  const [activeStep, setActiveStep] = useState("cart");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [error, setError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0.10); // %10 default discount
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye'
  });
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();

  // Kullanıcı giriş yapmamışsa login'e yönlendir
  useEffect(() => {
    if (!isAuthenticated && activeStep === "payment") {
      router.push('/login?redirect=/cart');
    }
  }, [isAuthenticated, activeStep, router]);

  // User bilgileri değiştiğinde billingInfo'yu güncelle
  useEffect(() => {
    if (user) {
      setBillingInfo(prev => ({
        ...prev,
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const [taxRate, setTaxRate] = useState(0.20); // Default %20 KDV
  
  useEffect(() => {
    // Fetch tax rate from API if available
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const totalOriginal = cartItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalSavings = totalOriginal - subtotal;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const applyCoupon = () => {
    if (couponCode.trim()) {
      // Validate coupon code (in real app, this would call an API)
      const validCoupons = {
        'WELCOME10': 0.10,
        'STUDENT20': 0.20,
        'SPECIAL15': 0.15
      };
      
      const discount = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];
      
      if (discount) {
        setAppliedCoupon(couponCode);
        setCouponDiscount(discount);
        setCouponCode("");
        setError("");
      } else {
        setError("Geçersiz kupon kodu. Lütfen tekrar deneyin.");
      }
    } else {
      setError("Lütfen geçerli bir kupon kodu girin.");
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const handlePayment = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    if (!paymentMethod) {
      setError("Lütfen bir ödeme yöntemi seçin.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Sepetinizde ürün bulunmuyor.");
      return;
    }

    // Billing bilgilerini kontrol et
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone || !billingInfo.address) {
      setError("Lütfen tüm fatura bilgilerini doldurun.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Benzersiz sipariş numarası oluştur
      const newOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setOrderNumber(newOrderNumber);

      // Ödeme simülasyonu (gerçek uygulamada payment gateway kullanılır)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create orders for all cart items
      console.log('Cart items before order creation:', cartItems); // Debug log
      const orders = await Promise.all(
        cartItems.map(async (item) => {
          try {
            console.log('Processing cart item:', item); // Debug log
            const response = await fetch('http://localhost:3001/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SecureStorage.getToken()}`,
              },
              body: JSON.stringify({
                courseId: item.courseId,
                amount: item.price,
                paymentMethod: paymentMethod === "credit-card" ? "CREDIT_CARD" : "BANK_TRANSFER",
                orderNumber: newOrderNumber,
                billingInfo: {
                  fullName: billingInfo.fullName,
                  email: billingInfo.email,
                  phone: billingInfo.phone,
                  address: billingInfo.address,
                  city: billingInfo.city,
                  postalCode: billingInfo.postalCode,
                  country: billingInfo.country
                },
                metadata: {
                  courseTitle: item.title,
                  instructor: item.instructor,
                  category: item.category,
                  originalPrice: item.originalPrice,
                  discount: item.originalPrice - item.price
                }
              })
            });

            if (!response.ok) {
              const errorData = await response.text();
              console.error('Order creation failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
              });
              throw new Error(`Sipariş oluşturulamadı: ${response.status} ${response.statusText}`);
            }

            return await response.json();
          } catch (error) {
            console.error('Order creation error for course:', item.title, error);
            throw error;
          }
        })
      );

      console.log('Siparişler oluşturuldu:', orders);
      
      // Sepeti temizle
      clearCart();
      
      // Onay sayfasına geç
      setActiveStep("confirmation");
      
    } catch (error) {
      console.error('Ödeme hatası:', error);
      setError("Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: "cart", label: "Sepet", icon: "🛒" },
    { id: "payment", label: "Ödeme", icon: "💳" },
    { id: "confirmation", label: "Onay", icon: "✅" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Page Title Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sepet ve Ödeme
            </h1>
            <p className="text-xl text-blue-100">
              Kurslarınızı seçin ve güvenli ödeme yapın
            </p>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
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

      {/* Progress Steps */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium transition-all duration-200 ${
                  activeStep === step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step.icon}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{step.label}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="ml-8 w-16 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Cart Items & Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Cart Items */}
              {activeStep === "cart" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sepetinizdeki Kurslar</h2>
                  
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Sepetiniz Boş</h3>
                      <p className="text-gray-600 mb-6">Henüz sepetinize kurs eklemediniz.</p>
                      <div className="space-x-4">
                        <Link
                          href="/courses"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Kursları Keşfet
                        </Link>
                        <button
                          onClick={() => {
                            localStorage.removeItem('lms-cart');
                            window.location.reload();
                          }}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Sepeti Temizle
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{item.title.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.instructor}</p>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              {item.originalPrice > item.price ? (
                                <div>
                                  <span className="text-lg font-bold text-gray-900">{formatPrice(item.price, "TRY")}</span>
                                  <div className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice, "TRY")}</div>
                                  <span className="text-sm text-green-600 font-medium">
                                    %{calculateDiscount(item.originalPrice, item.price)} İndirim
                                  </span>
                                </div>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">{formatPrice(item.price, "TRY")}</span>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeStep === "payment" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ödeme Bilgileri</h2>
                  
                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemi</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit-card"
                          checked={paymentMethod === "credit-card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <svg className="h-6 w-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span className="font-medium text-gray-900">Kredi Kartı</span>
                          </div>
                          <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank-transfer"
                          checked={paymentMethod === "bank-transfer"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <svg className="h-6 w-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span className="font-medium text-gray-900">Havale/EFT</span>
                          </div>
                          <p className="text-sm text-gray-500">Banka hesabına transfer</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fatura Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Ad Soyad</label>
                        <input
                          type="text"
                          value={billingInfo.fullName}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          placeholder="Ad ve soyadınızı girin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">E-posta</label>
                        <input
                          type="email"
                          value={billingInfo.email}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          placeholder="ornek@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Telefon</label>
                        <input
                          type="tel"
                          value={billingInfo.phone}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+90 5XX XXX XX XX"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Ülke</label>
                        <input
                          type="text"
                          value={billingInfo.country}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Adres</label>
                        <input
                          type="text"
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Sokak, Mahalle, No"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Şehir</label>
                        <input
                          type="text"
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="İstanbul"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Posta Kodu</label>
                        <input
                          type="text"
                          value={billingInfo.postalCode}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                          placeholder="34000"
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Kart Üzerindeki İsim</label>
                        <input
                          type="text"
                          value={billingInfo.fullName}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          placeholder="Kart üzerinde yazan isim"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Kart Numarası</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Son Kullanma Tarihi</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === "bank-transfer" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Banka Bilgileri</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Banka:</span> Garanti BBVA</p>
                        <p><span className="font-medium">IBAN:</span> TR12 0006 2000 0000 0000 0000 00</p>
                        <p><span className="font-medium">Alıcı:</span> LMS Platform A.Ş.</p>
                        <p><span className="font-medium">Açıklama:</span> Sipariş No: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  <div className="mt-6">
                    <button
                      onClick={handlePayment}
                      disabled={!paymentMethod || cartItems.length === 0 || isProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Ödeme İşleniyor...
                        </div>
                      ) : (
                        "Ödemeyi Tamamla"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeStep === "confirmation" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Siparişiniz Başarıyla Tamamlandı!</h2>
                  
                  {/* Sipariş Numarası */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-600 mb-1">Sipariş Numarası</p>
                    <p className="text-lg font-mono font-bold text-blue-800">{orderNumber}</p>
                  </div>
                  
                  <p className="text-gray-600 mb-4">Siparişiniz başarıyla alındı ve ödemeniz onaylandı.</p>
                  
                  {/* Sipariş Detayları */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Sipariş Detayları:</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📧 Email: {billingInfo.email}</p>
                      <p>📱 Telefon: {billingInfo.phone}</p>
                      <p>🏠 Adres: {billingInfo.address}, {billingInfo.city}</p>
                      <p>💳 Ödeme Yöntemi: {paymentMethod === "credit-card" ? "Kredi Kartı" : "Banka Havalesi"}</p>
                      <p>💰 Toplam Tutar: {formatPrice(total, "TRY")}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">Kurslarınıza hemen erişebilir ve öğrenmeye başlayabilirsiniz!</p>
                  
                  <div className="space-y-3">
                    <Link
                      href="/dashboard"
                      className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      🎓 Dashboard'a Git
                    </Link>
                    <Link
                      href="/courses"
                      className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      🔍 Daha Fazla Kurs Keşfet
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
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
                        {formatPrice(item.price, "TRY")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="İndirim kodu"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Uygula
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-green-600">İndirim kodu uygulandı</span>
                      <button
                        onClick={() => {
                          setAppliedCoupon("");
                          setCouponDiscount(0.10); // Reset to default
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Kaldır
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="text-gray-900">{formatPrice(subtotal, "TRY")}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Toplam Tasarruf</span>
                      <span className="text-green-600">-{formatPrice(totalSavings, "TRY")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%{Math.round(taxRate * 100)})</span>
                    <span className="text-gray-900">{formatPrice(tax, "TRY")}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">İndirim</span>
                      <span className="text-green-600">-{formatPrice(subtotal * couponDiscount, "TRY")}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span>{formatPrice(appliedCoupon ? total * (1 - couponDiscount) : total, "TRY")}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {activeStep === "cart" && cartItems.length > 0 && (
                  <button
                    onClick={() => {
                      if (cartItems.length === 0) {
                        setError("Sepetinizde ürün bulunmuyor.");
                        return;
                      }
                      setActiveStep("payment");
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Ödemeye Geç
                  </button>
                )}

                {/* Security Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>256-bit SSL ile güvenli ödeme</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

