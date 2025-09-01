import { PrismaClient, UserRole, CourseLevel } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
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
  const instructorPassword = await hash('instructor123', 12);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@lms.com' },
    update: {},
    create: {
      email: 'instructor@lms.com',
      firstName: 'John',
      lastName: 'Doe',
      password: instructorPassword,
      role: UserRole.INSTRUCTOR,
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      bio: 'Experienced instructor with 10+ years of teaching experience',
    },
  });

  // Create sample student
  const studentPassword = await hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@lms.com' },
    update: {},
    create: {
      email: 'student@lms.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: studentPassword,
      role: UserRole.STUDENT,
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create sample course
  const course = await prisma.course.upsert({
    where: { slug: 'web-development-basics' },
    update: {},
    create: {
      title: 'Web Development Basics',
      slug: 'web-development-basics',
      description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript',
      price: 99.99,
      currency: 'TRY',
      duration: 480, // 8 hours
      level: CourseLevel.BEGINNER,
      language: 'tr',
      instructorId: instructor.id,
      isPublished: true,
      metaTitle: 'Web Development Basics - Learn HTML, CSS, JavaScript',
      metaDescription: 'Start your web development journey with this comprehensive course',
    },
  });

  // Create course sections
  const section1 = await prisma.section.create({
    data: {
      title: 'HTML Fundamentals',
      description: 'Learn the basics of HTML markup',
      order: 1,
      courseId: course.id,
      isPublished: true,
    },
  });

  const section2 = await prisma.section.create({
    data: {
      title: 'CSS Styling',
      description: 'Style your HTML with CSS',
      order: 2,
      courseId: course.id,
      isPublished: true,
    },
  });

  // Create sample lessons
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Introduction to HTML',
        description: 'What is HTML and why it matters',
        duration: 600, // 10 minutes
        order: 1,
        sectionId: section1.id,
        isPublished: true,
      },
      {
        title: 'HTML Tags and Elements',
        description: 'Common HTML tags and their usage',
        duration: 900, // 15 minutes
        order: 2,
        sectionId: section1.id,
        isPublished: true,
      },
      {
        title: 'CSS Introduction',
        description: 'What is CSS and how to use it',
        duration: 600, // 10 minutes
        order: 1,
        sectionId: section2.id,
        isPublished: true,
      },
    ],
  });

  // Create sample site settings
  await prisma.siteSetting.upsert({
    where: { key: 'site_name' },
    update: {},
    create: {
      key: 'site_name',
      value: 'LMS Platform',
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: 'site_description' },
    update: {},
    create: {
      key: 'site_description',
      value: 'Modern Learning Management System',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: ${admin.email}`);
  console.log(`👨‍🏫 Instructor: ${instructor.email}`);
  console.log(`👩‍🎓 Student: ${student.email}`);
  console.log(`📚 Course: ${course.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
