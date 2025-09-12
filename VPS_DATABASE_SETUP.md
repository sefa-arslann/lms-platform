# VPS Veritabanı Kurulum Rehberi

Bu rehber, LMS Platform projesini VPS sunucunuza kurmak için gerekli veritabanı kurulum adımlarını içerir.

## 📋 Gereksinimler

- Ubuntu 20.04+ veya CentOS 7+
- Root veya sudo yetkisi
- En az 2GB RAM
- En az 20GB disk alanı

## 🗄️ PostgreSQL Kurulumu

### 1. PostgreSQL Kurulumu

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 2. PostgreSQL Konfigürasyonu

```bash
# PostgreSQL'e geçiş yap
sudo -u postgres psql

# Veritabanı ve kullanıcı oluştur
CREATE USER lms_user WITH PASSWORD 'GÜÇLÜ_ŞİFRE_BURAYA';
CREATE DATABASE lms_platform OWNER lms_user;
GRANT ALL PRIVILEGES ON DATABASE lms_platform TO lms_user;

# PostgreSQL'den çık
\q
```

### 3. PostgreSQL Güvenlik Ayarları

```bash
# pg_hba.conf dosyasını düzenle
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Aşağıdaki satırı bulun ve değiştirin:
# local   all             all                                     peer
# Şu şekilde değiştirin:
local   all             all                                     md5

# PostgreSQL'i yeniden başlat
sudo systemctl restart postgresql
```

## 🔴 Redis Kurulumu

### 1. Redis Kurulumu

```bash
# Ubuntu/Debian
sudo apt install -y redis-server

# CentOS/RHEL
sudo yum install -y redis
sudo systemctl enable redis
sudo systemctl start redis
```

### 2. Redis Konfigürasyonu

```bash
# Redis konfigürasyon dosyasını düzenle
sudo nano /etc/redis/redis.conf

# Aşağıdaki ayarları yapın:
bind 127.0.0.1
port 6379
timeout 300
tcp-keepalive 60

# Redis'i yeniden başlat
sudo systemctl restart redis
```

## 🔧 Veritabanı Migrasyonu

### 1. Mevcut Verileri Yedekle (Opsiyonel)

```bash
# Yerel veritabanından yedek al
pg_dump -h localhost -U sefaarslan -d lms_platform > lms_platform_backup.sql
```

### 2. VPS'e Veri Aktarımı

```bash
# Yedek dosyasını VPS'e kopyala
scp lms_platform_backup.sql root@YOUR_VPS_IP:/tmp/

# VPS'te veriyi geri yükle
sudo -u postgres psql -d lms_platform < /tmp/lms_platform_backup.sql
```

### 3. Prisma Migrasyonları

```bash
# Proje dizinine git
cd /opt/lms-platform

# Prisma client'ı oluştur
cd packages/database
pnpm generate

# Migrasyonları çalıştır
pnpm migrate

# Veritabanını seed et (opsiyonel)
pnpm db:seed
```

## 🔐 Güvenlik Ayarları

### 1. Firewall Konfigürasyonu

```bash
# UFW kurulumu (Ubuntu)
sudo apt install -y ufw

# Temel kurallar
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 3001  # API
sudo ufw allow 3002  # Web App
sudo ufw allow 5555  # Prisma Studio
sudo ufw --force enable
```

### 2. PostgreSQL Güvenlik

```bash
# postgresql.conf dosyasını düzenle
sudo nano /etc/postgresql/*/main/postgresql.conf

# Aşağıdaki ayarları yapın:
listen_addresses = 'localhost'
port = 5432
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB

# PostgreSQL'i yeniden başlat
sudo systemctl restart postgresql
```

## 📊 Veritabanı İzleme

### 1. PostgreSQL İzleme

```bash
# Veritabanı boyutunu kontrol et
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('lms_platform'));"

# Aktif bağlantıları kontrol et
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname = 'lms_platform';"

# Veritabanı istatistikleri
sudo -u postgres psql -c "SELECT * FROM pg_stat_database WHERE datname = 'lms_platform';"
```

### 2. Redis İzleme

```bash
# Redis durumunu kontrol et
redis-cli ping

# Redis istatistikleri
redis-cli info

# Bellek kullanımı
redis-cli info memory
```

## 🚨 Sorun Giderme

### 1. PostgreSQL Bağlantı Sorunları

```bash
# PostgreSQL servisini kontrol et
sudo systemctl status postgresql

# Log dosyalarını kontrol et
sudo tail -f /var/log/postgresql/postgresql-*.log

# Bağlantı testi
psql -h localhost -U lms_user -d lms_platform
```

### 2. Redis Bağlantı Sorunları

```bash
# Redis servisini kontrol et
sudo systemctl status redis

# Log dosyalarını kontrol et
sudo tail -f /var/log/redis/redis-server.log

# Bağlantı testi
redis-cli ping
```

### 3. Prisma Sorunları

```bash
# Prisma client'ı yeniden oluştur
cd /opt/lms-platform/packages/database
pnpm generate

# Veritabanı bağlantısını test et
pnpm prisma db pull

# Migrasyon durumunu kontrol et
pnpm prisma migrate status
```

## 📝 Önemli Notlar

1. **Şifre Güvenliği**: Veritabanı şifrelerini güçlü tutun ve düzenli olarak değiştirin
2. **Yedekleme**: Düzenli olarak veritabanı yedeği alın
3. **İzleme**: Veritabanı performansını düzenli olarak izleyin
4. **Güncellemeler**: Sistem ve veritabanı güncellemelerini düzenli olarak yapın
5. **Güvenlik**: Firewall ve erişim kontrollerini düzenli olarak gözden geçirin

## 🔄 Otomatik Yedekleme

```bash
# Günlük yedekleme scripti oluştur
sudo nano /opt/backup-db.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U lms_user -d lms_platform > $BACKUP_DIR/lms_platform_$DATE.sql

# 7 günden eski yedekleri sil
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# Crontab'a ekle
echo "0 2 * * * /opt/backup-db.sh" | sudo crontab -
```

Bu rehberi takip ederek VPS sunucunuzda güvenli ve stabil bir veritabanı ortamı kurabilirsiniz.
