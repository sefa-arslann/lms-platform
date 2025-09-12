#!/bin/bash

# VPS Server Setup Script
# Bu script VPS sunucuda çalıştırılacak

set -e

echo "🚀 LMS Platform VPS Server Setup"
echo "================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hata durumunda çıkış
error_exit() {
    echo -e "${RED}❌ Hata: $1${NC}" >&2
    exit 1
}

# Başarı mesajı
success_msg() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Bilgi mesajı
info_msg() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Uyarı mesajı
warn_msg() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Sistem güncellemeleri
info_msg "Sistem güncellemeleri yapılıyor..."
apt update && apt upgrade -y || error_exit "Sistem güncellemesi başarısız"

# Gerekli paketler
info_msg "Gerekli paketler yükleniyor..."
apt install -y curl wget gnupg2 software-properties-common git build-essential || error_exit "Paket yükleme başarısız"

# Node.js 18.x kurulumu
info_msg "Node.js 18.x kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - || error_exit "Node.js repository ekleme başarısız"
apt install -y nodejs || error_exit "Node.js kurulumu başarısız"

# pnpm kurulumu
info_msg "pnpm kuruluyor..."
npm install -g pnpm || error_exit "pnpm kurulumu başarısız"

# PM2 kurulumu
info_msg "PM2 kuruluyor..."
npm install -g pm2 || error_exit "PM2 kurulumu başarısız"

# PostgreSQL kurulumu
info_msg "PostgreSQL kuruluyor..."
apt install -y postgresql postgresql-contrib || error_exit "PostgreSQL kurulumu başarısız"

# Redis kurulumu
info_msg "Redis kuruluyor..."
apt install -y redis-server || error_exit "Redis kurulumu başarısız"

# UFW firewall kurulumu
info_msg "Firewall kuruluyor..."
apt install -y ufw || error_exit "UFW kurulumu başarısız"

# Nginx kurulumu (opsiyonel)
info_msg "Nginx kuruluyor..."
apt install -y nginx || error_exit "Nginx kurulumu başarısız"

# Servisleri başlat
info_msg "Servisleri başlatılıyor..."
systemctl start postgresql || error_exit "PostgreSQL başlatılamadı"
systemctl enable postgresql || error_exit "PostgreSQL otomatik başlatma ayarlanamadı"

systemctl start redis-server || error_exit "Redis başlatılamadı"
systemctl enable redis-server || error_exit "Redis otomatik başlatma ayarlanamadı"

# PostgreSQL veritabanı oluştur
info_msg "Veritabanı oluşturuluyor..."
sudo -u postgres psql -c "CREATE USER lms_user WITH PASSWORD 'LmsPlatform2024!';" || warn_msg "Kullanıcı zaten mevcut olabilir"
sudo -u postgres psql -c "CREATE DATABASE lms_platform OWNER lms_user;" || warn_msg "Veritabanı zaten mevcut olabilir"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE lms_platform TO lms_user;" || error_exit "Veritabanı yetkilendirme başarısız"

# Firewall ayarları
info_msg "Firewall ayarlanıyor..."
ufw default deny incoming || error_exit "Firewall ayarlama başarısız"
ufw default allow outgoing || error_exit "Firewall ayarlama başarısız"
ufw allow ssh || error_exit "SSH kuralı eklenemedi"
ufw allow 3001 || error_exit "API port kuralı eklenemedi"
ufw allow 3002 || error_exit "Web port kuralı eklenemedi"
ufw allow 5555 || error_exit "Prisma Studio port kuralı eklenemedi"
ufw --force enable || error_exit "Firewall etkinleştirilemedi"

# Proje dizini oluştur
info_msg "Proje dizini hazırlanıyor..."
mkdir -p /opt/lms-platform || error_exit "Proje dizini oluşturulamadı"
cd /opt/lms-platform || error_exit "Proje dizinine geçilemedi"

# Git repository'yi klonla
info_msg "Git repository klonlanıyor..."
read -p "GitHub repository URL'inizi girin: " GIT_REPO_URL

if [ -z "$GIT_REPO_URL" ]; then
    error_exit "Git repository URL gerekli!"
fi

git clone $GIT_REPO_URL . || error_exit "Git clone başarısız"

# Bağımlılıkları yükle
info_msg "Bağımlılıklar yükleniyor..."
pnpm install || error_exit "Bağımlılık yükleme başarısız"

# Environment dosyalarını kopyala
info_msg "Environment dosyaları ayarlanıyor..."
cp apps/api/.env.production apps/api/.env || error_exit "API .env kopyalanamadı"
cp packages/database/.env.production packages/database/.env || error_exit "Database .env kopyalanamadı"
cp apps/web/.env.production apps/web/.env || error_exit "Web .env kopyalanamadı"

# Prisma client oluştur
info_msg "Prisma client oluşturuluyor..."
cd packages/database || error_exit "Database dizinine geçilemedi"
pnpm generate || error_exit "Prisma client oluşturulamadı"

# Migrasyonları çalıştır
info_msg "Veritabanı migrasyonları çalıştırılıyor..."
pnpm migrate || error_exit "Migrasyonlar başarısız"

# Ana dizine dön
cd /opt/lms-platform || error_exit "Ana dizine dönülemedi"

# Uygulamaları build et
info_msg "Uygulamalar build ediliyor..."
pnpm build || error_exit "Build işlemi başarısız"

# Log dizini oluştur
info_msg "Log dizini oluşturuluyor..."
mkdir -p /opt/lms-platform/logs || error_exit "Log dizini oluşturulamadı"

# PM2 ecosystem dosyasını kopyala
info_msg "PM2 konfigürasyonu ayarlanıyor..."
cp ecosystem.config.js /etc/pm2/ecosystem.config.js || error_exit "PM2 config kopyalanamadı"

# PM2 servislerini başlat
info_msg "PM2 servisleri başlatılıyor..."
pm2 start ecosystem.config.js || error_exit "PM2 servisleri başlatılamadı"

# PM2'yi sistem başlangıcına ekle
info_msg "PM2 sistem başlangıcına ekleniyor..."
pm2 save || error_exit "PM2 save başarısız"
pm2 startup || error_exit "PM2 startup başarısız"

# Nginx konfigürasyonu (opsiyonel)
info_msg "Nginx konfigürasyonu ayarlanıyor..."
VPS_IP=$(hostname -I | awk '{print $1}')

cat > /etc/nginx/sites-available/lms-platform << EOF
server {
    listen 80;
    server_name $VPS_IP;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Web app proxy
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Nginx site'ı etkinleştir
ln -sf /etc/nginx/sites-available/lms-platform /etc/nginx/sites-enabled/ || error_exit "Nginx site etkinleştirilemedi"
rm -f /etc/nginx/sites-enabled/default || warn_msg "Default nginx site kaldırılamadı"

# Nginx'i yeniden başlat
systemctl restart nginx || error_exit "Nginx yeniden başlatılamadı"
systemctl enable nginx || error_exit "Nginx otomatik başlatma ayarlanamadı"

# Servis durumunu kontrol et
info_msg "Servis durumu kontrol ediliyor..."
pm2 status || error_exit "PM2 durumu kontrol edilemedi"

# Port kontrolü
info_msg "Port kontrolü yapılıyor..."
netstat -tulpn | grep :300 || warn_msg "Port 3001/3002 dinlenmiyor olabilir"

# Başarı mesajı
success_msg "LMS Platform başarıyla kuruldu!"
echo ""
echo "🎉 Kurulum Tamamlandı!"
echo "======================"
echo "📱 Web App: http://$VPS_IP:3002"
echo "🔧 API: http://$VPS_IP:3001"
echo "🗄️  Prisma Studio: http://$VPS_IP:5555"
echo ""
echo "📋 Yönetim Komutları:"
echo "  PM2 durumu: pm2 status"
echo "  PM2 logları: pm2 logs"
echo "  Servisleri yeniden başlat: pm2 restart all"
echo "  Servisleri durdur: pm2 stop all"
echo ""
echo "🔐 Güvenlik:"
echo "  - Veritabanı şifresi: LmsPlatform2024!"
echo "  - JWT secret'ları .env dosyalarında"
echo "  - Firewall aktif (port 22, 3001, 3002, 5555 açık)"
echo ""
echo "📝 Loglar: /opt/lms-platform/logs/"
echo "📁 Proje: /opt/lms-platform/"
