import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminWebSocketGateway } from '../websocket/websocket.module';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketGateway: AdminWebSocketGateway,
  ) {}

  // Track page view
  async trackPageView(userId: string | null, page: string, metadata?: any) {
    try {
      const event = await this.prisma.analyticsEvent.create({
        data: {
          userId,
          eventType: 'PAGE_VIEW',
          eventData: { page, ...metadata },
          metadata: { timestamp: new Date() },
        },
      });

      // Send real-time update to admin dashboard
      this.webSocketGateway.sendDashboardUpdate({
        type: 'page-view',
        data: event,
      });

      return event;
    } catch (error) {
      this.logger.error('Error tracking page view:', error);
      throw error;
    }
  }

  // Track course view
  async trackCourseView(userId: string | null, courseId: string, viewType: string) {
    try {
      const [event, courseView] = await Promise.all([
        this.prisma.analyticsEvent.create({
          data: {
            userId,
            eventType: 'COURSE_VIEW',
            eventData: { courseId, viewType },
            metadata: { timestamp: new Date() },
          },
        }),
        this.prisma.courseView.create({
          data: {
            courseId,
            userId,
            viewType: viewType as any,
            createdAt: new Date(),
          },
        }),
      ]);

      // Send real-time update
      this.webSocketGateway.sendCourseViewUpdate({
        type: 'course-view',
        data: courseView,
      });

      return { event, courseView };
    } catch (error) {
      this.logger.error('Error tracking course view:', error);
      throw error;
    }
  }

  // Track video action
  async trackVideoAction(userId: string | null, videoId: string, action: string, timestamp?: number) {
    try {
      const [event, videoAnalytics] = await Promise.all([
        this.prisma.analyticsEvent.create({
          data: {
            userId,
            eventType: 'VIDEO_PLAY',
            eventData: { videoId, action, timestamp },
            metadata: { timestamp: new Date() },
          },
        }),
        this.prisma.videoAnalytics.create({
          data: {
            videoId,
            userId,
            action: action as any,
            timestamp: timestamp || 0,
            createdAt: new Date(),
          },
        }),
      ]);

      // Send real-time update
      this.webSocketGateway.sendVideoAnalyticsUpdate({
        type: 'video-action',
        data: videoAnalytics,
      });

      return { event, videoAnalytics };
    } catch (error) {
      this.logger.error('Error tracking video action:', error);
      throw error;
    }
  }

  // Track user session
  async trackUserSession(userId: string, sessionId: string, deviceId?: string, ipAddress?: string) {
    try {
      const session = await this.prisma.userSession.create({
        data: {
          userId,
          sessionId,
          deviceId,
          ipAddress,
          startedAt: new Date(),
          lastActivity: new Date(),
        },
      });

      // Send real-time update
      this.webSocketGateway.sendUserActivityUpdate({
        type: 'session-start',
        data: session,
      });

      return session;
    } catch (error) {
      this.logger.error('Error tracking user session:', error);
      throw error;
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId: string) {
    try {
      const session = await this.prisma.userSession.update({
        where: { sessionId },
        data: { lastActivity: new Date() },
      });

      // Send real-time update
      this.webSocketGateway.sendUserActivityUpdate({
        type: 'session-activity',
        data: session,
      });

      return session;
    } catch (error) {
      this.logger.error('Error updating session activity:', error);
      throw error;
    }
  }

  // Get real-time dashboard data
  async getRealTimeDashboardData() {
    try {
      const [
        activeUsers,
        recentActivity,
        courseViews,
        videoActions,
      ] = await Promise.all([
        // Active users (last 5 minutes)
        this.prisma.userSession.count({
          where: {
            lastActivity: {
              gte: new Date(Date.now() - 5 * 60 * 1000),
            },
            isActive: true,
          },
        }),
        // Recent activity (last 10 minutes)
        this.prisma.analyticsEvent.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 10 * 60 * 1000),
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
        // Recent course views
        this.prisma.courseView.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 10 * 60 * 1000),
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            course: {
              select: {
                title: true,
                slug: true,
              },
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        // Recent video actions
        this.prisma.videoAnalytics.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 10 * 60 * 1000),
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            video: {
              select: {
                title: true,
              },
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
      ]);

      return {
        activeUsers,
        recentActivity,
        courseViews,
        videoActions,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting real-time dashboard data:', error);
      throw error;
    }
  }

  // Get analytics summary
  async getAnalyticsSummary(period: 'day' | 'week' | 'month' = 'day') {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      const [
        totalEvents,
        uniqueUsers,
        courseViews,
        videoActions,
      ] = await Promise.all([
        // Total events
        this.prisma.analyticsEvent.count({
          where: { createdAt: { gte: startDate } },
        }),
        // Unique users
        this.prisma.analyticsEvent.groupBy({
          by: ['userId'],
          where: { 
            createdAt: { gte: startDate },
            userId: { not: null },
          },
          _count: { userId: true },
        }),
        // Course views
        this.prisma.courseView.count({
          where: { createdAt: { gte: startDate } },
        }),
        // Video actions
        this.prisma.videoAnalytics.count({
          where: { createdAt: { gte: startDate } },
        }),
      ]);

      return {
        period,
        totalEvents,
        uniqueUsers: uniqueUsers.length,
        courseViews,
        videoActions,
        startDate,
        endDate: now,
      };
    } catch (error) {
      this.logger.error('Error getting analytics summary:', error);
      throw error;
    }
  }
}
