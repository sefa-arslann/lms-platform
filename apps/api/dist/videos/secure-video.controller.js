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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureVideoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const secure_video_service_1 = require("./secure-video.service");
const jwt_1 = require("@nestjs/jwt");
const access_grants_service_1 = require("../access-grants/access-grants.service");
let SecureVideoController = class SecureVideoController {
    secureVideoService;
    jwtService;
    accessGrantsService;
    constructor(secureVideoService, jwtService, accessGrantsService) {
        this.secureVideoService = secureVideoService;
        this.jwtService = jwtService;
        this.accessGrantsService = accessGrantsService;
    }
    async getVideoStreamingInfo(lessonId, req, res) {
        try {
            const userId = req.user.id;
            console.log(`🎥 Getting secure video streaming info for lesson ${lessonId} by user ${userId}`);
            const streamingInfo = await this.secureVideoService.getVideoStreamingInfo(userId, lessonId);
            res.set({
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-Download-Options': 'noopen',
                'X-Permitted-Cross-Domain-Policies': 'none',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Content-Security-Policy': "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
            });
            return res.json({
                success: true,
                data: streamingInfo,
                message: 'Video streaming info retrieved successfully',
            });
        }
        catch (error) {
            console.error('❌ Error getting video streaming info:', error);
            throw error;
        }
    }
    async streamVideo(lessonId, req, res) {
        try {
            const userId = req.user.id;
            console.log(`🎬 Getting secure video URL for lesson ${lessonId} by user ${userId}`);
            const secureUrl = await this.secureVideoService.generateSecureVideoUrl(userId, lessonId);
            res.set({
                'Access-Control-Allow-Origin': 'http://localhost:3002',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers': 'Range, Authorization',
                'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length',
            });
            return res.json({
                success: true,
                data: {
                    secureUrl: secureUrl,
                    message: 'Secure video URL generated successfully'
                }
            });
        }
        catch (error) {
            console.error('❌ Error getting secure video URL:', error);
            throw error;
        }
    }
    async getSecureThumbnailUrl(lessonId, req) {
        try {
            console.log(`🖼️ Getting secure thumbnail URL for lesson ${lessonId} by user ${req.user.id}`);
            const thumbnailUrl = await this.secureVideoService.generateSecureThumbnailUrl(req.user.id, lessonId);
            return {
                success: true,
                data: { thumbnailUrl },
                message: 'Secure thumbnail URL retrieved successfully',
            };
        }
        catch (error) {
            console.error('❌ Error getting secure thumbnail URL:', error);
            throw error;
        }
    }
    async getVideoToken(lessonId, req) {
        try {
            console.log(`🔑 Generating video token for lesson ${lessonId} by user ${req.user.id}`);
            const token = await this.secureVideoService.generateVideoToken(req.user.id, lessonId);
            return {
                success: true,
                data: { token },
                message: 'Video access token generated successfully',
            };
        }
        catch (error) {
            console.error('❌ Error generating video token:', error);
            throw error;
        }
    }
    async verifyToken(lessonId, token) {
        try {
            console.log(`🔍 Verifying video token for lesson ${lessonId}`);
            const decoded = this.jwtService.verify(token);
            if (decoded.lessonId !== lessonId) {
                throw new common_1.UnauthorizedException('Invalid token for this lesson');
            }
            const hasAccess = await this.accessGrantsService.checkLessonAccess(decoded.userId, lessonId);
            if (!hasAccess) {
                throw new common_1.UnauthorizedException('User no longer has access to this lesson');
            }
            return {
                success: true,
                data: {
                    isValid: true,
                    userId: decoded.userId,
                    lessonId: decoded.lessonId,
                    expiresAt: decoded.exp
                },
                message: 'Token verification completed',
            };
        }
        catch (error) {
            console.error('❌ Error verifying token:', error);
            throw error;
        }
    }
    async checkVideoAccess(lessonId, req) {
        try {
            console.log(`🔒 Checking video access for lesson ${lessonId} by user ${req.user.id}`);
            await this.secureVideoService.generateVideoToken(req.user.id, lessonId);
            return {
                success: true,
                data: { hasAccess: true },
                message: 'User has access to this lesson video',
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                return {
                    success: false,
                    data: { hasAccess: false },
                    message: 'User does not have access to this lesson video',
                };
            }
            throw error;
        }
    }
};
exports.SecureVideoController = SecureVideoController;
__decorate([
    (0, common_1.Get)('lesson/:lessonId/stream'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get secure video streaming URL' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Secure video streaming info retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SecureVideoController.prototype, "getVideoStreamingInfo", null);
__decorate([
    (0, common_1.Get)('lesson/:lessonId/video'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get secure video streaming URL' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Secure video URL retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SecureVideoController.prototype, "streamVideo", null);
__decorate([
    (0, common_1.Get)('lesson/:lessonId/thumbnail'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get secure thumbnail URL' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Secure thumbnail URL retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecureVideoController.prototype, "getSecureThumbnailUrl", null);
__decorate([
    (0, common_1.Get)('lesson/:lessonId/token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get video access token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Video access token generated successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecureVideoController.prototype, "getVideoToken", null);
__decorate([
    (0, common_1.Get)('verify/:lessonId/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify video access token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token verification result',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SecureVideoController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Get)('lesson/:lessonId/access-check'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user has access to lesson video' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Access check completed',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecureVideoController.prototype, "checkVideoAccess", null);
exports.SecureVideoController = SecureVideoController = __decorate([
    (0, swagger_1.ApiTags)('secure-video'),
    (0, common_1.Controller)('secure-video'),
    __metadata("design:paramtypes", [secure_video_service_1.SecureVideoService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, access_grants_service_1.AccessGrantsService])
], SecureVideoController);
//# sourceMappingURL=secure-video.controller.js.map