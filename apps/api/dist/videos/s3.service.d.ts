import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private readonly configService;
    private readonly s3Client;
    private readonly bucketName;
    private readonly region;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadVideo(file: Express.Multer.File, lessonId: string): Promise<string>;
    uploadHLSFiles(lessonId: string, hlsFiles: string[]): Promise<string[]>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    deleteObject(key: string): Promise<void>;
    private getContentType;
    getCloudFrontUrl(key: string): string;
}
