# 🚀 VPS Deployment Komutları

## 📋 VPS Sunucuda Çalıştırılacak Komutlar

### 1. VPS'e Bağlan
```bash
ssh root@179.61.246.103
```

### 2. Kurulum Scriptini İndir ve Çalıştır
```bash
# Kurulum scriptini indir
wget https://raw.githubusercontent.com/sefa-arslann/lms-platform/master/vps-server-setup.sh

# Çalıştırılabilir yap
chmod +x vps-server-setup.sh

# Kurulumu başlat
./vps-server-setup.sh
```

### 3. Kurulum Sırasında İhtiyaç Duyacağınız Bilgiler

**GitHub Repository URL:** `https://github.com/sefa-arslann/lms-platform.git`

### 4. Kurulum Sonrası Kontroller

```bash
# PM2 durumu kontrol et
pm2 status

# Servis logları
pm2 logs

# Port kontrolü
netstat -tulpn | grep :300

# Veritabanı bağlantısı test et
cd /opt/lms-platform/packages/database
pnpm prisma db pull
```

### 5. Erişim URL'leri

- **Web App:** http://179.61.246.103:3002
- **API:** http://179.61.246.103:3001
- **Prisma Studio:** http://179.61.246.103:5555

### 6. Güvenlik Bilgileri

**Veritabanı Şifresi:** `ZL1SQdFhfaOfDiMDTp9VkVImI`

**JWT Secret'lar:** Environment dosyalarında güvenli şekilde saklanıyor.

### 7. Yönetim Komutları

```bash
# Servisleri yeniden başlat
pm2 restart all

# Servisleri durdur
pm2 stop all

# Servisleri başlat
pm2 start all

# Logları temizle
pm2 flush

# PM2'yi yeniden başlat
pm2 kill && pm2 resurrect
```

### 8. Sorun Giderme

```bash
# Hata logları
pm2 logs --err

# Sistem kaynakları
htop

# Disk kullanımı
df -h

# Ağ bağlantıları
ss -tulpn | grep :300
```

## 🔐 Güvenlik Notları

1. **Firewall:** Port 22, 3001, 3002, 5555 açık
2. **Veritabanı:** Güçlü şifre ile korunuyor
3. **JWT:** Güvenli secret'lar kullanılıyor
4. **HTTPS:** Nginx ile reverse proxy hazır

## 📝 Önemli Dosyalar

- **Proje:** `/opt/lms-platform/`
- **Loglar:** `/opt/lms-platform/logs/`
- **PM2 Config:** `/etc/pm2/ecosystem.config.js`
- **Nginx Config:** `/etc/nginx/sites-available/lms-platform`

## 🆘 Acil Durum Komutları

```bash
# Tüm servisleri durdur
pm2 stop all

# Veritabanını yeniden başlat
systemctl restart postgresql

# Redis'i yeniden başlat
systemctl restart redis-server

# Nginx'i yeniden başlat
systemctl restart nginx

# Firewall durumu
ufw status
```

---

**Not:** Bu komutları sırasıyla çalıştırarak kusursuz bir kurulum yapabilirsiniz. Herhangi bir hata durumunda logları kontrol edin.
