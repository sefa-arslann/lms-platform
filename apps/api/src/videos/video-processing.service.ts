import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideoProcessingService {
  private readonly logger = new Logger(VideoProcessingService.name);
  private readonly outputDir: string;

  constructor(private readonly configService: ConfigService) {
    this.outputDir = './uploads/processed';
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async convertToHLS(
    inputPath: string,
    lessonId: string,
    quality: 'low' | 'medium' | 'high' = 'medium',
  ): Promise<string[]> {
    const outputDir = path.join(this.outputDir, lessonId);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'playlist.m3u8');
    
    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath);

      // Set quality settings
      const qualitySettings = this.getQualitySettings(quality);
      
      command
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-hls_time 6',           // Segment duration
          '-hls_list_size 0',      // Keep all segments
          '-hls_segment_filename', `${outputDir}/segment_%03d.ts`,
          '-f hls',                 // Output format
          '-preset', 'fast',        // Encoding preset
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
          
          // Get all generated files
          const files = this.getGeneratedFiles(outputDir);
          resolve(files);
          
          // Clean up input file
          fs.unlinkSync(inputPath);
        })
        .on('error', (err) => {
          this.logger.error(`HLS conversion failed: ${err.message}`);
          reject(new Error(`HLS conversion failed: ${err.message}`));
        })
        .run();
    });
  }

  async addWatermark(
    inputPath: string,
    lessonId: string,
    watermarkText: string,
  ): Promise<string> {
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

  async generateThumbnail(
    inputPath: string,
    lessonId: string,
    time: string = '00:00:05',
  ): Promise<string> {
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

  async getVideoMetadata(inputPath: string): Promise<{
    duration: number;
    width: number;
    height: number;
    bitrate: number;
    fps: number;
  }> {
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

  private getQualitySettings(quality: 'low' | 'medium' | 'high') {
    switch (quality) {
      case 'low':
        return { crf: 28, maxrate: 800, bufsize: 1600, width: 640, height: 360 };
      case 'high':
        return { crf: 18, maxrate: 4000, bufsize: 8000, width: 1920, height: 1080 };
      default: // medium
        return { crf: 23, maxrate: 2000, bufsize: 4000, width: 1280, height: 720 };
    }
  }

  private getGeneratedFiles(outputDir: string): string[] {
    const files: string[] = [];
    
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

  private parseFrameRate(frameRate: string): number {
    const [numerator, denominator] = frameRate.split('/');
    return parseInt(numerator) / parseInt(denominator);
  }

  async cleanupTempFiles(lessonId: string): Promise<void> {
    const outputDir = path.join(this.outputDir, lessonId);
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      this.logger.log(`Cleaned up temp files for lesson: ${lessonId}`);
    }
  }
}
