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
exports.LessonProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LessonProgressService = class LessonProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLessonProgress(userId, lessonId) {
        try {
            const progress = await this.prisma.lessonProgress.findUnique({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId,
                    },
                },
                include: {
                    lesson: {
                        include: {
                            section: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                },
            });
            return progress;
        }
        catch (error) {
            console.error('❌ Error getting lesson progress:', error);
            throw error;
        }
    }
    async updateLessonProgress(userId, lessonId, data) {
        try {
            console.log(`📊 Updating lesson progress for user ${userId}, lesson ${lessonId}:`, data);
            const existingProgress = await this.prisma.lessonProgress.findUnique({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId,
                    },
                },
            });
            if (existingProgress && existingProgress.progress > data.progress) {
                console.log(`📊 Progress not updated: existing (${existingProgress.progress}%) > new (${data.progress}%)`);
                const updatedProgress = await this.prisma.lessonProgress.update({
                    where: {
                        userId_lessonId: {
                            userId,
                            lessonId,
                        },
                    },
                    data: {
                        lastPosition: data.lastPosition,
                        updatedAt: new Date(),
                    },
                    include: {
                        lesson: {
                            include: {
                                section: {
                                    include: {
                                        course: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return updatedProgress;
            }
            const progress = await this.prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId,
                    },
                },
                update: {
                    progress: data.progress,
                    duration: data.duration,
                    lastPosition: data.lastPosition,
                    completed: data.completed || false,
                    completedAt: data.completed ? new Date() : null,
                    updatedAt: new Date(),
                },
                create: {
                    userId,
                    lessonId,
                    progress: data.progress,
                    duration: data.duration,
                    lastPosition: data.lastPosition,
                    completed: data.completed || false,
                    completedAt: data.completed ? new Date() : null,
                },
                include: {
                    lesson: {
                        include: {
                            section: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                },
            });
            console.log(`✅ Lesson progress updated successfully to ${data.progress}%`);
            return progress;
        }
        catch (error) {
            console.error('❌ Error updating lesson progress:', error);
            throw error;
        }
    }
    async completeLesson(userId, lessonId) {
        try {
            console.log(`🎯 Marking lesson ${lessonId} as completed for user ${userId}`);
            const progress = await this.prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId,
                    },
                },
                update: {
                    completed: true,
                    progress: 100,
                    completedAt: new Date(),
                    updatedAt: new Date(),
                },
                create: {
                    userId,
                    lessonId,
                    completed: true,
                    progress: 100,
                    duration: 0,
                    lastPosition: 0,
                    completedAt: new Date(),
                },
            });
            console.log(`✅ Lesson marked as completed`);
            return progress;
        }
        catch (error) {
            console.error('❌ Error completing lesson:', error);
            throw error;
        }
    }
    async getCourseProgress(userId, courseId) {
        try {
            console.log(`📚 Getting course progress for user ${userId}, course ${courseId}`);
            const course = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: {
                    sections: {
                        include: {
                            lessons: {
                                include: {
                                    progress: {
                                        where: { userId },
                                    },
                                },
                                orderBy: { order: 'asc' },
                            },
                        },
                        orderBy: { order: 'asc' },
                    },
                },
            });
            if (!course) {
                throw new Error('Course not found');
            }
            let totalLessons = 0;
            let completedLessons = 0;
            let totalProgress = 0;
            let totalDuration = 0;
            course.sections.forEach(section => {
                section.lessons.forEach(lesson => {
                    totalLessons++;
                    const userProgress = lesson.progress[0];
                    if (userProgress) {
                        totalProgress += userProgress.progress || 0;
                        totalDuration += userProgress.duration || 0;
                        if (userProgress.completed) {
                            completedLessons++;
                        }
                    }
                });
            });
            const overallProgress = totalLessons > 0 ? Math.round(totalProgress / totalLessons) : 0;
            const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return {
                courseId,
                totalLessons,
                completedLessons,
                overallProgress,
                completionRate,
                totalDuration,
                sections: course.sections.map(section => ({
                    id: section.id,
                    title: section.title,
                    order: section.order,
                    lessons: section.lessons.map(lesson => ({
                        id: lesson.id,
                        title: lesson.title,
                        order: lesson.order,
                        duration: lesson.duration,
                        progress: lesson.progress[0]?.progress || 0,
                        completed: lesson.progress[0]?.completed || false,
                        lastPosition: lesson.progress[0]?.lastPosition || 0,
                    })),
                })),
            };
        }
        catch (error) {
            console.error('❌ Error getting course progress:', error);
            throw error;
        }
    }
    async getCourseLessonsProgress(userId, courseId) {
        try {
            console.log(`📚 Getting all lessons progress for user ${userId}, course ${courseId}`);
            const course = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: {
                    sections: {
                        include: {
                            lessons: {
                                include: {
                                    progress: {
                                        where: { userId },
                                    },
                                },
                                orderBy: { order: 'asc' },
                            },
                        },
                        orderBy: { order: 'asc' },
                    },
                },
            });
            if (!course) {
                throw new Error('Course not found');
            }
            const lessonsProgress = [];
            course.sections.forEach(section => {
                section.lessons.forEach(lesson => {
                    const userProgress = lesson.progress[0];
                    lessonsProgress.push({
                        lessonId: lesson.id,
                        progress: userProgress ? userProgress.progress : 0,
                        completed: userProgress ? userProgress.completed : false,
                        duration: userProgress ? userProgress.duration : 0,
                        lastPosition: userProgress ? userProgress.lastPosition : 0,
                    });
                });
            });
            console.log(`✅ Found ${lessonsProgress.length} lessons with progress data`);
            return {
                lessons: lessonsProgress,
                totalLessons: lessonsProgress.length,
            };
        }
        catch (error) {
            console.error('❌ Error getting course lessons progress:', error);
            throw error;
        }
    }
    async getUserLearningStats(userId) {
        try {
            console.log(`📊 Getting learning stats for user ${userId}`);
            const stats = await this.prisma.lessonProgress.groupBy({
                by: ['completed'],
                where: { userId },
                _count: {
                    id: true,
                },
                _sum: {
                    duration: true,
                },
            });
            const totalLessons = stats.reduce((sum, stat) => sum + stat._count.id, 0);
            const completedLessons = stats.find(stat => stat.completed)?._count.id || 0;
            const totalDuration = stats.reduce((sum, stat) => sum + (stat._sum.duration || 0), 0);
            const recentActivity = await this.prisma.lessonProgress.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                take: 10,
                include: {
                    lesson: {
                        include: {
                            section: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                },
            });
            return {
                totalLessons,
                completedLessons,
                totalDuration,
                completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
                recentActivity,
            };
        }
        catch (error) {
            console.error('❌ Error getting user learning stats:', error);
            throw error;
        }
    }
    async getLastWatchedCourse(userId) {
        try {
            console.log(`📊 Getting last watched course for user ${userId}`);
            const lastProgress = await this.prisma.lessonProgress.findFirst({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                include: {
                    lesson: {
                        include: {
                            section: {
                                include: {
                                    course: {
                                        include: {
                                            sections: {
                                                include: {
                                                    lessons: {
                                                        include: {
                                                            progress: {
                                                                where: { userId },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!lastProgress) {
                return null;
            }
            const course = lastProgress.lesson.section.course;
            let totalLessons = 0;
            let completedLessons = 0;
            let totalDuration = 0;
            course.sections.forEach(section => {
                if (section.isPublished) {
                    section.lessons.forEach(lesson => {
                        if (lesson.isPublished) {
                            totalLessons++;
                            totalDuration += lesson.duration;
                            const userProgress = lesson.progress[0];
                            if (userProgress && userProgress.completed) {
                                completedLessons++;
                            }
                        }
                    });
                }
            });
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return {
                id: course.id,
                slug: course.slug,
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                duration: totalDuration,
                level: course.level,
                instructorId: course.instructorId,
                progress,
                completedLessons,
                totalLessons,
                lastAccessed: lastProgress.updatedAt,
                lastLessonId: lastProgress.lessonId,
                lastPosition: lastProgress.lastPosition,
                lastSectionId: lastProgress.lesson.sectionId,
            };
        }
        catch (error) {
            console.error('❌ Error getting last watched course:', error);
            throw error;
        }
    }
    async getAllLessonProgress(userId) {
        try {
            console.log(`📊 Getting all lesson progress for user ${userId}`);
            const allProgress = await this.prisma.lessonProgress.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    lesson: {
                        include: {
                            section: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });
            console.log(`📊 Found ${allProgress.length} lesson progress records for user ${userId}`);
            return allProgress;
        }
        catch (error) {
            console.error('❌ Error getting all lesson progress:', error);
            throw error;
        }
    }
    async resetAllLessonProgress(userId) {
        try {
            console.log(`🗑️ Resetting all lesson progress for user ${userId}`);
            const deleteResult = await this.prisma.lessonProgress.deleteMany({
                where: {
                    userId: userId,
                },
            });
            console.log(`🗑️ Deleted ${deleteResult.count} lesson progress records for user ${userId}`);
            return {
                message: 'All lesson progress reset successfully',
                deletedCount: deleteResult.count,
                userId: userId
            };
        }
        catch (error) {
            console.error('❌ Error resetting all lesson progress:', error);
            throw error;
        }
    }
};
exports.LessonProgressService = LessonProgressService;
exports.LessonProgressService = LessonProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonProgressService);
//# sourceMappingURL=lesson-progress.service.js.map