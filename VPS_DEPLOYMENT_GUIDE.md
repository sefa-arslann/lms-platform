# VPS Deployment Rehberi - LMS Platform

Bu rehber, LMS Platform projesini VPS sunucunuza güvenli ve stabil bir şekilde kurmak için gerekli tüm adımları içerir.

## 🚀 Hızlı Başlangıç

### 1. VPS IP Adresinizi Güncelleyin

Deployment scriptini çalıştırmadan önce, aşağıdaki dosyalarda `YOUR_VPS_IP` yerine gerçek VPS IP adresinizi yazın:

- `apps/api/.env.production`
- `packages/database/.env.production`
- `apps/web/.env.production`
- `apps/api/src/main.ts`
- `apps/web/src/config/api.ts`

### 2. Deployment Scriptini Çalıştırın

```bash
# Scripti çalıştır
./deploy-to-vps.sh YOUR_VPS_IP root

# Örnek:
./deploy-to-vps.sh 192.168.1.100 root
```

## 📋 Detaylı Kurulum Adımları

### 1. VPS Hazırlığı

```bash
# VPS'e bağlan
ssh root@YOUR_VPS_IP

# Sistem güncellemeleri
apt update && apt upgrade -y

# Gerekli paketler
apt install -y curl wget gnupg2 software-properties-common
```

### 2. Node.js Kurulumu

```bash
# Node.js 18.x kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# pnpm kurulumu
npm install -g pnpm

# Versiyonları kontrol et
node --version
npm --version
pnpm --version
```

### 3. Veritabanı Kurulumu

PostgreSQL ve Redis kurulumu için `VPS_DATABASE_SETUP.md` dosyasını takip edin.

### 4. Proje Kurulumu

```bash
# Proje dizini oluştur
mkdir -p /opt/lms-platform
cd /opt/lms-platform

# Proje dosyalarını kopyala (deployment scripti bunu otomatik yapar)
# Manuel olarak yapmak isterseniz:
scp -r /path/to/local/lms-platform/* root@YOUR_VPS_IP:/opt/lms-platform/

# Bağımlılıkları yükle
pnpm install

# Environment dosyalarını ayarla
cp apps/api/.env.production apps/api/.env
cp packages/database/.env.production packages/database/.env
cp apps/web/.env.production apps/web/.env

# IP adreslerini güncelle
sed -i 's/YOUR_VPS_IP/YOUR_ACTUAL_VPS_IP/g' apps/api/.env
sed -i 's/YOUR_VPS_IP/YOUR_ACTUAL_VPS_IP/g' packages/database/.env
sed -i 's/YOUR_VPS_IP/YOUR_ACTUAL_VPS_IP/g' apps/web/.env
```

### 5. Veritabanı Kurulumu

```bash
# Prisma client oluştur
cd packages/database
pnpm generate

# Migrasyonları çalıştır
pnpm migrate

# Seed data (opsiyonel)
pnpm db:seed
```

### 6. Uygulamaları Build Et

```bash
# Tüm uygulamaları build et
cd /opt/lms-platform
pnpm build
```

### 7. PM2 ile Servisleri Başlat

```bash
# PM2 kurulumu
npm install -g pm2

# Ecosystem dosyasını kopyala
cp ecosystem.config.js /etc/pm2/ecosystem.config.js

# Servisleri başlat
pm2 start ecosystem.config.js

# PM2'yi sistem başlangıcına ekle
pm2 save
pm2 startup
```

## 🔧 Konfigürasyon

### 1. Environment Variables

Aşağıdaki değerleri VPS'inizde güncelleyin:

```bash
# API .env dosyası
nano /opt/lms-platform/apps/api/.env

# Önemli değişkenler:
DATABASE_URL="postgresql://lms_user:GÜÇLÜ_ŞİFRE@localhost:5432/lms_platform"
JWT_SECRET="ÇOK_GÜÇLÜ_JWT_SECRET_BURAYA"
JWT_REFRESH_SECRET="ÇOK_GÜÇLÜ_REFRESH_SECRET_BURAYA"
API_URL="http://YOUR_VPS_IP:3001"
WEB_URL="http://YOUR_VPS_IP:3002"
```

### 2. Firewall Ayarları

```bash
# UFW kurulumu
apt install -y ufw

# Firewall kuralları
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3001  # API
ufw allow 3002  # Web App
ufw allow 5555  # Prisma Studio
ufw --force enable
```

### 3. Nginx Reverse Proxy (Opsiyonel)

```bash
# Nginx kurulumu
apt install -y nginx

# Nginx konfigürasyonu
cat > /etc/nginx/sites-available/lms-platform << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Web app proxy
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Site'ı etkinleştir
ln -s /etc/nginx/sites-available/lms-platform /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Nginx'i yeniden başlat
systemctl restart nginx
systemctl enable nginx
```

## 🔍 İzleme ve Bakım

### 1. Servis Durumunu Kontrol Et

```bash
# PM2 durumu
pm2 status

# Logları görüntüle
pm2 logs

# Belirli bir servisin logları
pm2 logs lms-api
pm2 logs lms-web
pm2 logs lms-prisma-studio
```

### 2. Sistem Kaynaklarını İzle

```bash
# CPU ve RAM kullanımı
htop

# Disk kullanımı
df -h

# Ağ bağlantıları
netstat -tulpn | grep :300
```

### 3. Veritabanı İzleme

```bash
# PostgreSQL durumu
systemctl status postgresql

# Veritabanı boyutu
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('lms_platform'));"

# Redis durumu
systemctl status redis
redis-cli ping
```

## 🚨 Sorun Giderme

### 1. Servisler Başlamıyor

```bash
# PM2 loglarını kontrol et
pm2 logs --err

# Manuel olarak başlat
cd /opt/lms-platform/apps/api
pnpm start:prod

# Hata mesajlarını kontrol et
```

### 2. Veritabanı Bağlantı Sorunu

```bash
# PostgreSQL servisini kontrol et
systemctl status postgresql

# Bağlantı testi
psql -h localhost -U lms_user -d lms_platform

# Prisma bağlantısını test et
cd /opt/lms-platform/packages/database
pnpm prisma db pull
```

### 3. Port Çakışması

```bash
# Kullanılan portları kontrol et
netstat -tulpn | grep :300

# Servisleri yeniden başlat
pm2 restart all
```

## 🔄 Güncelleme

### 1. Kod Güncellemesi

```bash
# Yeni kodu çek
cd /opt/lms-platform
git pull origin main

# Bağımlılıkları güncelle
pnpm install

# Uygulamaları yeniden build et
pnpm build

# Servisleri yeniden başlat
pm2 restart all
```

### 2. Veritabanı Migrasyonu

```bash
# Yeni migrasyonları çalıştır
cd /opt/lms-platform/packages/database
pnpm migrate
```

## 📊 Performans Optimizasyonu

### 1. Node.js Optimizasyonu

```bash
# PM2 ecosystem dosyasında
max_memory_restart: '1G'
instances: 'max'  # CPU çekirdek sayısı kadar instance
```

### 2. PostgreSQL Optimizasyonu

```bash
# postgresql.conf ayarları
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
```

### 3. Redis Optimizasyonu

```bash
# redis.conf ayarları
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## 🔐 Güvenlik

### 1. SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
certbot --nginx -d yourdomain.com

# Otomatik yenileme
crontab -e
# Şu satırı ekle:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Güvenlik Duvarı

```bash
# Fail2ban kurulumu
apt install -y fail2ban

# Konfigürasyon
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl start fail2ban
```

## 📝 Önemli Notlar

1. **Yedekleme**: Düzenli olarak veritabanı ve dosya yedeği alın
2. **Güncellemeler**: Sistem güncellemelerini düzenli olarak yapın
3. **İzleme**: Servis durumunu düzenli olarak kontrol edin
4. **Güvenlik**: Şifreleri güçlü tutun ve düzenli olarak değiştirin
5. **Loglar**: Log dosyalarını düzenli olarak temizleyin

## 🆘 Destek

Sorun yaşarsanız:

1. PM2 loglarını kontrol edin: `pm2 logs`
2. Sistem loglarını kontrol edin: `journalctl -u service-name`
3. Veritabanı bağlantısını test edin
4. Port kullanımını kontrol edin: `netstat -tulpn`

Bu rehberi takip ederek VPS sunucunuzda güvenli ve stabil bir LMS Platform kurulumu yapabilirsiniz.
