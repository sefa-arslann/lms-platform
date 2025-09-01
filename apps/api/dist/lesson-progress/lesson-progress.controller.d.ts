import { LessonProgressService } from './lesson-progress.service';
export declare class LessonProgressController {
    private readonly lessonProgressService;
    constructor(lessonProgressService: LessonProgressService);
    getLessonProgress(lessonId: string, req: any): Promise<({
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
    updateLessonProgress(lessonId: string, updateData: {
        progress: number;
        duration: number;
        lastPosition: number;
        completed?: boolean;
    }, req: any): Promise<{
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
    completeLesson(lessonId: string, req: any): Promise<{
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
    getCourseProgress(courseId: string, req: any): Promise<{
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
    getCourseLessonsProgress(courseId: string, req: any): Promise<{
        lessons: {
            lessonId: string;
            progress: number;
            completed: boolean;
            duration: number;
            lastPosition: number;
        }[];
        totalLessons: number;
    }>;
    getUserLearningStats(req: any): Promise<{
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
    getLastWatchedCourse(req: any): Promise<{
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
    getAllLessonProgress(req: any): Promise<({
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
    resetAllLessonProgress(req: any): Promise<{
        message: string;
        deletedCount: number;
        userId: string;
    }>;
}
