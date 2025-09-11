# Hakan Onbaşı Matematik - Deployment Rehberi

## 🚀 Sunucuya Güvenli Deployment

Bu proje sunucuda çalışırken, veritabanı ayarları ve diğer kritik dosyalar korunmalıdır.

### ⚠️ ÖNEMLİ: Korunması Gereken Dosyalar

Aşağıdaki dosyalar sunucuda mevcut ayarları korumak için `.gitignore`'da yer almaktadır:

```
# Environment dosyaları (VERİTABANI AYARLARI)
apps/api/.env
packages/database/.env
.env
.env.local
.env.production
.env.development

# Veritabanı dosyaları
*.db
*.sqlite
packages/database/prisma/migrations/

# Upload edilen dosyalar
uploads/
apps/api/uploads/

# PM2 konfigürasyonu
ecosystem.config.js
```

### 🔄 Deployment Süreci

#### Otomatik Deployment (Önerilen)
```bash
./deploy-to-server.sh
```

#### Manuel Deployment
```bash
# 1. Yerel değişiklikleri commit et
git add .
git commit -m "Güncelleme mesajı"
git push origin main

# 2. Sunucuya bağlan
ssh root@179.61.246.103

# 3. Sunucuda güncelleme yap
cd /root/lms-platform
git pull origin main

# 4. Servisleri yeniden başlat
pm2 restart all
```

### 🛡️ Güvenlik Önlemleri

1. **Environment Dosyaları**: Sunucudaki `.env` dosyaları asla değişmez
2. **Veritabanı**: Mevcut veritabanı ve migration'lar korunur
3. **Upload Dosyaları**: Kullanıcıların yüklediği dosyalar korunur
4. **PM2 Ayarları**: Sunucu konfigürasyonu korunur

### 📊 Sunucu Bilgileri

- **IP**: 179.61.246.103
- **API Port**: 3001
- **Web Port**: 3002
- **Prisma Studio Port**: 5555

### 🔧 Sorun Giderme

Eğer deployment sonrası sorun yaşarsanız:

```bash
# PM2 durumunu kontrol et
pm2 status

# Logları kontrol et
pm2 logs

# Servisleri yeniden başlat
pm2 restart all
```

### 📝 Notlar

- Sunucudaki mevcut veritabanı ayarları korunur
- Kullanıcı verileri etkilenmez
- Upload edilen dosyalar korunur
- Sadece kod değişiklikleri güncellenir
