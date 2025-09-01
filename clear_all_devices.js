const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAllDevices() {
  try {
    console.log('🗑️ Tüm cihazlar siliniyor...');
    
    // 1. Mevcut cihaz sayısını kontrol et
    const deviceCount = await prisma.userDevice.count();
    console.log(`📱 Mevcut cihaz sayısı: ${deviceCount}`);
    
    if (deviceCount === 0) {
      console.log('✅ Silinecek cihaz bulunamadı.');
      return;
    }
    
    // 2. Tüm cihazları sil
    const deleteDevicesResult = await prisma.userDevice.deleteMany({});
    console.log(`✅ ${deleteDevicesResult.count} cihaz silindi!`);
    
    // 3. Cihaz enrollment request'lerini kontrol et ve sil
    const enrollRequestCount = await prisma.deviceEnrollRequest.count();
    console.log(`📋 Mevcut enrollment request sayısı: ${enrollRequestCount}`);
    
    if (enrollRequestCount > 0) {
      const deleteEnrollResult = await prisma.deviceEnrollRequest.deleteMany({});
      console.log(`✅ ${deleteEnrollResult.count} enrollment request silindi!`);
    }
    
    // 4. User sessions'ları kontrol et ve sil (cihaz bağlantılı olanları)
    const sessionCount = await prisma.userSession.count();
    console.log(`🕐 Mevcut user session sayısı: ${sessionCount}`);
    
    if (sessionCount > 0) {
      const deleteSessionResult = await prisma.userSession.deleteMany({});
      console.log(`✅ ${deleteSessionResult.count} user session silindi!`);
    }
    
    // 5. Son durumu kontrol et
    const finalDeviceCount = await prisma.userDevice.count();
    const finalEnrollCount = await prisma.deviceEnrollRequest.count();
    const finalSessionCount = await prisma.userSession.count();
    
    console.log('\n📊 SİLME İŞLEMİ TAMAMLANDI:');
    console.log(`📱 Kalan cihaz sayısı: ${finalDeviceCount}`);
    console.log(`📋 Kalan enrollment request sayısı: ${finalEnrollCount}`);
    console.log(`🕐 Kalan user session sayısı: ${finalSessionCount}`);
    
    if (finalDeviceCount === 0 && finalEnrollCount === 0) {
      console.log('\n🎉 TÜM CİHAZLAR BAŞARIYLA SİLİNDİ!');
    }
    
  } catch (error) {
    console.error('❌ Cihazlar silinirken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllDevices();
