const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestSemester() {
  try {
    // Test dönemi ekle
    const semester = await prisma.semester.create({
      data: {
        name: "2024-2025 Güz Dönemi",
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-01-31'),
        isActive: true,
        isCurrent: true,
      },
    });

    console.log('✅ Test dönemi eklendi:', semester);
    
    // Mevcut dönemleri listele
    const allSemesters = await prisma.semester.findMany();
    console.log('\n📚 Tüm dönemler:', allSemesters);
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestSemester();
