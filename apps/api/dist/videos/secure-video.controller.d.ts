import { SecureVideoService } from './secure-video.service';
import { JwtService } from '@nestjs/jwt';
import { AccessGrantsService } from '../access-grants/access-grants.service';
export declare class SecureVideoController {
    private readonly secureVideoService;
    private readonly jwtService;
    private readonly accessGrantsService;
    constructor(secureVideoService: SecureVideoService, jwtService: JwtService, accessGrantsService: AccessGrantsService);
    getVideoStreamingInfo(lessonId: string, req: any, res: any): Promise<any>;
    streamVideo(lessonId: string, req: any, res: any): Promise<any>;
    getSecureThumbnailUrl(lessonId: string, req: any): Promise<{
        success: boolean;
        data: {
            thumbnailUrl: string;
        };
        message: string;
    }>;
    getVideoToken(lessonId: string, req: any): Promise<{
        success: boolean;
        data: {
            token: string;
        };
        message: string;
    }>;
    verifyToken(lessonId: string, token: string): Promise<{
        success: boolean;
        data: {
            isValid: boolean;
            userId: any;
            lessonId: any;
            expiresAt: any;
        };
        message: string;
    }>;
    checkVideoAccess(lessonId: string, req: any): Promise<{
        success: boolean;
        data: {
            hasAccess: boolean;
        };
        message: string;
    }>;
}
