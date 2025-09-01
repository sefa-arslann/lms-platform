import { SecureVideoService } from './secure-video.service';
import { JwtService } from '@nestjs/jwt';
import { AccessGrantsService } from '../access-grants/access-grants.service';
export declare class SecureVideoController {
    private readonly secureVideoService;
    private readonly jwtService;
    private readonly accessGrantsService;
    constructor(secureVideoService: SecureVideoService, jwtService: JwtService, accessGrantsService: AccessGrantsService);
    getVideoStreamingInfo(lessonId: string, req: any, res: any): unknown;
    streamVideo(lessonId: string, req: any, res: any): unknown;
    getSecureThumbnailUrl(lessonId: string, req: any): unknown;
    getVideoToken(lessonId: string, req: any): unknown;
    verifyToken(lessonId: string, token: string): unknown;
    checkVideoAccess(lessonId: string, req: any): unknown;
}
