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
    getUserActivities(period: 'today' | 'week' | 'month'): unknown;
    getDailyStats(period: 'today' | 'week' | 'month'): unknown;
    getWeeklyStats(period: 'today' | 'week' | 'month'): unknown;
    getDetailedQuestions(period: 'today' | 'week' | 'month'): unknown;
    getDetailedNotes(period: 'today' | 'week' | 'month'): unknown;
    getLessonActivity(lessonId: string): unknown;
}
