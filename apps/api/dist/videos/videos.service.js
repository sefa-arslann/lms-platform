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
var VideosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const s3_service_1 = require("./s3.service");
const video_processing_service_1 = require("./video-processing.service");
const client_1 = require("@prisma/client");
let VideosService = VideosService_1 = class VideosService {
    prisma;
    s3Service;
    videoProcessingService;
    logger = new common_1.Logger(VideosService_1.name);
    constructor(prisma, s3Service, videoProcessingService) {
        this.prisma = prisma;
        this.s3Service = s3Service;
        this.videoProcessingService = videoProcessingService;
    }
    async uploadVideo(file, lessonId, userId, userRole) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (userRole === client_1.UserRole.INSTRUCTOR && lesson.section.course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === client_1.UserRole.STUDENT) {
            throw new common_1.ForbiddenException('Students cannot upload videos');
        }
        try {
            const metadata = await this.videoProcessingService.getVideoMetadata(file.path);
            const videoKey = await this.s3Service.uploadVideo(file, lessonId);
            const hlsFiles = await this.videoProcessingService.convertToHLS(file.path, lessonId, 'medium');
            const hlsKeys = await this.s3Service.uploadHLSFiles(lessonId, hlsFiles);
            const thumbnailPath = await this.videoProcessingService.generateThumbnail(file.path, lessonId);
            const thumbnailKey = await this.s3Service.uploadVideo({ ...file, path: thumbnailPath }, lessonId);
            const updatedLesson = await this.prisma.lesson.update({
                where: { id: lessonId },
                data: {
                    videoUrl: this.s3Service.getCloudFrontUrl(videoKey),
                    videoKey,
                    thumbnail: this.s3Service.getCloudFrontUrl(thumbnailKey),
                    duration: Math.round(metadata.duration),
                    isPublished: false,
                },
            });
            await this.videoProcessingService.cleanupTempFiles(lessonId);
            this.logger.log(`Video uploaded and processed successfully for lesson: ${lessonId}`);
            return {
                lesson: updatedLesson,
                videoKey,
                hlsKeys,
                thumbnailKey,
                metadata,
            };
        }
        catch (error) {
            this.logger.error(`Video upload failed: ${error.message}`);
            throw error;
        }
    }
    async getVideoStream(lessonId, userId, userRole) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (!lesson.videoKey) {
            throw new common_1.NotFoundException('No video available for this lesson');
        }
        if (userRole === client_1.UserRole.STUDENT) {
            const accessGrant = await this.prisma.accessGrant.findFirst({
                where: {
                    userId,
                    courseId: lesson.section.courseId,
                    isActive: true,
                },
            });
            if (!accessGrant) {
                throw new common_1.ForbiddenException('Access denied - Course not purchased');
            }
        }
        const signedUrl = await this.s3Service.getSignedUrl(lesson.videoKey, 3600);
        return {
            lessonId,
            videoUrl: signedUrl,
            thumbnail: lesson.thumbnail,
            duration: lesson.duration,
            expiresAt: new Date(Date.now() + 3600000),
        };
    }
    async getHLSStream(lessonId, userId, userRole) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (userRole === client_1.UserRole.STUDENT) {
            const accessGrant = await this.prisma.accessGrant.findFirst({
                where: {
                    userId,
                    courseId: lesson.section.courseId,
                    isActive: true,
                },
            });
            if (!accessGrant) {
                throw new common_1.ForbiddenException('Access denied - Course not purchased');
            }
        }
        const hlsUrl = lesson.videoKey?.replace('videos/', 'hls/').replace('.mp4', '/playlist.m3u8');
        if (!hlsUrl) {
            throw new common_1.NotFoundException('HLS stream not available');
        }
        return {
            lessonId,
            hlsUrl: this.s3Service.getCloudFrontUrl(hlsUrl),
            thumbnail: lesson.thumbnail,
            duration: lesson.duration,
        };
    }
    async deleteVideo(lessonId, userId, userRole) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (userRole === client_1.UserRole.INSTRUCTOR && lesson.section.course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        try {
            if (lesson.videoKey) {
                await this.s3Service.deleteObject(lesson.videoKey);
            }
            await this.prisma.lesson.update({
                where: { id: lessonId },
                data: {
                    videoUrl: null,
                    videoKey: null,
                    thumbnail: null,
                    duration: undefined,
                },
            });
            this.logger.log(`Video deleted successfully for lesson: ${lessonId}`);
            return { message: 'Video deleted successfully' };
        }
        catch (error) {
            this.logger.error(`Video deletion failed: ${error.message}`);
            throw error;
        }
    }
    async addWatermark(lessonId, watermarkText, userId, userRole) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { section: { include: { course: true } } },
        });
        if (!lesson || !lesson.videoKey) {
            throw new common_1.NotFoundException('Lesson or video not found');
        }
        if (userRole === client_1.UserRole.INSTRUCTOR && lesson.section.course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        try {
            const tempPath = `./uploads/temp/${lessonId}_temp.mp4`;
            const watermarkedPath = await this.videoProcessingService.addWatermark(tempPath, lessonId, watermarkText);
            const newVideoKey = await this.s3Service.uploadVideo({ path: watermarkedPath }, lessonId);
            await this.prisma.lesson.update({
                where: { id: lessonId },
                data: {
                    videoKey: newVideoKey,
                    videoUrl: this.s3Service.getCloudFrontUrl(newVideoKey),
                },
            });
            await this.videoProcessingService.cleanupTempFiles(lessonId);
            return { message: 'Watermark added successfully', videoKey: newVideoKey };
        }
        catch (error) {
            this.logger.error(`Watermark addition failed: ${error.message}`);
            throw error;
        }
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = VideosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service,
        video_processing_service_1.VideoProcessingService])
], VideosService);
//# sourceMappingURL=videos.service.js.map