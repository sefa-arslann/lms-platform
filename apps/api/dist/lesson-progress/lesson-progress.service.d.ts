import { PrismaService } from '../prisma/prisma.service';
export declare class LessonProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getLessonProgress(userId: string, lessonId: string): Promise<({
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                    description: string;
                    duration: number;
                    isPublished: boolean;
                    thumbnail: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    currency: string;
                    level: import("@prisma/client").$Enums.CourseLevel;
                    language: string;
                    instructorId: string;
                    keywords: string | null;
                };
            } & {
                order: number;
                id: string;
                title: string;
                description: string | null;
                duration: number;
                isPublished: boolean;
                createdAt: Date;
                updatedAt: Date;
                courseId: string;
                totalLessons: number;
            };
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            videoUrl: string | null;
            duration: number;
            sectionId: string;
            isPublished: boolean;
            videoKey: string | null;
            thumbnail: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        };
    } & {
        lessonId: string;
        id: string;
        duration: number;
        createdAt: Date;
        updatedAt: Date;
        progress: number;
        userId: string;
        completed: boolean;
        lastPosition: number;
        completedAt: Date | null;
    }) | null>;
    updateLessonProgress(userId: string, lessonId: string, data: {
        progress: number;
        duration: number;
        lastPosition: number;
        completed?: boolean;
    }): Promise<{
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                    description: string;
                    duration: number;
                    isPublished: boolean;
                    thumbnail: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    currency: string;
                    level: import("@prisma/client").$Enums.CourseLevel;
                    language: string;
                    instructorId: string;
                    keywords: string | null;
                };
            } & {
                order: number;
                id: string;
                title: string;
                description: string | null;
                duration: number;
                isPublished: boolean;
                createdAt: Date;
                updatedAt: Date;
                courseId: string;
                totalLessons: number;
            };
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            videoUrl: string | null;
            duration: number;
            sectionId: string;
            isPublished: boolean;
            videoKey: string | null;
            thumbnail: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        };
    } & {
        lessonId: string;
        id: string;
        duration: number;
        createdAt: Date;
        updatedAt: Date;
        progress: number;
        userId: string;
        completed: boolean;
        lastPosition: number;
        completedAt: Date | null;
    }>;
    completeLesson(userId: string, lessonId: string): Promise<{
        lessonId: string;
        id: string;
        duration: number;
        createdAt: Date;
        updatedAt: Date;
        progress: number;
        userId: string;
        completed: boolean;
        lastPosition: number;
        completedAt: Date | null;
    }>;
    getCourseProgress(userId: string, courseId: string): Promise<{
        courseId: string;
        totalLessons: number;
        completedLessons: number;
        overallProgress: number;
        completionRate: number;
        totalDuration: number;
        sections: {
            id: string;
            title: string;
            order: number;
            lessons: {
                id: string;
                title: string;
                order: number;
                duration: number;
                progress: number;
                completed: boolean;
                lastPosition: number;
            }[];
        }[];
    }>;
    getCourseLessonsProgress(userId: string, courseId: string): Promise<{
        lessons: {
            lessonId: string;
            progress: number;
            completed: boolean;
            duration: number;
            lastPosition: number;
        }[];
        totalLessons: number;
    }>;
    getUserLearningStats(userId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        totalDuration: number;
        completionRate: number;
        recentActivity: ({
            lesson: {
                section: {
                    course: {
                        id: string;
                        title: string;
                        description: string;
                        duration: number;
                        isPublished: boolean;
                        thumbnail: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        slug: string;
                        metaTitle: string | null;
                        metaDescription: string | null;
                        price: import("@prisma/client/runtime/library").Decimal;
                        currency: string;
                        level: import("@prisma/client").$Enums.CourseLevel;
                        language: string;
                        instructorId: string;
                        keywords: string | null;
                    };
                } & {
                    order: number;
                    id: string;
                    title: string;
                    description: string | null;
                    duration: number;
                    isPublished: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    courseId: string;
                    totalLessons: number;
                };
            } & {
                order: number;
                id: string;
                title: string;
                description: string | null;
                videoUrl: string | null;
                duration: number;
                sectionId: string;
                isPublished: boolean;
                videoKey: string | null;
                thumbnail: string | null;
                subtitles: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
                isFree: boolean;
                resources: import("@prisma/client/runtime/library").JsonValue | null;
                videoType: string | null;
            };
        } & {
            lessonId: string;
            id: string;
            duration: number;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            userId: string;
            completed: boolean;
            lastPosition: number;
            completedAt: Date | null;
        })[];
    }>;
    getLastWatchedCourse(userId: string): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        thumbnail: string | null;
        duration: number;
        level: import("@prisma/client").$Enums.CourseLevel;
        instructorId: string;
        progress: number;
        completedLessons: number;
        totalLessons: number;
        lastAccessed: Date;
        lastLessonId: string;
        lastPosition: number;
        lastSectionId: string;
    } | null>;
    getAllLessonProgress(userId: string): Promise<({
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                    description: string;
                    duration: number;
                    isPublished: boolean;
                    thumbnail: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    currency: string;
                    level: import("@prisma/client").$Enums.CourseLevel;
                    language: string;
                    instructorId: string;
                    keywords: string | null;
                };
            } & {
                order: number;
                id: string;
                title: string;
                description: string | null;
                duration: number;
                isPublished: boolean;
                createdAt: Date;
                updatedAt: Date;
                courseId: string;
                totalLessons: number;
            };
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            videoUrl: string | null;
            duration: number;
            sectionId: string;
            isPublished: boolean;
            videoKey: string | null;
            thumbnail: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        };
    } & {
        lessonId: string;
        id: string;
        duration: number;
        createdAt: Date;
        updatedAt: Date;
        progress: number;
        userId: string;
        completed: boolean;
        lastPosition: number;
        completedAt: Date | null;
    })[]>;
    resetAllLessonProgress(userId: string): Promise<{
        message: string;
        deletedCount: number;
        userId: string;
    }>;
}
