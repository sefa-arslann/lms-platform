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
    uploadVideo(file: Express.Multer.File, lessonId: string, userId: string, userRole: UserRole): Promise<{
        lesson: {
            order: number;
            id: string;
            title: string;
            description: string | null;
            videoUrl: string | null;
            duration: number;
            sectionId: string;
            isPublished: boolean;
            videoKey: string | null;
            thumbnail: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        };
        videoKey: string;
        hlsKeys: string[];
        thumbnailKey: string;
        metadata: {
            duration: number;
            width: number;
            height: number;
            bitrate: number;
            fps: number;
        };
    }>;
    getVideoStream(lessonId: string, userId: string, userRole: UserRole): Promise<{
        lessonId: string;
        videoUrl: string;
        thumbnail: string | null;
        duration: number;
        expiresAt: Date;
    }>;
    getHLSStream(lessonId: string, userId: string, userRole: UserRole): Promise<{
        lessonId: string;
        hlsUrl: string;
        thumbnail: string | null;
        duration: number;
    }>;
    deleteVideo(lessonId: string, userId: string, userRole: UserRole): Promise<{
        message: string;
    }>;
    addWatermark(lessonId: string, watermarkText: string, userId: string, userRole: UserRole): Promise<{
        message: string;
        videoKey: string;
    }>;
}
