import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

@Injectable()
export class VideoMetadataService {
  private readonly logger = new Logger(VideoMetadataService.name);

  async getVideoDuration(videoUrl: string): Promise<number> {
    try {
      this.logger.log(`Getting video duration for: ${videoUrl}`);
      
      // FFprobe kullanarak video süresini al
      const command = `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoUrl}"`;
      
      const { stdout } = await execAsync(command);
      const duration = parseFloat(stdout.trim());
      
      if (isNaN(duration)) {
        throw new Error('Invalid duration returned from ffprobe');
      }
      
      // Saniyeyi olduğu gibi döndür (dakikaya çevirme)
      const durationInSeconds = Math.ceil(duration);
      
      // Saniye olarak log
      this.logger.log(`Video duration: ${durationInSeconds} seconds`);
      return durationInSeconds;
    } catch (error) {
      this.logger.error(`Error getting video duration: ${error.message}`);
      
      // Fallback: URL'den tahmin et
      return this.estimateDurationFromUrl(videoUrl);
    }
  }

  async getVideoMetadata(videoUrl: string): Promise<{
    duration: number;
    width?: number;
    height?: number;
    format?: string;
    bitrate?: number;
  }> {
    try {
      this.logger.log(`Getting video metadata for: ${videoUrl}`);
      
      // FFprobe kullanarak detaylı metadata al
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
    } catch (error) {
      this.logger.error(`Error getting video metadata: ${error.message}`);
      
      // Fallback: Sadece süre
      const duration = await this.getVideoDuration(videoUrl);
      return { duration };
    }
  }

  private estimateDurationFromUrl(videoUrl: string): number {
    // URL'den video tipine göre tahmin et (saniye cinsinden)
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      return 15 * 60; // YouTube videosu varsayılan 15 dakika = 900 saniye
    } else if (videoUrl.includes('vimeo.com')) {
      return 20 * 60; // Vimeo videosu varsayılan 20 dakika = 1200 saniye
    } else if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.avi') || videoUrl.endsWith('.mov')) {
      return 25 * 60; // Yerel video dosyası varsayılan 25 dakika = 1500 saniye
    } else {
      return 15 * 60; // Genel varsayılan 15 dakika = 900 saniye
    }
  }

  async isVideoUrlValid(videoUrl: string): Promise<boolean> {
    try {
      // Basit URL validation
      const url = new URL(videoUrl);
      
      // Video formatları
      const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
      const hasVideoExtension = videoExtensions.some(ext => 
        url.pathname.toLowerCase().includes(ext)
      );
      
      // Video platformları
      const videoPlatforms = [
        'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
        'facebook.com', 'instagram.com', 'tiktok.com'
      ];
      const isVideoPlatform = videoPlatforms.some(platform => 
        url.hostname.includes(platform)
      );
      
      return hasVideoExtension || isVideoPlatform;
    } catch (error) {
      return false;
    }
  }
}
