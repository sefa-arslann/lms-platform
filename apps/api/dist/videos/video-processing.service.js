"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VideoProcessingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoProcessingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
let VideoProcessingService = VideoProcessingService_1 = class VideoProcessingService {
    configService;
    logger = new common_1.Logger(VideoProcessingService_1.name);
    outputDir;
    constructor(configService) {
        this.configService = configService;
        this.outputDir = './uploads/processed';
        this.ensureOutputDir();
    }
    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    async convertToHLS(inputPath, lessonId, quality = 'medium') {
        const outputDir = path.join(this.outputDir, lessonId);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputPath = path.join(outputDir, 'playlist.m3u8');
        return new Promise((resolve, reject) => {
            const command = ffmpeg(inputPath);
            const qualitySettings = this.getQualitySettings(quality);
            command
                .videoCodec('libx264')
                .audioCodec('aac')
                .outputOptions([
                '-hls_time 6',
                '-hls_list_size 0',
                '-hls_segment_filename', `${outputDir}/segment_%03d.ts`,
                '-f hls',
                '-preset', 'fast',
                '-crf', qualitySettings.crf.toString(),
                '-maxrate', `${qualitySettings.maxrate}k`,
                '-bufsize', `${qualitySettings.bufsize}k`,
                '-vf', `scale=${qualitySettings.width}:${qualitySettings.height}`,
            ])
                .output(outputPath)
                .on('start', () => {
                this.logger.log(`Starting HLS conversion for lesson: ${lessonId}`);
            })
                .on('progress', (progress) => {
                this.logger.log(`Processing: ${progress.percent}% done`);
            })
                .on('end', () => {
                this.logger.log(`HLS conversion completed for lesson: ${lessonId}`);
                const files = this.getGeneratedFiles(outputDir);
                resolve(files);
                fs.unlinkSync(inputPath);
            })
                .on('error', (err) => {
                this.logger.error(`HLS conversion failed: ${err.message}`);
                reject(new Error(`HLS conversion failed: ${err.message}`));
            })
                .run();
        });
    }
    async addWatermark(inputPath, lessonId, watermarkText) {
        const outputPath = path.join(this.outputDir, `${lessonId}_watermarked.mp4`);
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoFilters([
                `drawtext=text='${watermarkText}':fontcolor=white:fontsize=24:x=10:y=10:alpha=0.7`,
            ])
                .output(outputPath)
                .on('end', () => {
                this.logger.log(`Watermark added successfully for lesson: ${lessonId}`);
                resolve(outputPath);
            })
                .on('error', (err) => {
                this.logger.error(`Watermark addition failed: ${err.message}`);
                reject(new Error(`Watermark addition failed: ${err.message}`));
            })
                .run();
        });
    }
    async generateThumbnail(inputPath, lessonId, time = '00:00:05') {
        const outputPath = path.join(this.outputDir, `${lessonId}_thumbnail.jpg`);
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .screenshots({
                timestamps: [time],
                filename: path.basename(outputPath),
                folder: path.dirname(outputPath),
                size: '320x240',
            })
                .on('end', () => {
                this.logger.log(`Thumbnail generated for lesson: ${lessonId}`);
                resolve(outputPath);
            })
                .on('error', (err) => {
                this.logger.error(`Thumbnail generation failed: ${err.message}`);
                reject(new Error(`Thumbnail generation failed: ${err.message}`));
            });
        });
    }
    async getVideoMetadata(inputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputPath, (err, metadata) => {
                if (err) {
                    reject(new Error(`Failed to get video metadata: ${err.message}`));
                    return;
                }
                const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
                if (!videoStream) {
                    reject(new Error('No video stream found'));
                    return;
                }
                resolve({
                    duration: metadata.format.duration || 0,
                    width: videoStream.width || 0,
                    height: videoStream.height || 0,
                    bitrate: metadata.format.bit_rate ? parseInt(metadata.format.bit_rate.toString()) : 0,
                    fps: videoStream.r_frame_rate ? this.parseFrameRate(videoStream.r_frame_rate) : 0,
                });
            });
        });
    }
    getQualitySettings(quality) {
        switch (quality) {
            case 'low':
                return { crf: 28, maxrate: 800, bufsize: 1600, width: 640, height: 360 };
            case 'high':
                return { crf: 18, maxrate: 4000, bufsize: 8000, width: 1920, height: 1080 };
            default:
                return { crf: 23, maxrate: 2000, bufsize: 4000, width: 1280, height: 720 };
        }
    }
    getGeneratedFiles(outputDir) {
        const files = [];
        if (fs.existsSync(outputDir)) {
            const items = fs.readdirSync(outputDir);
            for (const item of items) {
                const fullPath = path.join(outputDir, item);
                if (fs.statSync(fullPath).isFile()) {
                    files.push(fullPath);
                }
            }
        }
        return files;
    }
    parseFrameRate(frameRate) {
        const [numerator, denominator] = frameRate.split('/');
        return parseInt(numerator) / parseInt(denominator);
    }
    async cleanupTempFiles(lessonId) {
        const outputDir = path.join(this.outputDir, lessonId);
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
            this.logger.log(`Cleaned up temp files for lesson: ${lessonId}`);
        }
    }
};
exports.VideoProcessingService = VideoProcessingService;
exports.VideoProcessingService = VideoProcessingService = VideoProcessingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VideoProcessingService);
//# sourceMappingURL=video-processing.service.js.map