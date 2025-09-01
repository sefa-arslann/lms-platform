import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    trackPageView(data: {
        userId?: string;
        page: string;
        metadata?: any;
    }): unknown;
    trackCourseView(data: {
        userId?: string;
        courseId: string;
        viewType: string;
    }): unknown;
    trackVideoAction(data: {
        userId?: string;
        videoId: string;
        action: string;
        timestamp?: number;
    }): unknown;
    trackSession(data: {
        userId: string;
        sessionId: string;
        deviceId?: string;
        ipAddress?: string;
    }): unknown;
    updateSessionActivity(data: {
        sessionId: string;
    }): unknown;
    getRealTimeData(): unknown;
    getAnalyticsSummary(period?: 'day' | 'week' | 'month'): unknown;
}
