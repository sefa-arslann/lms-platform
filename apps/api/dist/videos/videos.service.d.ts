import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';
import { VideoProcessingService } from './video-processing.service';
import { UserRole } from '@prisma/client';
export declare class VideosService {
    private readonly prisma;
    private readonly s3Service;
    private readonly videoProcessingService;
    private readonly logger;
    constructor(prisma: PrismaService, s3Service: S3Service, videoProcessingService: VideoProcessingService);
    uploadVideo(file: Express.Multer.File, lessonId: string, userId: string, userRole: UserRole): unknown;
    getVideoStream(lessonId: string, userId: string, userRole: UserRole): unknown;
    getHLSStream(lessonId: string, userId: string, userRole: UserRole): unknown;
    deleteVideo(lessonId: string, userId: string, userRole: UserRole): unknown;
    addWatermark(lessonId: string, watermarkText: string, userId: string, userRole: UserRole): unknown;
}
