#!/bin/bash

# VPS Deployment Setup Script
# Bu script VPS sunucuda çalıştırılacak

set -e

echo "🚀 LMS Platform VPS Deployment Setup"
echo "====================================="

# VPS IP adresini al
read -p "VPS IP adresinizi girin (örn: 192.168.1.100): " VPS_IP

if [ -z "$VPS_IP" ]; then
    echo "❌ VPS IP adresi gerekli!"
    exit 1
fi

echo "📋 VPS IP: $VPS_IP"

# Güçlü şifreler oluştur
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)

echo "🔐 Güvenli şifreler oluşturuldu"

# Environment dosyalarını güncelle
echo "📝 Environment dosyaları güncelleniyor..."

# API .env.production
cat > apps/api/.env.production << EOF
# Database Configuration
DATABASE_URL="postgresql://lms_user:${DB_PASSWORD}@localhost:5432/lms_platform"

# Redis Configuration (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# App Configuration
NODE_ENV="production"
PORT=3001
API_URL="http://${VPS_IP}:3001"
WEB_URL="http://${VPS_IP}:3002"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# AWS S3 Configuration (for video uploads)
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET="lms-videos"
AWS_S3_BUCKET_REGION="eu-west-1"

# Payment Configuration
PAYTR_MERCHANT_ID="YOUR_PAYTR_MERCHANT_ID"
PAYTR_MERCHANT_KEY="YOUR_PAYTR_MERCHANT_KEY"
PAYTR_MERCHANT_SALT="YOUR_PAYTR_MERCHANT_SALT"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="YOUR_EMAIL@gmail.com"
SMTP_PASS="YOUR_APP_PASSWORD"
EOF

# Database .env.production
cat > packages/database/.env.production << EOF
# Database Configuration
DATABASE_URL="postgresql://lms_user:${DB_PASSWORD}@localhost:5432/lms_platform"

# Redis Configuration (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# App Configuration
NODE_ENV="production"
PORT=3001
API_URL="http://${VPS_IP}:3001"
WEB_URL="http://${VPS_IP}:3002"

# AWS S3 Configuration (for video uploads)
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET="lms-videos"
AWS_S3_BUCKET_REGION="eu-west-1"

# Payment Configuration
PAYTR_MERCHANT_ID="YOUR_PAYTR_MERCHANT_ID"
PAYTR_MERCHANT_KEY="YOUR_PAYTR_MERCHANT_KEY"
PAYTR_MERCHANT_SALT="YOUR_PAYTR_MERCHANT_SALT"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="YOUR_EMAIL@gmail.com"
SMTP_PASS="YOUR_APP_PASSWORD"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Web .env.production
cat > apps/web/.env.production << EOF
NEXT_PUBLIC_API_URL=http://${VPS_IP}:3001
NEXT_PUBLIC_WS_URL=ws://${VPS_IP}:3001
NODE_ENV=production
EOF

echo "✅ Environment dosyaları güncellendi"
echo "📋 Oluşturulan şifreler:"
echo "   DB Password: ${DB_PASSWORD}"
echo "   JWT Secret: ${JWT_SECRET:0:20}..."
echo "   JWT Refresh: ${JWT_REFRESH_SECRET:0:20}..."

# Şifreleri güvenli dosyaya kaydet
cat > vps-credentials.txt << EOF
VPS IP: ${VPS_IP}
Database Password: ${DB_PASSWORD}
JWT Secret: ${JWT_SECRET}
JWT Refresh Secret: ${JWT_REFRESH_SECRET}
Generated: $(date)
EOF

echo "🔐 Şifreler vps-credentials.txt dosyasına kaydedildi"
echo "⚠️  Bu dosyayı güvenli bir yerde saklayın!"

echo ""
echo "🎯 Sonraki adımlar:"
echo "1. Bu değişiklikleri commit edin: git add . && git commit -m 'feat: VPS environment config'"
echo "2. GitHub'a push edin: git push origin master"
echo "3. VPS sunucuda kurulum scriptini çalıştırın"
