import { PrismaService } from '../prisma/prisma.service';
import { AdminWebSocketGateway } from '../websocket/websocket.module';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly webSocketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, webSocketGateway: AdminWebSocketGateway);
    trackPageView(userId: string | null, page: string, metadata?: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        eventType: import("@prisma/client").$Enums.AnalyticsEventType;
        eventData: import("@prisma/client/runtime/library").JsonValue;
    }>;
    trackCourseView(userId: string | null, courseId: string, viewType: string): Promise<{
        event: {
            id: string;
            createdAt: Date;
            userId: string | null;
            userAgent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            eventType: import("@prisma/client").$Enums.AnalyticsEventType;
            eventData: import("@prisma/client/runtime/library").JsonValue;
        };
        courseView: {
            id: string;
            duration: number | null;
            createdAt: Date;
            progress: number | null;
            userId: string | null;
            courseId: string;
            viewType: import("@prisma/client").$Enums.CourseViewType;
        };
    }>;
    trackVideoAction(userId: string | null, videoId: string, action: string, timestamp?: number): Promise<{
        event: {
            id: string;
            createdAt: Date;
            userId: string | null;
            userAgent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            eventType: import("@prisma/client").$Enums.AnalyticsEventType;
            eventData: import("@prisma/client/runtime/library").JsonValue;
        };
        videoAnalytics: {
            lessonId: string | null;
            id: string;
            duration: number | null;
            createdAt: Date;
            userId: string | null;
            timestamp: number | null;
            videoId: string;
            action: import("@prisma/client").$Enums.VideoAction;
        };
    }>;
    trackUserSession(userId: string, sessionId: string, deviceId?: string, ipAddress?: string): Promise<{
        id: string;
        isActive: boolean;
        userId: string;
        userAgent: string | null;
        sessionId: string;
        startedAt: Date;
        lastActivity: Date;
        ipAddress: string | null;
        deviceId: string | null;
    }>;
    updateSessionActivity(sessionId: string): Promise<{
        id: string;
        isActive: boolean;
        userId: string;
        userAgent: string | null;
        sessionId: string;
        startedAt: Date;
        lastActivity: Date;
        ipAddress: string | null;
        deviceId: string | null;
    }>;
    getRealTimeDashboardData(): Promise<{
        activeUsers: number;
        recentActivity: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            userAgent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            eventType: import("@prisma/client").$Enums.AnalyticsEventType;
            eventData: import("@prisma/client/runtime/library").JsonValue;
        })[];
        courseViews: ({
            user: {
                firstName: string;
                lastName: string;
            } | null;
            course: {
                title: string;
                slug: string;
            };
        } & {
            id: string;
            duration: number | null;
            createdAt: Date;
            progress: number | null;
            userId: string | null;
            courseId: string;
            viewType: import("@prisma/client").$Enums.CourseViewType;
        })[];
        videoActions: ({
            user: {
                firstName: string;
                lastName: string;
            } | null;
            video: {
                title: string;
            };
        } & {
            lessonId: string | null;
            id: string;
            duration: number | null;
            createdAt: Date;
            userId: string | null;
            timestamp: number | null;
            videoId: string;
            action: import("@prisma/client").$Enums.VideoAction;
        })[];
        timestamp: Date;
    }>;
    getAnalyticsSummary(period?: 'day' | 'week' | 'month'): Promise<{
        period: "week" | "month" | "day";
        totalEvents: number;
        uniqueUsers: number;
        courseViews: number;
        videoActions: number;
        startDate: Date;
        endDate: Date;
    }>;
}
