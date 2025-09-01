import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AccessGrantsService } from '../access-grants/access-grants.service';
export declare class SecureVideoService {
    private readonly prisma;
    private readonly jwtService;
    private readonly accessGrantsService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, accessGrantsService: AccessGrantsService);
    generateVideoToken(userId: string, lessonId: string, expiresIn?: number): Promise<string>;
    generateSecureVideoUrl(userId: string, lessonId: string): Promise<string>;
    private generateSimpleHash;
    generateSecureThumbnailUrl(userId: string, lessonId: string): Promise<string>;
    checkLessonAccess(userId: string, lessonId: string): Promise<boolean>;
    getLessonVideoInfo(userId: string, lessonId: string): Promise<{
        videoUrl: string | null;
        videoKey: string | null;
        thumbnail: string | null;
    } | null>;
    getVideoStreamingInfo(userId: string, lessonId: string): Promise<{
        secureUrl: string;
        thumbnailUrl: string;
        expiresAt: number;
        quality: string[];
    }>;
}
