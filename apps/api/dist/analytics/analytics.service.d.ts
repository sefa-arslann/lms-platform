import { PrismaService } from '../prisma/prisma.service';
import { AdminWebSocketGateway } from '../websocket/websocket.module';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly webSocketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, webSocketGateway: AdminWebSocketGateway);
    trackPageView(userId: string | null, page: string, metadata?: any): unknown;
    trackCourseView(userId: string | null, courseId: string, viewType: string): unknown;
    trackVideoAction(userId: string | null, videoId: string, action: string, timestamp?: number): unknown;
    trackUserSession(userId: string, sessionId: string, deviceId?: string, ipAddress?: string): unknown;
    updateSessionActivity(sessionId: string): unknown;
    getRealTimeDashboardData(): unknown;
    getAnalyticsSummary(period?: 'day' | 'week' | 'month'): unknown;
}
