import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getUserActivities(period?: 'today' | 'week' | 'month'): unknown;
    getDailyStats(period?: 'today' | 'week' | 'month'): unknown;
    getWeeklyStats(period?: 'today' | 'week' | 'month'): unknown;
    getDetailedQuestions(period?: 'today' | 'week' | 'month'): unknown;
    getDetailedNotes(period?: 'today' | 'week' | 'month'): unknown;
    getLessonActivity(lessonId: string): unknown;
}
