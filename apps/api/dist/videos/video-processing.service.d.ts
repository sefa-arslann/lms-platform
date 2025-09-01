import { ConfigService } from '@nestjs/config';
export declare class VideoProcessingService {
    private readonly configService;
    private readonly logger;
    private readonly outputDir;
    constructor(configService: ConfigService);
    private ensureOutputDir;
    convertToHLS(inputPath: string, lessonId: string, quality?: 'low' | 'medium' | 'high'): Promise<string[]>;
    addWatermark(inputPath: string, lessonId: string, watermarkText: string): Promise<string>;
    generateThumbnail(inputPath: string, lessonId: string, time?: string): Promise<string>;
    getVideoMetadata(inputPath: string): Promise<{
        duration: number;
        width: number;
        height: number;
        bitrate: number;
        fps: number;
    }>;
    private getQualitySettings;
    private getGeneratedFiles;
    private parseFrameRate;
    cleanupTempFiles(lessonId: string): Promise<void>;
}
