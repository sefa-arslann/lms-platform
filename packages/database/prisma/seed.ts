import { PrismaClient, UserRole, CourseLevel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.videoAnalytics.deleteMany();
  await prisma.courseView.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.note.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.deviceEnrollRequest.deleteMany();
  await prisma.userDevice.deleteMany();
  await prisma.accessGrant.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.video.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Database cleared');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lms.com',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create instructor user
  const instructorPassword = await bcrypt.hash('instructor123', 12);
  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@lms.com',
      firstName: 'Site',
      lastName: 'Sahibi',
      password: instructorPassword,
      role: UserRole.INSTRUCTOR,
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create sample students
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ahmet@example.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        password: await bcrypt.hash('student123', 12),
        role: UserRole.STUDENT,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'fatma@example.com',
        firstName: 'Fatma',
        lastName: 'Demir',
        password: await bcrypt.hash('student123', 12),
        role: UserRole.STUDENT,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'mehmet@example.com',
        firstName: 'Mehmet',
        lastName: 'Kaya',
        password: await bcrypt.hash('student123', 12),
        role: UserRole.STUDENT,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
  ]);

  console.log('👥 Users created');

  // Create sample courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'React ile Modern Web Geliştirme',
        slug: 'react-ile-modern-web-gelistirme',
        description: 'React 18, TypeScript ve modern web teknolojileri ile profesyonel web uygulamaları geliştirin.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        price: 299.99,
        currency: 'TRY',
        duration: 1200, // 20 hours
        level: CourseLevel.INTERMEDIATE,
        language: 'tr',
        instructorId: instructor.id,
        isPublished: true,
        metaTitle: 'React ile Modern Web Geliştirme Kursu',
        metaDescription: 'React 18, TypeScript ve modern web teknolojileri ile profesyonel web uygulamaları geliştirin.',
        keywords: 'react,typescript,web,frontend,modern',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Node.js Backend Geliştirme',
        slug: 'nodejs-backend-gelistirme',
        description: 'Node.js, Express ve MongoDB ile güçlü backend API\'leri geliştirin.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        price: 399.99,
        currency: 'TRY',
        duration: 900, // 15 hours
        level: CourseLevel.ADVANCED,
        language: 'tr',
        instructorId: instructor.id,
        isPublished: true,
        metaTitle: 'Node.js Backend Geliştirme Kursu',
        metaDescription: 'Node.js, Express ve MongoDB ile güçlü backend API\'leri geliştirin.',
        keywords: 'nodejs,express,mongodb,backend,api',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Python ile Veri Bilimi',
        slug: 'python-ile-veri-bilimi',
        description: 'Python, Pandas ve Scikit-learn ile veri analizi ve makine öğrenmesi.',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
        price: 499.99,
        currency: 'TRY',
        duration: 1500, // 25 hours
        level: CourseLevel.BEGINNER,
        language: 'tr',
        instructorId: instructor.id,
        isPublished: false, // Pending approval
        metaTitle: 'Python ile Veri Bilimi Kursu',
        metaDescription: 'Python, Pandas ve Scikit-learn ile veri analizi ve makine öğrenmesi.',
        keywords: 'python,pandas,scikit-learn,data-science,machine-learning',
      },
    }),
  ]);

  console.log('📚 Courses created');

  // Create sections and lessons for first course
  const reactCourse = courses[0];
  const sections = await Promise.all([
    prisma.section.create({
      data: {
        title: 'React Temelleri',
        description: 'React\'in temel kavramları ve bileşen yapısı',
        order: 1,
        courseId: reactCourse.id,
      },
    }),
    prisma.section.create({
      data: {
        title: 'State ve Props Yönetimi',
        description: 'React\'te state ve props kullanımı',
        order: 2,
        courseId: reactCourse.id,
      },
    }),
    prisma.section.create({
      data: {
        title: 'Hooks ve Modern React',
        description: 'React Hooks ve modern React patterns',
        order: 3,
        courseId: reactCourse.id,
      },
    }),
  ]);

  console.log('📖 Sections created');

  // Create lessons for first section
  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'React Nedir?',
        description: 'React kütüphanesinin tanıtımı ve avantajları',
        order: 1,
        duration: 900, // 15 minutes
        sectionId: sections[0].id,
        isPublished: true,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'İlk React Uygulaması',
        description: 'Create React App ile ilk uygulamayı oluşturma',
        order: 2,
        duration: 1200, // 20 minutes
        sectionId: sections[0].id,
        isPublished: true,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'JSX Syntax',
        description: 'JSX kullanarak React bileşenleri yazma',
        order: 3,
        duration: 1800, // 30 minutes
        sectionId: sections[0].id,
        isPublished: true,
      },
    }),
  ]);

  console.log('🎬 Lessons created');

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: students[0].id,
        totalAmount: 299.99,
        currency: 'TRY',
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        paymentStatus: 'PAID',
        paidAt: new Date(),
      },
    }),
    prisma.order.create({
      data: {
        userId: students[1].id,
        totalAmount: 399.99,
        currency: 'TRY',
        status: 'COMPLETED',
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PAID',
        paidAt: new Date(),
      },
    }),
  ]);

  console.log('💰 Orders created');

  // Create order items
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        courseId: courses[0].id,
        price: 299.99,
        currency: 'TRY',
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        courseId: courses[1].id,
        price: 399.99,
        currency: 'TRY',
      },
    }),
  ]);

  console.log('🛒 Order items created');

  // Create access grants
  await Promise.all([
    prisma.accessGrant.create({
      data: {
        userId: students[0].id,
        courseId: courses[0].id,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    }),
    prisma.accessGrant.create({
      data: {
        userId: students[1].id,
        courseId: courses[1].id,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    }),
  ]);

  console.log('🔑 Access grants created');

  // Create sample device enrollment requests
  await Promise.all([
    prisma.deviceEnrollRequest.create({
      data: {
        userId: students[0].id,
        deviceName: 'iPhone 14',
        platform: 'iOS',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        status: 'PENDING',
        requestToken: 'req_' + Math.random().toString(36).substr(2, 9),
      },
    }),
    prisma.deviceEnrollRequest.create({
      data: {
        userId: students[1].id,
        deviceName: 'Samsung Galaxy S23',
        platform: 'Android',
        userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S918B)',
        status: 'PENDING',
        requestToken: 'req_' + Math.random().toString(36).substr(2, 9),
      },
    }),
  ]);

  console.log('📱 Device enrollment requests created');

  // Create sample analytics events
  await Promise.all([
    prisma.analyticsEvent.create({
      data: {
        userId: students[0].id,
        eventType: 'PAGE_VIEW',
        eventData: { page: '/courses/react-ile-modern-web-gelistirme' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    }),
    prisma.analyticsEvent.create({
      data: {
        userId: students[1].id,
        eventType: 'COURSE_VIEW',
        eventData: { courseId: courses[1].id, courseTitle: courses[1].title },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    }),
  ]);

  console.log('📊 Analytics events created');

  // Create sample user sessions
  await Promise.all([
    prisma.userSession.create({
      data: {
        userId: students[0].id,
        sessionId: 'sess_' + Math.random().toString(36).substr(2, 9),
        isActive: true,
        startedAt: new Date(),
        lastActivity: new Date(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    }),
    prisma.userSession.create({
      data: {
        userId: students[1].id,
        sessionId: 'sess_' + Math.random().toString(36).substr(2, 9),
        isActive: true,
        startedAt: new Date(),
        lastActivity: new Date(),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    }),
  ]);

  console.log('🔄 User sessions created');

  // Create sample course views
  await Promise.all([
    prisma.courseView.create({
      data: {
        courseId: courses[0].id,
        userId: students[0].id,
        viewType: 'COURSE_PAGE_VIEW',
        duration: 300, // 5 minutes
        progress: 25.0,
      },
    }),
    prisma.courseView.create({
      data: {
        courseId: courses[1].id,
        userId: students[1].id,
        viewType: 'COURSE_PAGE_VIEW',
        duration: 450, // 7.5 minutes
        progress: 40.0,
      },
    }),
  ]);

  console.log('👁️ Course views created');

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${students.length} students, ${courses.length} courses, ${sections.length} sections, ${lessons.length} lessons`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
