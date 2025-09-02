import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    test(): {
        message: string;
        timestamp: Date;
    };
    ping(): {
        message: string;
        timestamp: Date;
    };
    testVideo(lessonId: string): Promise<{
        success: boolean;
        message: string;
        lessonId: string;
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        lessonId?: undefined;
        timestamp?: undefined;
    }>;
    videoTest(lessonId: string): Promise<{
        success: boolean;
        message: string;
        lessonId: string;
        videoUrl: string;
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        lessonId?: undefined;
        videoUrl?: undefined;
        timestamp?: undefined;
    }>;
    videoDirect(lessonId: string): Promise<{
        success: boolean;
        lessonId: string;
        title: string;
        videoUrl: string | null;
        message: string;
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        lessonId?: undefined;
        title?: undefined;
        videoUrl?: undefined;
        message?: undefined;
        timestamp?: undefined;
    }>;
    videoSimple(): Promise<{
        success: boolean;
        message: string;
        videoUrl: string;
        lessonId: string;
        title: string;
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        videoUrl?: undefined;
        lessonId?: undefined;
        title?: undefined;
        timestamp?: undefined;
    }>;
}
