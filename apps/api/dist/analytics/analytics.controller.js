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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async trackPageView(data) {
        return this.analyticsService.trackPageView(data.userId || null, data.page, data.metadata);
    }
    async trackCourseView(data) {
        return this.analyticsService.trackCourseView(data.userId || null, data.courseId, data.viewType);
    }
    async trackVideoAction(data) {
        return this.analyticsService.trackVideoAction(data.userId || null, data.videoId, data.action, data.timestamp);
    }
    async trackSession(data) {
        return this.analyticsService.trackUserSession(data.userId, data.sessionId, data.deviceId, data.ipAddress);
    }
    async updateSessionActivity(data) {
        return this.analyticsService.updateSessionActivity(data.sessionId);
    }
    async getRealTimeData() {
        return this.analyticsService.getRealTimeDashboardData();
    }
    async getAnalyticsSummary(period = 'day') {
        return this.analyticsService.getAnalyticsSummary(period);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)('track/page-view'),
    (0, swagger_1.ApiOperation)({ summary: 'Track page view' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Page view tracked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackPageView", null);
__decorate([
    (0, common_1.Post)('track/course-view'),
    (0, swagger_1.ApiOperation)({ summary: 'Track course view' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Course view tracked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackCourseView", null);
__decorate([
    (0, common_1.Post)('track/video-action'),
    (0, swagger_1.ApiOperation)({ summary: 'Track video action' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Video action tracked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackVideoAction", null);
__decorate([
    (0, common_1.Post)('track/session'),
    (0, swagger_1.ApiOperation)({ summary: 'Track user session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Session tracked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackSession", null);
__decorate([
    (0, common_1.Post)('track/session-activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Update session activity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session activity updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "updateSessionActivity", null);
__decorate([
    (0, common_1.Get)('admin/real-time'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get real-time dashboard data (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Real-time data retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRealTimeData", null);
__decorate([
    (0, common_1.Get)('admin/summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics summary (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics summary retrieved successfully' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAnalyticsSummary", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map