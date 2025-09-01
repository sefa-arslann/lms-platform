import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    test(): {
        message: string;
        timestamp: any;
    };
    ping(): {
        message: string;
        timestamp: any;
    };
    testVideo(lessonId: string): unknown;
    videoTest(lessonId: string): unknown;
    videoDirect(lessonId: string): unknown;
    videoSimple(): unknown;
}
