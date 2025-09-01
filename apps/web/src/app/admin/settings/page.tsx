'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
  EnvelopeIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '@/config/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: Cog6ToothIcon },
    { id: 'security', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'payment', name: 'Ödeme', icon: CreditCardIcon },
    { id: 'email', name: 'E-posta', icon: EnvelopeIcon },
    { id: 'storage', name: 'Depolama', icon: CloudIcon },
    { id: 'localization', name: 'Yerelleştirme', icon: GlobeAltIcon }
  ];

  // Fetch settings from API
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.cms.settings);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        console.error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (tabId: string, tabSettings: any) => {
    try {
      setSaving(true);
      const response = await fetch(API_ENDPOINTS.cms.settings, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tabSettings),
      });
      
      if (response.ok) {
        console.log(`${tabId} settings saved successfully`);
        await fetchSettings(); // Refresh settings
      } else {
        console.error(`Failed to save ${tabId} settings`);
      }
    } catch (error) {
      console.error(`Error saving ${tabId} settings:`, error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-600 mt-2">Platform genelinde sistem ayarlarını yapılandırın</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Ayarlar yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
        <p className="text-gray-600 mt-2">Platform genelinde sistem ayarlarını yapılandırın</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Genel Ayarlar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Adı
                </label>
                <input
                  type="text"
                  defaultValue={settings.platform_name || 'LMS Platform'}
                  onChange={(e) => setSettings({...settings, platform_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform URL
                </label>
                <input
                  type="url"
                  defaultValue={settings.platform_url || 'https://lms-platform.com'}
                  onChange={(e) => setSettings({...settings, platform_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varsayılan Dil
                </label>
                <select 
                  defaultValue={settings.default_language || 'tr'}
                  onChange={(e) => setSettings({...settings, default_language: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varsayılan Para Birimi
                </label>
                <select 
                  defaultValue={settings.default_currency || 'TRY'}
                  onChange={(e) => setSettings({...settings, default_currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TRY">Türk Lirası (TRY)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button 
                onClick={() => fetchSettings()}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button 
                onClick={() => saveSettings('general', {
                  platform_name: settings.platform_name,
                  platform_url: settings.platform_url,
                  default_language: settings.default_language,
                  default_currency: settings.default_currency,
                })}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Güvenlik Ayarları</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Şifre Uzunluğu
                </label>
                <input
                  type="number"
                  defaultValue="8"
                  min="6"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JWT Token Süresi (saat)
                </label>
                <input
                  type="number"
                  defaultValue="24"
                  min="1"
                  max="168"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactor"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-900">
                  İki Faktörlü Kimlik Doğrulama (2FA)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rateLimit"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rateLimit" className="ml-2 block text-sm text-gray-900">
                  API Rate Limiting
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                İptal
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Kaydet
              </button>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Ödeme Ayarları</h2>
            
            <div className="space-y-6">
              {/* KDV Ayarları */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">KDV Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KDV Oranı (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={settings.tax_rate || 20}
                      onChange={(e) => setSettings({...settings, tax_rate: parseFloat(e.target.value) || 20})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Fatura ve fiyat hesaplamalarında kullanılacak KDV oranı</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Varsayılan KDV Durumu
                    </label>
                    <select 
                      value={settings.tax_included_by_default ? 'included' : 'excluded'}
                      onChange={(e) => setSettings({...settings, tax_included_by_default: e.target.value === 'included'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="included">KDV Dahil</option>
                      <option value="excluded">KDV Hariç</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Kurs fiyatları varsayılan olarak KDV dahil mi gösterilsin</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">PayTR Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Merchant ID
                    </label>
                    <input
                      type="text"
                      placeholder="PayTR Merchant ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Merchant Key
                    </label>
                    <input
                      type="password"
                      placeholder="PayTR Merchant Key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">İyzico Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="text"
                      placeholder="İyzico API Key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      placeholder="İyzico Secret Key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sandbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sandbox" className="ml-2 block text-sm text-gray-900">
                  Test Modu (Sandbox)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button 
                onClick={() => fetchSettings()}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button 
                onClick={() => saveSettings('payment', {
                  tax_rate: settings.tax_rate,
                  tax_included_by_default: settings.tax_included_by_default,
                })}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">E-posta Ayarları</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Sunucu
                </label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    defaultValue="587"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Güvenlik
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">Yok</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanıcı Adı
                  </label>
                  <input
                    type="email"
                    placeholder="noreply@lms-platform.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    placeholder="E-posta şifresi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gönderen Adı
                </label>
                <input
                  type="text"
                  defaultValue="LMS Platform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                İptal
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Kaydet
              </button>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Depolama Ayarları</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">AWS S3 Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Key ID
                    </label>
                    <input
                      type="text"
                      placeholder="AWS Access Key ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Access Key
                    </label>
                    <input
                      type="password"
                      placeholder="AWS Secret Access Key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bucket Name
                  </label>
                  <input
                    type="text"
                    placeholder="lms-platform-bucket"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="eu-west-1">Europe (Ireland)</option>
                    <option value="eu-central-1">Europe (Frankfurt)</option>
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CloudFront Domain
                </label>
                <input
                  type="url"
                  placeholder="https://cdn.lms-platform.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cdn"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="cdn" className="ml-2 block text-sm text-gray-900">
                  CDN Kullan (CloudFront)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                İptal
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Kaydet
              </button>
            </div>
          </div>
        )}

        {activeTab === 'localization' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Yerelleştirme Ayarları</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varsayılan Zaman Dilimi
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                  <option value="UTC">UTC (UTC+0)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih Formatı
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saat Formatı
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="24">24 Saat</option>
                  <option value="12">12 Saat (AM/PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Haftanın İlk Günü
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="1">Pazartesi</option>
                  <option value="0">Pazar</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                İptal
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  );
}
