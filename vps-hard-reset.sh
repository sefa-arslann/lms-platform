#!/bin/bash

# VPS Hard Reset Script - LMS Platform
# Bu script VPS'i tamamen temizler ve yeni kurulum yapar
# Kullanım: ./vps-hard-reset.sh YOUR_VPS_IP YOUR_VPS_USER

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_IP=${1:-"YOUR_VPS_IP"}
VPS_USER=${2:-"root"}
PROJECT_NAME="lms-platform"
VPS_PATH="/opt/$PROJECT_NAME"

echo -e "${RED}⚠️  VPS HARD RESET SCRIPT ⚠️${NC}"
echo -e "${YELLOW}Bu script VPS'i TAMAMEN SIFIRLAYACAK!${NC}"
echo -e "${YELLOW}VPS IP: $VPS_IP${NC}"
echo -e "${YELLOW}VPS User: $VPS_USER${NC}"
echo -e "${YELLOW}VPS Path: $VPS_PATH${NC}"
echo ""

# Check if VPS IP is provided
if [ "$VPS_IP" = "YOUR_VPS_IP" ]; then
    echo -e "${RED}❌ Error: Please provide VPS IP address${NC}"
    echo "Usage: ./vps-hard-reset.sh YOUR_VPS_IP YOUR_VPS_USER"
    exit 1
fi

# Confirmation - Auto confirm for automated deployment
echo -e "${YELLOW}⚠️  VPS'deki TÜM VERİLER SİLİNECEK!${NC}"
echo -e "${YELLOW}Otomatik onay veriliyor...${NC}"
confirm="yes"

echo -e "${BLUE}🔥 Step 1: Stopping all services...${NC}"

# Stop all services on VPS
ssh $VPS_USER@$VPS_IP << 'EOF'
set -e

echo "Stopping PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

echo "Stopping system services..."
systemctl stop postgresql 2>/dev/null || true
systemctl stop redis-server 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true

echo "Killing any remaining processes on ports 3001, 3002, 5555..."
fuser -k 3001/tcp 2>/dev/null || true
fuser -k 3002/tcp 2>/dev/null || true
fuser -k 5555/tcp 2>/dev/null || true

echo "✅ All services stopped"
EOF

echo -e "${GREEN}✅ Services stopped${NC}"

echo -e "${BLUE}🗑️ Step 2: Removing all project files...${NC}"

# Remove all project files
ssh $VPS_USER@$VPS_IP << 'EOF'
set -e

echo "Removing project directory..."
rm -rf /opt/lms-platform 2>/dev/null || true

echo "Removing PM2 configuration..."
rm -rf /root/.pm2 2>/dev/null || true
rm -f /etc/pm2/ecosystem.config.js 2>/dev/null || true

echo "Removing Node.js and pnpm..."
apt-get remove -y nodejs npm pnpm 2>/dev/null || true
rm -rf /usr/local/bin/node 2>/dev/null || true
rm -rf /usr/local/bin/npm 2>/dev/null || true
rm -rf /usr/local/bin/pnpm 2>/dev/null || true

echo "✅ Project files removed"
EOF

echo -e "${GREEN}✅ Project files removed${NC}"

echo -e "${BLUE}🗄️ Step 3: Dropping and recreating database...${NC}"

# Drop and recreate database
ssh $VPS_USER@$VPS_IP << 'EOF'
set -e

echo "Dropping existing database..."
sudo -u postgres psql << EOSQL
DROP DATABASE IF EXISTS lms_platform;
DROP USER IF EXISTS lms_user;
\q
EOSQL

echo "Creating fresh database..."
sudo -u postgres psql << EOSQL
CREATE USER lms_user WITH PASSWORD 'LMS_STRONG_PASSWORD_2024!';
CREATE DATABASE lms_platform OWNER lms_user;
GRANT ALL PRIVILEGES ON DATABASE lms_platform TO lms_user;
\q
EOSQL

echo "✅ Database recreated"
EOF

echo -e "${GREEN}✅ Database recreated${NC}"

echo -e "${BLUE}🧹 Step 4: Cleaning system...${NC}"

# Clean system
ssh $VPS_USER@$VPS_IP << 'EOF'
set -e

echo "Cleaning package cache..."
apt-get clean
apt-get autoclean
apt-get autoremove -y

echo "Cleaning logs..."
rm -rf /var/log/*.log 2>/dev/null || true
rm -rf /var/log/*.1 2>/dev/null || true
rm -rf /var/log/*.gz 2>/dev/null || true

echo "Cleaning temporary files..."
rm -rf /tmp/*
rm -rf /var/tmp/*

echo "✅ System cleaned"
EOF

echo -e "${GREEN}✅ System cleaned${NC}"

echo -e "${BLUE}📦 Step 5: Preparing local files...${NC}"

# Create deployment package
echo "Creating deployment package..."
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='*.log' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='.env.development' \
    --exclude='lms-platform-deploy.tar.gz' \
    --exclude='vps-hard-reset.sh' \
    -czf lms-platform-deploy.tar.gz .

echo -e "${GREEN}✅ Deployment package created${NC}"

echo -e "${BLUE}📤 Step 6: Uploading to VPS...${NC}"

# Upload to VPS
scp lms-platform-deploy.tar.gz $VPS_USER@$VPS_IP:/tmp/

echo -e "${GREEN}✅ Files uploaded to VPS${NC}"

echo -e "${BLUE}🔧 Step 7: Fresh VPS setup...${NC}"

# Execute fresh setup on VPS
ssh $VPS_USER@$VPS_IP << EOF
set -e

echo "Updating system packages..."
apt-get update
apt-get upgrade -y

echo "Installing essential packages..."
apt-get install -y curl wget gnupg2 software-properties-common build-essential

echo "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

echo "Installing pnpm..."
npm install -g pnpm

echo "Installing PM2..."
npm install -g pm2

echo "Installing Redis..."
apt-get install -y redis-server

echo "Starting Redis..."
systemctl start redis-server
systemctl enable redis-server

echo "Starting PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

echo "Creating project directory..."
mkdir -p $VPS_PATH
cd $VPS_PATH

echo "Extracting project files..."
tar -xzf /tmp/lms-platform-deploy.tar.gz

echo "Installing project dependencies..."
pnpm install

echo "Setting up environment files..."
cat > apps/api/.env << 'EOL'
# Database Configuration
DATABASE_URL="postgresql://lms_user:LMS_STRONG_PASSWORD_2024!@localhost:5432/lms_platform"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="LMS_SUPER_SECRET_JWT_KEY_2024_CHANGE_IN_PRODUCTION"
JWT_REFRESH_SECRET="LMS_SUPER_SECRET_REFRESH_KEY_2024_CHANGE_IN_PRODUCTION"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# App Configuration
NODE_ENV="production"
PORT=3001
API_URL="http://$VPS_IP:3001"
WEB_URL="http://$VPS_IP:3002"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# AWS S3 Configuration (optional)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="eu-west-1"
AWS_S3_BUCKET=""
AWS_S3_BUCKET_REGION="eu-west-1"

# Payment Configuration (optional)
PAYTR_MERCHANT_ID=""
PAYTR_MERCHANT_KEY=""
PAYTR_MERCHANT_SALT=""

# Email Configuration (optional)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
EOL

cat > packages/database/.env << 'EOL'
# Database Configuration
DATABASE_URL="postgresql://lms_user:LMS_STRONG_PASSWORD_2024!@localhost:5432/lms_platform"
EOL

cat > apps/web/.env.local << 'EOL'
# API Configuration
NEXT_PUBLIC_API_URL=http://$VPS_IP:3001
NEXT_PUBLIC_WEB_URL=http://$VPS_IP:3002
EOL

echo "Setting up database..."
cd packages/database
pnpm generate
pnpm migrate

echo "Building applications..."
cd ../..
pnpm build

echo "Setting up PM2 ecosystem..."
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [
    {
      name: 'lms-api',
      script: 'apps/api/dist/main.js',
      cwd: '/opt/lms-platform',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/lms-api-error.log',
      out_file: '/var/log/lms-api-out.log',
      log_file: '/var/log/lms-api.log',
      time: true
    },
    {
      name: 'lms-web',
      script: 'apps/web/server.js',
      cwd: '/opt/lms-platform/apps/web',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: '/var/log/lms-web-error.log',
      out_file: '/var/log/lms-web-out.log',
      log_file: '/var/log/lms-web.log',
      time: true
    },
    {
      name: 'lms-prisma-studio',
      script: 'node_modules/.bin/prisma',
      args: 'studio --port 5555',
      cwd: '/opt/lms-platform/packages/database',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/lms-prisma-error.log',
      out_file: '/var/log/lms-prisma-out.log',
      log_file: '/var/log/lms-prisma.log',
      time: true
    }
  ]
};
EOL

echo "Starting services with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "Setting up firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3001
ufw allow 3002
ufw allow 5555
ufw --force enable

echo "Cleaning up..."
rm /tmp/lms-platform-deploy.tar.gz

echo "✅ Fresh VPS setup completed!"
echo "🌐 Web App: http://$VPS_IP:3002"
echo "🚀 API: http://$VPS_IP:3001"
echo "🗄️ Prisma Studio: http://$VPS_IP:5555"
EOF

echo -e "${GREEN}✅ VPS hard reset completed!${NC}"
echo ""
echo -e "${BLUE}📋 VPS Information:${NC}"
echo "🌐 Web App: http://$VPS_IP:3002"
echo "🚀 API: http://$VPS_IP:3001"
echo "🗄️ Prisma Studio: http://$VPS_IP:5555"
echo ""
echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
echo "1. Change the database password in .env files"
echo "2. Change JWT secrets"
echo "3. Set up proper SSL certificates"
echo "4. Configure your domain name"
echo "5. Set up proper backup strategy"
echo ""
echo -e "${GREEN}🎉 Your LMS Platform is now running on a fresh VPS!${NC}"

# Clean up local files
rm lms-platform-deploy.tar.gz
