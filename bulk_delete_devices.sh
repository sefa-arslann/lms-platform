#!/bin/bash

echo "🗑️ Tüm cihazlar siliniyor..."

# Cihaz ID'lerini al
DEVICE_IDS=$(curl -s -X GET "http://localhost:3001/admin/devices" -H "Content-Type: application/json" | jq -r '.devices[].id')

if [ -z "$DEVICE_IDS" ]; then
    echo "✅ Silinecek cihaz bulunamadı."
    exit 0
fi

# Cihaz sayısını say
DEVICE_COUNT=$(echo "$DEVICE_IDS" | wc -l)
echo "📱 Toplam $DEVICE_COUNT cihaz bulundu."

# Her cihazı sil
DELETED_COUNT=0
for device_id in $DEVICE_IDS; do
    echo "🗑️ Cihaz siliniyor: $device_id"
    
    # Cihazı sil (revoke endpoint'i kullan)
    RESPONSE=$(curl -s -X PATCH "http://localhost:3001/devices/$device_id/revoke" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $(curl -s -X POST "http://localhost:3001/auth/login" \
            -H "Content-Type: application/json" \
            -d '{"email":"admin@lms.com","password":"admin123"}' | jq -r '.accessToken')")
    
    if [ $? -eq 0 ]; then
        echo "✅ Cihaz silindi: $device_id"
        ((DELETED_COUNT++))
    else
        echo "❌ Cihaz silinemedi: $device_id"
    fi
    
    # API rate limit'e takılmamak için kısa bekle
    sleep 0.1
done

echo ""
echo "📊 SİLME İŞLEMİ TAMAMLANDI:"
echo "🗑️ Silinen cihaz sayısı: $DELETED_COUNT"
echo "📱 Toplam cihaz sayısı: $DEVICE_COUNT"

# Son durumu kontrol et
FINAL_COUNT=$(curl -s -X GET "http://localhost:3001/admin/devices" -H "Content-Type: application/json" | jq '.devices | length')
echo "📱 Kalan cihaz sayısı: $FINAL_COUNT"

if [ "$FINAL_COUNT" -eq 0 ]; then
    echo "🎉 TÜM CİHAZLAR BAŞARIYLA SİLİNDİ!"
else
    echo "⚠️ Hala $FINAL_COUNT cihaz kaldı."
fi
