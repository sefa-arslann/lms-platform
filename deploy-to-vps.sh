#!/bin/bash

# VPS Deployment Script for LMS Platform
# Usage: ./deploy-to-vps.sh YOUR_VPS_IP YOUR_VPS_USER

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

echo -e "${BLUE}🚀 LMS Platform VPS Deployment Script${NC}"
echo -e "${YELLOW}VPS IP: $VPS_IP${NC}"
echo -e "${YELLOW}VPS User: $VPS_USER${NC}"
echo -e "${YELLOW}VPS Path: $VPS_PATH${NC}"
echo ""

# Check if VPS IP is provided
if [ "$VPS_IP" = "YOUR_VPS_IP" ]; then
    echo -e "${RED}❌ Error: Please provide VPS IP address${NC}"
    echo "Usage: ./deploy-to-vps.sh YOUR_VPS_IP YOUR_VPS_USER"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Preparing local files...${NC}"

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
    -czf lms-platform-deploy.tar.gz .

echo -e "${GREEN}✅ Deployment package created${NC}"

echo -e "${BLUE}📤 Step 2: Uploading to VPS...${NC}"

# Upload to VPS
scp lms-platform-deploy.tar.gz $VPS_USER@$VPS_IP:/tmp/

echo -e "${GREEN}✅ Files uploaded to VPS${NC}"

echo -e "${BLUE}🔧 Step 3: Setting up VPS environment...${NC}"

# Execute setup commands on VPS
ssh $VPS_USER@$VPS_IP << EOF
set -e

echo "Creating project directory..."
mkdir -p $VPS_PATH
cd $VPS_PATH

echo "Extracting files..."
tar -xzf /tmp/lms-platform-deploy.tar.gz

echo "Installing system dependencies..."
apt-get update
apt-get install -y curl wget gnupg2 software-properties-common

echo "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

echo "Installing pnpm..."
npm install -g pnpm

echo "Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

echo "Installing Redis..."
apt-get install -y redis-server

echo "Installing PM2..."
npm install -g pm2

echo "Setting up PostgreSQL database..."
sudo -u postgres psql << EOSQL
CREATE USER lms_user WITH PASSWORD 'YOUR_DB_PASSWORD';
CREATE DATABASE lms_platform OWNER lms_user;
GRANT ALL PRIVILEGES ON DATABASE lms_platform TO lms_user;
\q
EOSQL

echo "Installing project dependencies..."
pnpm install

echo "Setting up environment files..."
cp apps/api/.env.production apps/api/.env
cp packages/database/.env.production packages/database/.env
cp apps/web/.env.production apps/web/.env

echo "Updating IP addresses in configuration files..."
sed -i 's/YOUR_VPS_IP/$VPS_IP/g' apps/api/.env
sed -i 's/YOUR_VPS_IP/$VPS_IP/g' packages/database/.env
sed -i 's/YOUR_VPS_IP/$VPS_IP/g' apps/web/.env
sed -i 's/YOUR_VPS_IP/$VPS_IP/g' apps/api/src/main.ts
sed -i 's/YOUR_VPS_IP/$VPS_IP/g' apps/web/src/config/api.ts

echo "Setting up database..."
cd packages/database
pnpm generate
pnpm migrate

echo "Building applications..."
cd ../..
pnpm build

echo "Setting up PM2 ecosystem..."
cp ecosystem.config.js /etc/pm2/ecosystem.config.js

echo "Starting services with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "Setting up firewall..."
ufw allow 3001
ufw allow 3002
ufw allow 5555
ufw allow 22
ufw --force enable

echo "Cleaning up..."
rm /tmp/lms-platform-deploy.tar.gz

echo "✅ VPS setup completed!"
echo "🌐 Web App: http://$VPS_IP:3002"
echo "🚀 API: http://$VPS_IP:3001"
echo "🗄️ Prisma Studio: http://$VPS_IP:5555"
EOF

echo -e "${GREEN}✅ VPS deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Update your VPS IP in the configuration files"
echo "2. Set up your database password and other secrets"
echo "3. Configure your domain name (optional)"
echo "4. Set up SSL certificates (recommended)"
echo ""
echo -e "${YELLOW}⚠️  Important: Update the following in your VPS:${NC}"
echo "- Database password in .env files"
echo "- JWT secrets"
echo "- AWS credentials"
echo "- Payment provider credentials"
echo "- Email configuration"
echo ""
echo -e "${GREEN}🎉 Your LMS Platform is now running on VPS!${NC}"

# Clean up local files
rm lms-platform-deploy.tar.gz
