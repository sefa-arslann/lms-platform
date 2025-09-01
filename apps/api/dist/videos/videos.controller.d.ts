import { VideosService } from './videos.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class VideosController {
    private readonly videosService;
    private readonly prisma;
    constructor(videosService: VideosService, prisma: PrismaService);
    uploadVideo(lessonId: string, file: Express.Multer.File, req: any): unknown;
    streamVideo(lessonId: string, res: any): unknown;
    getHLSStream(lessonId: string, req: any): unknown;
    deleteVideo(lessonId: string, req: any): unknown;
    addWatermark(lessonId: string, body: {
        watermarkText: string;
    }, req: any): unknown;
}
