#!/bin/bash

echo "🔄 VPS Güncelleme Başlatılıyor..."

# Git'ten güncellemeleri çek
echo "📥 Git güncellemeleri çekiliyor..."
git pull origin main

# PM2 servislerini yeniden başlat
echo "🔄 PM2 servisleri yeniden başlatılıyor..."
pm2 restart all

echo "✅ Güncelleme tamamlandı!"
echo "📊 Servis durumu:"
pm2 status
