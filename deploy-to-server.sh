#!/bin/bash

# Hakan Onbaşı Matematik - Sunucuya Güvenli Deployment Script
# Bu script sunucudaki mevcut ayarları koruyarak sadece kod değişikliklerini günceller

echo "🚀 Hakan Onbaşı Matematik - Sunucuya Deployment Başlıyor..."

# Sunucu bilgileri
SERVER_IP="179.61.246.103"
SERVER_USER="root"
SERVER_PATH="/root/lms-platform"

# Yerel değişiklikleri commit et
echo "📝 Yerel değişiklikleri commit ediliyor..."
git add .
git commit -m "ÖABT Matematik odaklı güncellemeler - Hakan Onbaşı Matematik"

# Git'e push et
echo "📤 Git'e push ediliyor..."
git push origin main

# Sunucuya bağlan ve güncelle
echo "🌐 Sunucuya bağlanılıyor..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
    cd /root/lms-platform
    
    # Mevcut ayarları yedekle
    echo "💾 Mevcut ayarlar yedekleniyor..."
    cp -r apps/api/.env /tmp/api_env_backup.env 2>/dev/null || echo "API .env bulunamadı"
    cp -r packages/database/.env /tmp/database_env_backup.env 2>/dev/null || echo "Database .env bulunamadı"
    cp -r ecosystem.config.js /tmp/ecosystem_backup.js 2>/dev/null || echo "Ecosystem config bulunamadı"
    
    # Git pull yap
    echo "📥 Kod güncellemeleri çekiliyor..."
    git pull origin main
    
    # Yedeklenen ayarları geri yükle
    echo "🔄 Ayarlar geri yükleniyor..."
    cp /tmp/api_env_backup.env apps/api/.env 2>/dev/null || echo "API .env geri yüklenemedi"
    cp /tmp/database_env_backup.env packages/database/.env 2>/dev/null || echo "Database .env geri yüklenemedi"
    cp /tmp/ecosystem_backup.js ecosystem.config.js 2>/dev/null || echo "Ecosystem config geri yüklenemedi"
    
    # Prisma client'ı yeniden oluştur
    echo "🗄️ Prisma client yeniden oluşturuluyor..."
    cd packages/database
    npx prisma generate
    cd ../..
    
    # API'yi yeniden build et
    echo "🔨 API yeniden build ediliyor..."
    cd apps/api
    npm run build
    cd ../..
    
    # Web'i yeniden build et
    echo "🌐 Web yeniden build ediliyor..."
    cd apps/web
    npm run build
    cd ../..
    
    # PM2 ile servisleri yeniden başlat
    echo "🔄 Servisler yeniden başlatılıyor..."
    pm2 restart all
    
    # Servis durumunu kontrol et
    echo "✅ Servis durumu:"
    pm2 status
    
    echo "🎉 Deployment tamamlandı!"
    echo "📊 Sunucu durumu:"
    echo "API: http://179.61.246.103:3001"
    echo "Web: http://179.61.246.103:3002"
    echo "Prisma Studio: http://179.61.246.103:5555"
EOF

echo "✅ Deployment tamamlandı!"
echo "🌐 Sunucuya erişim:"
echo "   API: http://179.61.246.103:3001"
echo "   Web: http://179.61.246.103:3002"
echo "   Prisma Studio: http://179.61.246.103:5555"
