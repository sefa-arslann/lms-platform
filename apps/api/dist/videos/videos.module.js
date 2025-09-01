"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosModule = void 0;
const common_1 = require("@nestjs/common");
const videos_controller_1 = require("./videos.controller");
const videos_service_1 = require("./videos.service");
const video_processing_service_1 = require("./video-processing.service");
const s3_service_1 = require("./s3.service");
const secure_video_controller_1 = require("./secure-video.controller");
const secure_video_service_1 = require("./secure-video.service");
const prisma_module_1 = require("../prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const access_grants_module_1 = require("../access-grants/access-grants.module");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
let VideosModule = class VideosModule {
};
exports.VideosModule = VideosModule;
exports.VideosModule = VideosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            access_grants_module_1.AccessGrantsModule,
            jwt_1.JwtModule.register({
                secret: process.env.VIDEO_SECRET_KEY || process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/temp',
                    filename: (req, file, cb) => {
                        const uniqueName = (0, uuid_1.v4)();
                        const extension = (0, path_1.extname)(file.originalname);
                        cb(null, `${uniqueName}${extension}`);
                    },
                }),
                fileFilter: (req, file, cb) => {
                    if (file.mimetype.startsWith('video/')) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Only video files are allowed'), false);
                    }
                },
                limits: {
                    fileSize: 1024 * 1024 * 500,
                },
            }),
        ],
        controllers: [videos_controller_1.VideosController, secure_video_controller_1.SecureVideoController],
        providers: [videos_service_1.VideosService, video_processing_service_1.VideoProcessingService, s3_service_1.S3Service, secure_video_service_1.SecureVideoService],
        exports: [videos_service_1.VideosService, video_processing_service_1.VideoProcessingService, s3_service_1.S3Service, secure_video_service_1.SecureVideoService],
    })
], VideosModule);
//# sourceMappingURL=videos.module.js.map