export declare class VideoMetadataService {
    private readonly logger;
    getVideoDuration(videoUrl: string): Promise<number>;
    getVideoMetadata(videoUrl: string): Promise<{
        duration: number;
        width?: number;
        height?: number;
        format?: string;
        bitrate?: number;
    }>;
    private estimateDurationFromUrl;
    isVideoUrlValid(videoUrl: string): Promise<boolean>;
}
