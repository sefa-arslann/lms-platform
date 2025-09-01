import { ReportsService, DailyStats, WeeklyStats } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getUserActivities(period?: 'today' | 'week' | 'month'): Promise<{
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
    getDailyStats(period?: 'today' | 'week' | 'month'): Promise<DailyStats[]>;
    getWeeklyStats(period?: 'today' | 'week' | 'month'): Promise<WeeklyStats[]>;
    getDetailedQuestions(period?: 'today' | 'week' | 'month'): Promise<({
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
            userId: string;
            content: string;
            isAccepted: boolean;
            questionId: string;
        })[];
        lesson: {
            id: string;
            title: string;
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lessonId: string | null;
        title: string;
        content: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
        courseId: string;
    })[]>;
    getDetailedNotes(period?: 'today' | 'week' | 'month'): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        lesson: {
            id: string;
            title: string;
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lessonId: string;
        content: string;
        timestamp: number | null;
        isPublic: boolean;
    })[]>;
    getLessonActivity(lessonId: string): Promise<({
        progress: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            userId: string;
            lessonId: string;
            duration: number;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            lessonId: string;
            content: string;
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
                userId: string;
                content: string;
                isAccepted: boolean;
                questionId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            lessonId: string | null;
            title: string;
            content: string;
            isPinned: boolean;
            isAccepted: boolean;
            acceptedAnswerId: string | null;
            courseId: string;
        })[];
        section: {
            course: {
                id: string;
                title: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        title: string;
        description: string | null;
        videoUrl: string | null;
        order: number;
        sectionId: string;
        isPublished: boolean;
        videoKey: string | null;
        thumbnail: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }) | null>;
}
