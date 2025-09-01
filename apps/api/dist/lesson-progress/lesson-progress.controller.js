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
exports.LessonProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const lesson_progress_service_1 = require("./lesson-progress.service");
let LessonProgressController = class LessonProgressController {
    lessonProgressService;
    constructor(lessonProgressService) {
        this.lessonProgressService = lessonProgressService;
    }
    async getLessonProgress(lessonId, req) {
        try {
            console.log(`📊 Getting progress for lesson ${lessonId} by user ${req.user.id}`);
            const progress = await this.lessonProgressService.getLessonProgress(req.user.id, lessonId);
            return progress;
        }
        catch (error) {
            console.error('❌ Error getting lesson progress:', error);
            throw error;
        }
    }
    async updateLessonProgress(lessonId, updateData, req) {
        try {
            console.log(`📊 Updating progress for lesson ${lessonId} by user ${req.user.id}`);
            const progress = await this.lessonProgressService.updateLessonProgress(req.user.id, lessonId, updateData);
            return progress;
        }
        catch (error) {
            console.error('❌ Error updating lesson progress:', error);
            throw error;
        }
    }
    async completeLesson(lessonId, req) {
        try {
            console.log(`🎯 Marking lesson ${lessonId} as completed by user ${req.user.id}`);
            const progress = await this.lessonProgressService.completeLesson(req.user.id, lessonId);
            return progress;
        }
        catch (error) {
            console.error('❌ Error completing lesson:', error);
            throw error;
        }
    }
    async getCourseProgress(courseId, req) {
        try {
            console.log(`📚 Getting course progress for course ${courseId} by user ${req.user.id}`);
            const progress = await this.lessonProgressService.getCourseProgress(req.user.id, courseId);
            return progress;
        }
        catch (error) {
            console.error('❌ Error getting course progress:', error);
            throw error;
        }
    }
    async getCourseLessonsProgress(courseId, req) {
        try {
            console.log(`📚 Getting all lessons progress for course ${courseId} by user ${req.user.id}`);
            const progress = await this.lessonProgressService.getCourseLessonsProgress(req.user.id, courseId);
            return progress;
        }
        catch (error) {
            console.error('❌ Error getting course lessons progress:', error);
            throw error;
        }
    }
    async getUserLearningStats(req) {
        try {
            console.log(`📊 Getting learning stats for user ${req.user.id}`);
            const stats = await this.lessonProgressService.getUserLearningStats(req.user.id);
            return stats;
        }
        catch (error) {
            console.error('❌ Error getting user learning stats:', error);
            throw error;
        }
    }
    async getLastWatchedCourse(req) {
        try {
            console.log(`🎬 Getting last watched course for user ${req.user.id}`);
            const lastWatched = await this.lessonProgressService.getLastWatchedCourse(req.user.id);
            return lastWatched;
        }
        catch (error) {
            console.error('❌ Error getting last watched course:', error);
            throw error;
        }
    }
    async getAllLessonProgress(req) {
        try {
            console.log(`📊 Getting all lesson progress for user ${req.user.id}`);
            const allProgress = await this.lessonProgressService.getAllLessonProgress(req.user.id);
            return allProgress;
        }
        catch (error) {
            console.error('❌ Error getting all lesson progress:', error);
            throw error;
        }
    }
    async resetAllLessonProgress(req) {
        try {
            console.log(`🗑️ Resetting all lesson progress for user ${req.user.id}`);
            const result = await this.lessonProgressService.resetAllLessonProgress(req.user.id);
            return result;
        }
        catch (error) {
            console.error('❌ Error resetting all lesson progress:', error);
            throw error;
        }
    }
};
exports.LessonProgressController = LessonProgressController;
__decorate([
    (0, common_1.Get)('lesson/:lessonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user progress for a specific lesson' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lesson progress retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "getLessonProgress", null);
__decorate([
    (0, common_1.Post)('lesson/:lessonId/update'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update lesson progress' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lesson progress updated successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "updateLessonProgress", null);
__decorate([
    (0, common_1.Patch)('lesson/:lessonId/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark lesson as completed' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lesson marked as completed successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "completeLesson", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get course progress for user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course progress retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "getCourseProgress", null);
__decorate([
    (0, common_1.Get)('course/:courseId/lessons'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lessons progress for a course' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All lessons progress retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "getCourseLessonsProgress", null);
__decorate([
    (0, common_1.Get)('user/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user learning statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User learning stats retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "getUserLearningStats", null);
__decorate([
    (0, common_1.Get)('user/last-watched'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user last watched course' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Last watched course retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "getLastWatchedCourse", null);
__decorate([
    (0, common_1.Get)('user/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lesson progress for user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All lesson progress retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "getAllLessonProgress", null);
__decorate([
    (0, common_1.Delete)('user/reset'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reset all lesson progress for user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All lesson progress reset successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LessonProgressController.prototype, "resetAllLessonProgress", null);
exports.LessonProgressController = LessonProgressController = __decorate([
    (0, swagger_1.ApiTags)('lesson-progress'),
    (0, common_1.Controller)('lesson-progress'),
    __metadata("design:paramtypes", [lesson_progress_service_1.LessonProgressService])
], LessonProgressController);
//# sourceMappingURL=lesson-progress.controller.js.map