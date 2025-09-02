# LMS Platform Database Export

Bu dosyalar LMS Platform projesinin veritabanı yapısını ve konfigürasyonunu içerir.

## Export Edilen Dosyalar:

### 1. `lms_platform_schema.prisma`
- Prisma schema dosyası
- Tüm tablolar, ilişkiler ve enum'lar
- Veritabanı konfigürasyonu

### 2. `lms_platform_migrations/`
- Tüm migration dosyaları
- Veritabanı şema değişiklikleri geçmişi
- SQL migration dosyaları

### 3. `lms_platform_seed.ts`
- Seed dosyası
- Örnek veri oluşturma scripti

### 4. `lms_platform_database_package.json`
- Database paketi dependencies
- Prisma ve diğer gerekli paketler

## Yeni Projede Kullanım:

### 1. Prisma Kurulumu:
```bash
npm install prisma @prisma/client
# veya
pnpm add prisma @prisma/client
```

### 2. Schema Kopyalama:
```bash
cp lms_platform_schema.prisma prisma/schema.prisma
```

### 3. Migration Kopyalama:
```bash
cp -r lms_platform_migrations prisma/migrations
```

### 4. Environment Ayarları:
`.env` dosyası oluşturun:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

### 5. Prisma Client Generate:
```bash
npx prisma generate
```

### 6. Migration Deploy:
```bash
npx prisma migrate deploy
```

### 7. Seed Data (Opsiyonel):
```bash
cp lms_platform_seed.ts prisma/seed.ts
npx prisma db seed
```

## Tablolar:

- **users** - Kullanıcı bilgileri
- **courses** - Kurslar
- **sections** - Kurs bölümleri
- **lessons** - Dersler
- **orders** - Siparişler
- **access_grants** - Erişim izinleri
- **questions** - Sorular
- **answers** - Cevaplar
- **notes** - Notlar
- **messages** - Mesajlar
- **user_devices** - Kullanıcı cihazları
- **analytics_events** - Analitik olayları
- **video_analytics** - Video analitikleri
- **lesson_progress** - Ders ilerlemesi

## Önemli Notlar:

1. Veritabanı bağlantı bilgilerini yeni projenize göre güncelleyin
2. JWT secret'ları ve diğer güvenlik anahtarlarını değiştirin
3. AWS S3 ve diğer servis konfigürasyonlarını güncelleyin
4. Test verilerini production'da kullanmayın

## Destek:

Bu export dosyaları LMS Platform projesinden alınmıştır. 
Herhangi bir sorun için proje repository'sini kontrol edin.
