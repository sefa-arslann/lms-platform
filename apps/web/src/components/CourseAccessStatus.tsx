import React from 'react';
import { Order } from '../utils/api/orders';

interface CourseAccessStatusProps {
  order: Order;
}

export const CourseAccessStatus: React.FC<CourseAccessStatusProps> = ({ order }) => {
  const now = new Date();
  const expiresAt = order.expiresAt ? new Date(order.expiresAt) : null;
  const isExpired = expiresAt && expiresAt < now;
  const daysUntilExpiry = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const getStatusColor = () => {
    if (order.status === 'COMPLETED') {
      if (isExpired) return 'text-red-600 bg-red-50';
      if (daysUntilExpiry <= 30) return 'text-orange-600 bg-orange-50';
      return 'text-green-600 bg-green-50';
    }
    if (order.status === 'PENDING') return 'text-yellow-600 bg-yellow-50';
    if (order.status === 'FAILED') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusText = () => {
    if (order.status === 'COMPLETED') {
      if (isExpired) return 'Erişim Süresi Doldu';
      if (daysUntilExpiry <= 30) return `Erişim ${daysUntilExpiry} gün sonra dolacak`;
      return 'Erişim Aktif';
    }
    if (order.status === 'PENDING') return 'Ödeme Bekleniyor';
    if (order.status === 'FAILED') return 'Ödeme Başarısız';
    return 'Bilinmeyen Durum';
  };

  const getExpirationInfo = () => {
    if (!expiresAt) return null;
    
    return (
      <div className="text-sm text-gray-600">
        <span className="font-medium">Erişim Bitiş:</span> {expiresAt.toLocaleDateString('tr-TR')}
        <br />
        <span className="font-medium">Satın Alma:</span> {new Date(order.purchasedAt).toLocaleDateString('tr-TR')}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {order.course.title}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            
            {getExpirationInfo()}
            
            {order.status === 'COMPLETED' && !isExpired && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Kalan Süre:</span> {daysUntilExpiry} gün
              </div>
            )}
            
            {order.status === 'COMPLETED' && isExpired && (
              <div className="text-sm text-red-600 font-medium">
                ⚠️ Bu kursa erişiminiz sona erdi. Tekrar satın alabilirsiniz.
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {order.amount} {order.currency}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(order.purchasedAt).toLocaleDateString('tr-TR')}
          </div>
        </div>
      </div>
      
      {order.status === 'COMPLETED' && !isExpired && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Erişim Durumu</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">Aktif</span>
            </div>
          </div>
          
          {daysUntilExpiry <= 30 && (
            <div className="mt-2 p-2 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-800">
                ⏰ Erişiminiz {daysUntilExpiry} gün sonra sona erecek. 
                Tekrar satın alabilirsiniz.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
