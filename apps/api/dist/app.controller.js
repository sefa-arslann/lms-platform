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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma/prisma.service");
let AppController = class AppController {
    appService;
    prisma;
    constructor(appService, prisma) {
        this.appService = appService;
        this.prisma = prisma;
    }
    getHello() {
        return this.appService.getHello();
    }
    test() {
        return { message: 'App test endpoint working!', timestamp: new Date() };
    }
    ping() {
        return { message: 'pong', timestamp: new Date() };
    }
    async testVideo(lessonId) {
        try {
            console.log(`🎥 Testing video for lesson ${lessonId}`);
            return {
                success: true,
                message: 'Video test endpoint working',
                lessonId,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ Error in test video endpoint:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    async videoTest(lessonId) {
        try {
            console.log(`🎥 Testing video for lesson ${lessonId}`);
            return {
                success: true,
                message: 'Video test endpoint working',
                lessonId,
                videoUrl: 'http://arsolix.com/1.mp4',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ Error in video test endpoint:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    async videoDirect(lessonId) {
        try {
            console.log(`🎥 Direct video access for lesson ${lessonId}`);
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: lessonId },
                select: { videoUrl: true, title: true },
            });
            if (!lesson) {
                return {
                    success: false,
                    error: 'Lesson not found'
                };
            }
            return {
                success: true,
                lessonId,
                title: lesson.title,
                videoUrl: lesson.videoUrl,
                message: 'Direct video URL retrieved',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ Error in direct video endpoint:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    async videoSimple() {
        try {
            console.log(`🎥 Simple video test endpoint`);
            return {
                success: true,
                message: 'Simple video endpoint working',
                videoUrl: 'http://arsolix.com/1.mp4',
                lessonId: 'cmemoob920001kh1jih1chy3c',
                title: 'Vue.js Kurulumu',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ Error in simple video endpoint:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)('test-video/:lessonId'),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "testVideo", null);
__decorate([
    (0, common_1.Get)('video-test/:lessonId'),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "videoTest", null);
__decorate([
    (0, common_1.Get)('video-direct/:lessonId'),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "videoDirect", null);
__decorate([
    (0, common_1.Get)('video-simple'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "videoSimple", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService, prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map