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
var S3Service_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
let S3Service = S3Service_1 = class S3Service {
    configService;
    s3Client;
    bucketName;
    region;
    logger = new common_1.Logger(S3Service_1.name);
    constructor(configService) {
        this.configService = configService;
        this.bucketName = this.configService.get('AWS_S3_BUCKET') || '';
        this.region = this.configService.get('AWS_REGION') || 'us-east-1';
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        if (!accessKeyId || !secretAccessKey) {
            throw new Error('AWS credentials not configured');
        }
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }
    async uploadVideo(file, lessonId) {
        const key = `videos/lessons/${lessonId}/${(0, uuid_1.v4)()}.mp4`;
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                Metadata: {
                    originalName: file.originalname,
                    lessonId,
                    uploadedAt: new Date().toISOString(),
                },
            });
            await this.s3Client.send(command);
            this.logger.log(`Video uploaded successfully: ${key}`);
            return key;
        }
        catch (error) {
            this.logger.error(`Failed to upload video: ${error.message}`);
            throw new Error(`Failed to upload video: ${error.message}`);
        }
    }
    async uploadHLSFiles(lessonId, hlsFiles) {
        const keys = [];
        try {
            for (const filePath of hlsFiles) {
                const fileName = filePath.split('/').pop() || 'unknown';
                const key = `hls/lessons/${lessonId}/${fileName}`;
                const fs = require('fs');
                const fileBuffer = fs.readFileSync(filePath);
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: fileBuffer,
                    ContentType: this.getContentType(fileName),
                });
                await this.s3Client.send(command);
                keys.push(key);
                fs.unlinkSync(filePath);
            }
            this.logger.log(`HLS files uploaded successfully for lesson: ${lessonId}`);
            return keys;
        }
        catch (error) {
            this.logger.error(`Failed to upload HLS files: ${error.message}`);
            throw new Error(`Failed to upload HLS files: ${error.message}`);
        }
    }
    async getSignedUrl(key, expiresIn = 3600) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        }
        catch (error) {
            this.logger.error(`Failed to generate signed URL: ${error.message}`);
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }
    async deleteObject(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            await this.s3Client.send(command);
            this.logger.log(`Object deleted successfully: ${key}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete object: ${error.message}`);
            throw new Error(`Failed to delete object: ${error.message}`);
        }
    }
    getContentType(fileName) {
        if (!fileName)
            return 'application/octet-stream';
        if (fileName.endsWith('.m3u8'))
            return 'application/vnd.apple.mpegurl';
        if (fileName.endsWith('.ts'))
            return 'video/mp2t';
        if (fileName.endsWith('.mp4'))
            return 'video/mp4';
        return 'application/octet-stream';
    }
    getCloudFrontUrl(key) {
        const cloudFrontDomain = this.configService.get('AWS_CLOUDFRONT_DOMAIN');
        if (!cloudFrontDomain) {
            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
        }
        return `https://${cloudFrontDomain}/${key}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = S3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], S3Service);
//# sourceMappingURL=s3.service.js.map