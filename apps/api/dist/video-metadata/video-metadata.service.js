"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var VideoMetadataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoMetadataService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let VideoMetadataService = VideoMetadataService_1 = class VideoMetadataService {
    logger = new common_1.Logger(VideoMetadataService_1.name);
    async getVideoDuration(videoUrl) {
        try {
            this.logger.log(`Getting video duration for: ${videoUrl}`);
            const command = `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoUrl}"`;
            const { stdout } = await execAsync(command);
            const duration = parseFloat(stdout.trim());
            if (isNaN(duration)) {
                throw new Error('Invalid duration returned from ffprobe');
            }
            const durationInSeconds = Math.ceil(duration);
            this.logger.log(`Video duration: ${durationInSeconds} seconds`);
            return durationInSeconds;
        }
        catch (error) {
            this.logger.error(`Error getting video duration: ${error.message}`);
            return this.estimateDurationFromUrl(videoUrl);
        }
    }
    async getVideoMetadata(videoUrl) {
        try {
            this.logger.log(`Getting video metadata for: ${videoUrl}`);
            const command = `ffprobe -v quiet -show_entries format=duration,width,height,format_name,bit_rate -of json "${videoUrl}"`;
            const { stdout } = await execAsync(command);
            const metadata = JSON.parse(stdout);
            const format = metadata.format;
            const result = {
                duration: Math.ceil(parseFloat(format.duration || '0')),
                width: parseInt(format.width) || undefined,
                height: parseInt(format.height) || undefined,
                format: format.format_name || undefined,
                bitrate: parseInt(format.bit_rate) || undefined,
            };
            this.logger.log(`Video metadata: ${JSON.stringify(result)}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error getting video metadata: ${error.message}`);
            const duration = await this.getVideoDuration(videoUrl);
            return { duration };
        }
    }
    estimateDurationFromUrl(videoUrl) {
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            return 15 * 60;
        }
        else if (videoUrl.includes('vimeo.com')) {
            return 20 * 60;
        }
        else if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.avi') || videoUrl.endsWith('.mov')) {
            return 25 * 60;
        }
        else {
            return 15 * 60;
        }
    }
    async isVideoUrlValid(videoUrl) {
        try {
            const url = new URL(videoUrl);
            const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
            const hasVideoExtension = videoExtensions.some(ext => url.pathname.toLowerCase().includes(ext));
            const videoPlatforms = [
                'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
                'facebook.com', 'instagram.com', 'tiktok.com'
            ];
            const isVideoPlatform = videoPlatforms.some(platform => url.hostname.includes(platform));
            return hasVideoExtension || isVideoPlatform;
        }
        catch (error) {
            return false;
        }
    }
};
exports.VideoMetadataService = VideoMetadataService;
exports.VideoMetadataService = VideoMetadataService = VideoMetadataService_1 = __decorate([
    (0, common_1.Injectable)()
], VideoMetadataService);
//# sourceMappingURL=video-metadata.service.js.map