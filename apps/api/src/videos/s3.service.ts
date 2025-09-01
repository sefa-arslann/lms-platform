import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || '';
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadVideo(file: Express.Multer.File, lessonId: string): Promise<string> {
    const key = `videos/lessons/${lessonId}/${uuidv4()}.mp4`;
    
    try {
      const command = new PutObjectCommand({
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
    } catch (error) {
      this.logger.error(`Failed to upload video: ${error.message}`);
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }

  async uploadHLSFiles(lessonId: string, hlsFiles: string[]): Promise<string[]> {
    const keys: string[] = [];
    
    try {
      for (const filePath of hlsFiles) {
        const fileName = filePath.split('/').pop() || 'unknown';
        const key = `hls/lessons/${lessonId}/${fileName}`;
        
        // Read file and upload to S3
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(filePath);
        
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: this.getContentType(fileName),
        });

        await this.s3Client.send(command);
        keys.push(key);
        
        // Clean up local file
        fs.unlinkSync(filePath);
      }
      
      this.logger.log(`HLS files uploaded successfully for lesson: ${lessonId}`);
      return keys;
    } catch (error) {
      this.logger.error(`Failed to upload HLS files: ${error.message}`);
      throw new Error(`Failed to upload HLS files: ${error.message}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Object deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete object: ${error.message}`);
      throw new Error(`Failed to delete object: ${error.message}`);
    }
  }

  private getContentType(fileName: string): string {
    if (!fileName) return 'application/octet-stream';
    if (fileName.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
    if (fileName.endsWith('.ts')) return 'video/mp2t';
    if (fileName.endsWith('.mp4')) return 'video/mp4';
    return 'application/octet-stream';
  }

  getCloudFrontUrl(key: string): string {
    const cloudFrontDomain = this.configService.get<string>('AWS_CLOUDFRONT_DOMAIN');
    if (!cloudFrontDomain) {
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }
    return `https://${cloudFrontDomain}/${key}`;
  }
}
