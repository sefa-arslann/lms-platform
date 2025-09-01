"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessGrantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const lesson_progress_service_1 = require("../lesson-progress/lesson-progress.service");
let AccessGrantsService = class AccessGrantsService {
    prisma;
    lessonProgressService;
    constructor(prisma, lessonProgressService) {
        this.prisma = prisma;
        this.lessonProgressService = lessonProgressService;
    }
    async create(createAccessGrantDto) {
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
    async findOne(id) {
        return this.prisma.accessGrant.findUnique({
            where: { id },
            include: {
                user: true,
                course: true,
                order: true,
            },
        });
    }
    async checkLessonAccess(userId, lessonId) {
        try {
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
            const accessGrant = await this.prisma.accessGrant.findFirst({
                where: {
                    userId,
                    courseId: lesson.section.course.id,
                    isActive: true,
                },
            });
            return !!accessGrant;
        }
        catch (error) {
            console.error(`Error checking lesson access: ${error.message}`);
            return false;
        }
    }
    async getUserCourses(userId) {
        try {
            console.log(`🔍 Fetching courses for user: ${userId}`);
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
            const coursesPromises = accessGrants.map(async (accessGrant) => {
                const course = accessGrant.course;
                const order = accessGrant.order;
                const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
                const totalDuration = course.sections.reduce((total, section) => total + section.lessons.reduce((sectionTotal, lesson) => sectionTotal + (lesson.duration || 0), 0), 0);
                let completedLessons = 0;
                let progress = 0;
                try {
                    const courseProgress = await this.lessonProgressService.getCourseProgress(userId, course.id);
                    completedLessons = courseProgress.completedLessons;
                    progress = courseProgress.overallProgress;
                }
                catch (error) {
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
                    duration: totalDuration,
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
            const courses = await Promise.all(coursesPromises);
            console.log(`✅ Transformed ${courses.length} courses with progress data`);
            return courses;
        }
        catch (error) {
            console.error('❌ Error in getUserCourses:', error);
            throw error;
        }
    }
};
exports.AccessGrantsService = AccessGrantsService;
exports.AccessGrantsService = AccessGrantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        lesson_progress_service_1.LessonProgressService])
], AccessGrantsService);
//# sourceMappingURL=access-grants.service.js.map