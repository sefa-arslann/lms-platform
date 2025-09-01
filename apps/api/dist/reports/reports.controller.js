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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const admin_guard_1 = require("../auth/guards/admin.guard");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getUserActivities(period = 'today') {
        return this.reportsService.getUserActivities(period);
    }
    async getDailyStats(period = 'today') {
        return this.reportsService.getDailyStats(period);
    }
    async getWeeklyStats(period = 'today') {
        return this.reportsService.getWeeklyStats(period);
    }
    async getDetailedQuestions(period = 'today') {
        return this.reportsService.getDetailedQuestions(period);
    }
    async getDetailedNotes(period = 'today') {
        return this.reportsService.getDetailedNotes(period);
    }
    async getLessonActivity(lessonId) {
        return this.reportsService.getLessonActivity(lessonId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('user-activities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user activities report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User activities report retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string' },
                    todayWatched: { type: 'number' },
                    todayCompleted: { type: 'number' },
                    thisWeekWatched: { type: 'number' },
                    thisWeekCompleted: { type: 'number' },
                    totalQuestions: { type: 'number' },
                    totalNotes: { type: 'number' },
                    lastActive: { type: 'string' },
                    totalProgress: { type: 'number' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getUserActivities", null);
__decorate([
    (0, common_1.Get)('daily-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily statistics report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daily statistics report retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    date: { type: 'string' },
                    totalWatched: { type: 'number' },
                    totalCompleted: { type: 'number' },
                    totalQuestions: { type: 'number' },
                    totalNotes: { type: 'number' },
                    activeUsers: { type: 'number' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailyStats", null);
__decorate([
    (0, common_1.Get)('weekly-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weekly statistics report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Weekly statistics report retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    week: { type: 'string' },
                    totalWatched: { type: 'number' },
                    totalCompleted: { type: 'number' },
                    totalQuestions: { type: 'number' },
                    totalNotes: { type: 'number' },
                    activeUsers: { type: 'number' },
                    averageProgress: { type: 'number' }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getWeeklyStats", null);
__decorate([
    (0, common_1.Get)('detailed-questions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed questions report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detailed questions report retrieved successfully'
    }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDetailedQuestions", null);
__decorate([
    (0, common_1.Get)('detailed-notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed notes report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detailed notes report retrieved successfully'
    }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDetailedNotes", null);
__decorate([
    (0, common_1.Get)('lesson-activity/:lessonId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lesson activity report' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lesson activity report retrieved successfully'
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLessonActivity", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('admin/reports'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map