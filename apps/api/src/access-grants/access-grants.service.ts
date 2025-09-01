import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';

@Injectable()
export class AccessGrantsService {
  constructor(
    private prisma: PrismaService,
    private lessonProgressService: LessonProgressService
  ) {}

  async create(createAccessGrantDto: any) {
    return this.prisma.accessGrant.create({
      data: createAccessGrantDto,
    });
  }

  async findAll() {
    return this.prisma.accessGrant.findMany({
      include: {
        user: true,
        course: true,
        order: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.accessGrant.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
        order: true,
      },
    });
  }

  // Check if user has access to a specific lesson
  async checkLessonAccess(userId: string, lessonId: string): Promise<boolean> {
    try {
      // Get lesson with course info
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!lesson) {
        return false;
      }

      // Check if user has active access grant for this course
      const accessGrant = await this.prisma.accessGrant.findFirst({
        where: {
          userId,
          courseId: lesson.section.course.id,
          isActive: true,
        },
      });

      return !!accessGrant;
    } catch (error) {
      console.error(`Error checking lesson access: ${error.message}`);
      return false;
    }
  }

  async getUserCourses(userId: string) {
    try {
      console.log(`🔍 Fetching courses for user: ${userId}`);
      
      // Get active access grants with course details
      const accessGrants = await this.prisma.accessGrant.findMany({
        where: {
          userId,
          isActive: true,
        },
        include: {
          course: {
            include: {
              sections: {
                include: {
                  lessons: {
                    orderBy: { order: 'asc' }
                  }
                },
                orderBy: { order: 'asc' }
              },
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              purchasedAt: true,
              expiresAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`📊 Found ${accessGrants.length} active access grants`);

      // Transform data for frontend with async progress fetching
      const coursesPromises = accessGrants.map(async (accessGrant) => {
        const course = accessGrant.course;
        const order = accessGrant.order;
        
        // Calculate course progress and total duration
        const totalLessons = course.sections.reduce((total, section) => 
          total + section.lessons.length, 0
        );
        
        // Calculate total duration from lessons (in seconds)
        const totalDuration = course.sections.reduce((total, section) => 
          total + section.lessons.reduce((sectionTotal, lesson) => 
            sectionTotal + (lesson.duration || 0), 0
          ), 0
        );
        
        // Get real progress from LessonProgress service
        let completedLessons = 0;
        let progress = 0;
        
        try {
          const courseProgress = await this.lessonProgressService.getCourseProgress(userId, course.id);
          completedLessons = courseProgress.completedLessons;
          progress = courseProgress.overallProgress;
        } catch (error) {
          console.log(`⚠️ Could not get progress for course ${course.id}, using default values`);
          completedLessons = 0;
          progress = 0;
        }
        
        return {
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          duration: totalDuration, // Total duration from lessons in seconds
          level: course.level,
          instructor: course.instructor,
          progress,
          completedLessons,
          totalLessons,
          lastAccessed: new Date().toLocaleDateString('tr-TR'),
          expiresAt: order?.expiresAt || null,
          remainingTime: order?.expiresAt ? 
            new Date(order.expiresAt).getTime() - new Date().getTime() : null,
          orderNumber: order?.orderNumber || null,
          orderStatus: order?.status || null,
          accessGrantId: accessGrant.id,
          sections: course.sections
        };
      });

      // Wait for all promises to resolve
      const courses = await Promise.all(coursesPromises);

      console.log(`✅ Transformed ${courses.length} courses with progress data`);
      return courses;
    } catch (error) {
      console.error('❌ Error in getUserCourses:', error);
      throw error;
    }
  }
}
