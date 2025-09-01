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
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const videos_service_1 = require("./videos.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let VideosController = class VideosController {
    videosService;
    prisma;
    constructor(videosService, prisma) {
        this.videosService = videosService;
        this.prisma = prisma;
    }
    async uploadVideo(lessonId, file, req) {
        return this.videosService.uploadVideo(file, lessonId, req.user.id, req.user.role);
    }
    async streamVideo(lessonId, res) {
        try {
            console.log(`🎥 Streaming video for lesson ${lessonId}`);
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: lessonId },
                select: { videoUrl: true, videoKey: true },
            });
            if (!lesson) {
                return res.status(404).json({ error: 'Lesson not found' });
            }
            if (lesson.videoUrl) {
                return res.redirect(lesson.videoUrl);
            }
            if (lesson.videoKey) {
                return res.json({
                    success: true,
                    data: {
                        videoKey: lesson.videoKey,
                        message: 'Video key found, implement streaming logic'
                    }
                });
            }
            return res.status(404).json({ error: 'No video source found' });
        }
        catch (error) {
            console.error('❌ Error streaming video:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getHLSStream(lessonId, req) {
        return this.videosService.getHLSStream(lessonId, req.user.id, req.user.role);
    }
    async deleteVideo(lessonId, req) {
        return this.videosService.deleteVideo(lessonId, req.user.id, req.user.role);
    }
    async addWatermark(lessonId, body, req) {
        return this.videosService.addWatermark(lessonId, body.watermarkText, req.user.id, req.user.role);
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Post)('upload/:lessonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload video for a lesson (Instructor/Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Video uploaded and processed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid file',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Lesson not found',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video')),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: 'video/*' }),
        ],
    }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Get)('stream/:lessonId'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "streamVideo", null);
__decorate([
    (0, common_1.Get)('hls/:lessonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get HLS stream URL' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'HLS stream URL generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Access denied',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Lesson or HLS stream not found',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getHLSStream", null);
__decorate([
    (0, common_1.Delete)(':lessonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete video from lesson (Instructor/Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Video deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Lesson not found',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "deleteVideo", null);
__decorate([
    (0, common_1.Post)(':lessonId/watermark'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add watermark to video (Instructor/Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Watermark added successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Lesson or video not found',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "addWatermark", null);
exports.VideosController = VideosController = __decorate([
    (0, swagger_1.ApiTags)('Videos'),
    (0, common_1.Controller)('videos'),
    __metadata("design:paramtypes", [videos_service_1.VideosService, prisma_service_1.PrismaService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map