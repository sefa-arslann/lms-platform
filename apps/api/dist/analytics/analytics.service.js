"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const websocket_module_1 = require("../websocket/websocket.module");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    prisma;
    webSocketGateway;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(prisma, webSocketGateway) {
        this.prisma = prisma;
        this.webSocketGateway = webSocketGateway;
    }
    async trackPageView(userId, page, metadata) {
        try {
            const event = await this.prisma.analyticsEvent.create({
                data: {
                    userId,
                    eventType: 'PAGE_VIEW',
                    eventData: { page, ...metadata },
                    metadata: { timestamp: new Date() },
                },
            });
            this.webSocketGateway.sendDashboardUpdate({
                type: 'page-view',
                data: event,
            });
            return event;
        }
        catch (error) {
            this.logger.error('Error tracking page view:', error);
            throw error;
        }
    }
    async trackCourseView(userId, courseId, viewType) {
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
                        viewType: viewType,
                        createdAt: new Date(),
                    },
                }),
            ]);
            this.webSocketGateway.sendCourseViewUpdate({
                type: 'course-view',
                data: courseView,
            });
            return { event, courseView };
        }
        catch (error) {
            this.logger.error('Error tracking course view:', error);
            throw error;
        }
    }
    async trackVideoAction(userId, videoId, action, timestamp) {
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
                        action: action,
                        timestamp: timestamp || 0,
                        createdAt: new Date(),
                    },
                }),
            ]);
            this.webSocketGateway.sendVideoAnalyticsUpdate({
                type: 'video-action',
                data: videoAnalytics,
            });
            return { event, videoAnalytics };
        }
        catch (error) {
            this.logger.error('Error tracking video action:', error);
            throw error;
        }
    }
    async trackUserSession(userId, sessionId, deviceId, ipAddress) {
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
            this.webSocketGateway.sendUserActivityUpdate({
                type: 'session-start',
                data: session,
            });
            return session;
        }
        catch (error) {
            this.logger.error('Error tracking user session:', error);
            throw error;
        }
    }
    async updateSessionActivity(sessionId) {
        try {
            const session = await this.prisma.userSession.update({
                where: { sessionId },
                data: { lastActivity: new Date() },
            });
            this.webSocketGateway.sendUserActivityUpdate({
                type: 'session-activity',
                data: session,
            });
            return session;
        }
        catch (error) {
            this.logger.error('Error updating session activity:', error);
            throw error;
        }
    }
    async getRealTimeDashboardData() {
        try {
            const [activeUsers, recentActivity, courseViews, videoActions,] = await Promise.all([
                this.prisma.userSession.count({
                    where: {
                        lastActivity: {
                            gte: new Date(Date.now() - 5 * 60 * 1000),
                        },
                        isActive: true,
                    },
                }),
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
        }
        catch (error) {
            this.logger.error('Error getting real-time dashboard data:', error);
            throw error;
        }
    }
    async getAnalyticsSummary(period = 'day') {
        try {
            const now = new Date();
            let startDate;
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
            const [totalEvents, uniqueUsers, courseViews, videoActions,] = await Promise.all([
                this.prisma.analyticsEvent.count({
                    where: { createdAt: { gte: startDate } },
                }),
                this.prisma.analyticsEvent.groupBy({
                    by: ['userId'],
                    where: {
                        createdAt: { gte: startDate },
                        userId: { not: null },
                    },
                    _count: { userId: true },
                }),
                this.prisma.courseView.count({
                    where: { createdAt: { gte: startDate } },
                }),
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
        }
        catch (error) {
            this.logger.error('Error getting analytics summary:', error);
            throw error;
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        websocket_module_1.AdminWebSocketGateway])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map