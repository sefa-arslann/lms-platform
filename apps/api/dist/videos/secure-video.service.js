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
var SecureVideoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureVideoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const access_grants_service_1 = require("../access-grants/access-grants.service");
let SecureVideoService = SecureVideoService_1 = class SecureVideoService {
    prisma;
    jwtService;
    accessGrantsService;
    logger = new common_1.Logger(SecureVideoService_1.name);
    constructor(prisma, jwtService, accessGrantsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.accessGrantsService = accessGrantsService;
    }
    async generateVideoToken(userId, lessonId, expiresIn = 3600) {
        try {
            const hasAccess = await this.accessGrantsService.checkLessonAccess(userId, lessonId);
            if (!hasAccess) {
                throw new Error('User does not have access to this lesson');
            }
            const payload = {
                userId,
                lessonId,
                type: 'video-access',
                exp: Math.floor(Date.now() / 1000) + expiresIn,
            };
            const token = this.jwtService.sign(payload);
            this.logger.log(`Video access token generated for user ${userId}, lesson ${lessonId}`);
            return token;
        }
        catch (error) {
            this.logger.error(`Error generating video token: ${error.message}`);
            throw error;
        }
    }
    async generateSecureVideoUrl(userId, lessonId) {
        try {
            const hasAccess = await this.accessGrantsService.checkLessonAccess(userId, lessonId);
            if (!hasAccess) {
                throw new Error('User does not have access to this lesson');
            }
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: lessonId },
                select: { videoUrl: true, videoKey: true },
            });
            if (!lesson) {
                throw new Error('Video not found for this lesson');
            }
            if (lesson.videoUrl) {
                const baseUrl = new URL(lesson.videoUrl);
                baseUrl.searchParams.set('user', userId);
                baseUrl.searchParams.set('lesson', lessonId);
                baseUrl.searchParams.set('timestamp', Date.now().toString());
                const hash = this.generateSimpleHash(userId + lessonId + Date.now().toString());
                baseUrl.searchParams.set('hash', hash);
                return baseUrl.toString();
            }
            if (lesson.videoKey) {
                const baseUrl = process.env.VIDEO_CDN_URL || 'http://localhost:3001';
                const secureUrl = new URL(`${baseUrl}/videos/stream/${lesson.videoKey}`);
                secureUrl.searchParams.set('user', userId);
                secureUrl.searchParams.set('lesson', lessonId);
                secureUrl.searchParams.set('timestamp', Date.now().toString());
                const hash = this.generateSimpleHash(userId + lessonId + Date.now().toString());
                secureUrl.searchParams.set('hash', hash);
                return secureUrl.toString();
            }
            throw new Error('No video source found for this lesson');
        }
        catch (error) {
            this.logger.error(`Error generating secure video URL: ${error.message}`);
            throw error;
        }
    }
    generateSimpleHash(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    async generateSecureThumbnailUrl(userId, lessonId) {
        try {
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: lessonId },
                select: { thumbnail: true },
            });
            if (!lesson || !lesson.thumbnail) {
                return '/api/images/default-thumbnail.jpg';
            }
            const secureUrl = `/api/secure-video/lesson/${lessonId}/thumbnail?user=${userId}`;
            return secureUrl;
        }
        catch (error) {
            this.logger.error(`Error generating secure thumbnail URL: ${error.message}`);
            return '/api/images/default-thumbnail.jpg';
        }
    }
    async checkLessonAccess(userId, lessonId) {
        try {
            return await this.accessGrantsService.checkLessonAccess(userId, lessonId);
        }
        catch (error) {
            this.logger.error(`Error checking lesson access: ${error.message}`);
            return false;
        }
    }
    async getLessonVideoInfo(userId, lessonId) {
        try {
            const hasAccess = await this.accessGrantsService.checkLessonAccess(userId, lessonId);
            if (!hasAccess) {
                throw new Error('User does not have access to this lesson');
            }
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: lessonId },
                select: {
                    videoUrl: true,
                    videoKey: true,
                    thumbnail: true
                },
            });
            if (!lesson) {
                throw new Error('Video not found for this lesson');
            }
            return lesson;
        }
        catch (error) {
            this.logger.error(`Error getting lesson video info: ${error.message}`);
            throw error;
        }
    }
    async getVideoStreamingInfo(userId, lessonId) {
        try {
            const secureUrl = await this.generateSecureVideoUrl(userId, lessonId);
            const thumbnailUrl = await this.generateSecureThumbnailUrl(userId, lessonId);
            const expiresAt = Date.now() + 3600 * 1000;
            const quality = ['480p', '720p', '1080p'];
            return {
                secureUrl,
                thumbnailUrl,
                expiresAt,
                quality,
            };
        }
        catch (error) {
            this.logger.error(`Error getting video streaming info: ${error.message}`);
            throw error;
        }
    }
};
exports.SecureVideoService = SecureVideoService;
exports.SecureVideoService = SecureVideoService = SecureVideoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        access_grants_service_1.AccessGrantsService])
], SecureVideoService);
//# sourceMappingURL=secure-video.service.js.map