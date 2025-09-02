import { PrismaService } from '../prisma/prisma.service';
export interface DailyStats {
    date: string;
    totalWatched: number;
    totalCompleted: number;
    totalQuestions: number;
    totalNotes: number;
    activeUsers: number;
}
export interface WeeklyStats {
    week: string;
    totalWatched: number;
    totalCompleted: number;
    totalQuestions: number;
    totalNotes: number;
    activeUsers: number;
    averageProgress: number;
}
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserActivities(period: 'today' | 'week' | 'month'): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        todayWatched: number;
        todayCompleted: number;
        thisWeekWatched: number;
        thisWeekCompleted: number;
        totalQuestions: number;
        totalNotes: number;
        lastActive: string;
        totalProgress: number;
    }[]>;
    getDailyStats(period: 'today' | 'week' | 'month'): Promise<DailyStats[]>;
    getWeeklyStats(period: 'today' | 'week' | 'month'): Promise<WeeklyStats[]>;
    getDetailedQuestions(period: 'today' | 'week' | 'month'): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
            id: string;
            title: string;
        } | null;
        answers: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            isAccepted: boolean;
            questionId: string;
        })[];
    } & {
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    })[]>;
    getDetailedNotes(period: 'today' | 'week' | 'month'): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
            id: string;
            title: string;
        };
    } & {
        lessonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        timestamp: number | null;
        isPublic: boolean;
    })[]>;
    getLessonActivity(lessonId: string): Promise<({
        section: {
            course: {
                id: string;
                title: string;
            };
        };
        progress: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
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
        notes: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            lessonId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            timestamp: number | null;
            isPublic: boolean;
        })[];
        questions: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            answers: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    role: import("@prisma/client").$Enums.UserRole;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                userId: string;
                isAccepted: boolean;
                questionId: string;
            })[];
        } & {
            lessonId: string | null;
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            courseId: string;
            isPinned: boolean;
            isAccepted: boolean;
            acceptedAnswerId: string | null;
        })[];
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
    }) | null>;
}
