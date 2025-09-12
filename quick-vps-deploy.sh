#!/bin/bash

# Quick VPS Deployment Script
# Bu script VPS sunucuda tek komutla çalıştırılacak

set -e

echo "🚀 LMS Platform Quick VPS Deployment"
echo "===================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

error_exit() {
    echo -e "${RED}❌ Hata: $1${NC}" >&2
    exit 1
}

success_msg() {
    echo -e "${GREEN}✅ $1${NC}"
}

info_msg() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Sistem güncellemeleri
info_msg "Sistem güncellemeleri yapılıyor..."
apt update && apt upgrade -y

# Gerekli paketler
info_msg "Gerekli paketler yükleniyor..."
apt install -y curl wget gnupg2 software-properties-common git build-essential postgresql postgresql-contrib redis-server ufw nginx

# Node.js 18.x
info_msg "Node.js 18.x kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# pnpm ve PM2
info_msg "pnpm ve PM2 kuruluyor..."
npm install -g pnpm pm2

# Servisleri başlat
info_msg "Servisleri başlatılıyor..."
systemctl start postgresql redis-server
systemctl enable postgresql redis-server

# Veritabanı oluştur
info_msg "Veritabanı oluşturuluyor..."
sudo -u postgres psql -c "CREATE USER lms_user WITH PASSWORD 'ZL1SQdFhfaOfDiMDTp9VkVImI';" || true
sudo -u postgres psql -c "CREATE DATABASE lms_platform OWNER lms_user;" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE lms_platform TO lms_user;"

# Firewall ayarları
info_msg "Firewall ayarlanıyor..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3001
ufw allow 3002
ufw allow 5555
ufw --force enable

# Proje dizini
info_msg "Proje klonlanıyor..."
mkdir -p /opt/lms-platform
cd /opt/lms-platform
git clone https://github.com/sefa-arslann/lms-platform.git .

# Bağımlılıkları yükle
info_msg "Bağımlılıklar yükleniyor..."
pnpm install

# Environment dosyalarını ayarla
info_msg "Environment dosyaları ayarlanıyor..."
cp apps/api/.env.production apps/api/.env
cp packages/database/.env.production packages/database/.env
cp apps/web/.env.production apps/web/.env

# Prisma setup
info_msg "Prisma kurulumu yapılıyor..."
cd packages/database
pnpm generate
pnpm migrate
cd /opt/lms-platform

# Build
info_msg "Uygulamalar build ediliyor..."
pnpm build

# Log dizini
mkdir -p /opt/lms-platform/logs

# PM2 başlat
info_msg "PM2 servisleri başlatılıyor..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Nginx konfigürasyonu
info_msg "Nginx ayarlanıyor..."
cat > /etc/nginx/sites-available/lms-platform << 'EOF'
server {
    listen 80;
    server_name 179.61.246.103;

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

ln -sf /etc/nginx/sites-available/lms-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx
systemctl enable nginx

# Kontroller
info_msg "Kurulum kontrol ediliyor..."
pm2 status
netstat -tulpn | grep :300

success_msg "LMS Platform başarıyla kuruldu!"
echo ""
echo "🎉 Kurulum Tamamlandı!"
echo "======================"
echo "📱 Web App: http://179.61.246.103:3002"
echo "🔧 API: http://179.61.246.103:3001"
echo "🗄️  Prisma Studio: http://179.61.246.103:5555"
echo ""
echo "📋 Yönetim:"
echo "  pm2 status    - Servis durumu"
echo "  pm2 logs      - Logları görüntüle"
echo "  pm2 restart all - Yeniden başlat"
