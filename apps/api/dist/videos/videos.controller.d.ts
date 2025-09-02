import { VideosService } from './videos.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class VideosController {
    private readonly videosService;
    private readonly prisma;
    constructor(videosService: VideosService, prisma: PrismaService);
    uploadVideo(lessonId: string, file: Express.Multer.File, req: any): Promise<{
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
    streamVideo(lessonId: string, res: any): Promise<any>;
    getHLSStream(lessonId: string, req: any): Promise<{
        lessonId: string;
        hlsUrl: string;
        thumbnail: string | null;
        duration: number;
    }>;
    deleteVideo(lessonId: string, req: any): Promise<{
        message: string;
    }>;
    addWatermark(lessonId: string, body: {
        watermarkText: string;
    }, req: any): Promise<{
        message: string;
        videoKey: string;
    }>;
}
