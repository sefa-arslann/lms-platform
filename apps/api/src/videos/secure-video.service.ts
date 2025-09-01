import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AccessGrantsService } from '../access-grants/access-grants.service';

@Injectable()
export class SecureVideoService {
  private readonly logger = new Logger(SecureVideoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly accessGrantsService: AccessGrantsService,
  ) {}

  // Generate video access token
  async generateVideoToken(userId: string, lessonId: string, expiresIn: number = 3600): Promise<string> {
    try {
      // Check if user has access to this lesson
      const hasAccess = await this.accessGrantsService.checkLessonAccess(userId, lessonId);
      
      if (!hasAccess) {
        throw new Error('User does not have access to this lesson');
      }

      // Generate JWT token for video access
      const payload = {
        userId,
        lessonId,
        type: 'video-access',
        exp: Math.floor(Date.now() / 1000) + expiresIn,
      };

      const token = this.jwtService.sign(payload);
      this.logger.log(`Video access token generated for user ${userId}, lesson ${lessonId}`);
      
      return token;
    } catch (error) {
      this.logger.error(`Error generating video token: ${error.message}`);
      throw error;
    }
  }

  // Generate secure video URL with external source support
  async generateSecureVideoUrl(userId: string, lessonId: string): Promise<string> {
    try {
      // Check access
      const hasAccess = await this.accessGrantsService.checkLessonAccess(userId, lessonId);
      
      if (!hasAccess) {
        throw new Error('User does not have access to this lesson');
      }

      // Get lesson video info
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { videoUrl: true, videoKey: true },
      });

      if (!lesson) {
        throw new Error('Video not found for this lesson');
      }

      // If we have a direct video URL, create a secure signed URL
      if (lesson.videoUrl) {
        // Create a secure signed URL with user and lesson info
        const baseUrl = new URL(lesson.videoUrl);
        
        // Add security parameters
        baseUrl.searchParams.set('user', userId);
        baseUrl.searchParams.set('lesson', lessonId);
        baseUrl.searchParams.set('timestamp', Date.now().toString());
        
        // Add a simple hash for basic security (in production, use proper JWT signing)
        const hash = this.generateSimpleHash(userId + lessonId + Date.now().toString());
        baseUrl.searchParams.set('hash', hash);
        
        return baseUrl.toString();
      }

      // If we have videoKey but no URL, construct a secure URL
      if (lesson.videoKey) {
        const baseUrl = process.env.VIDEO_CDN_URL || 'http://localhost:3001';
        const secureUrl = new URL(`${baseUrl}/videos/stream/${lesson.videoKey}`);
        
        // Add security parameters
        secureUrl.searchParams.set('user', userId);
        secureUrl.searchParams.set('lesson', lessonId);
        secureUrl.searchParams.set('timestamp', Date.now().toString());
        
        const hash = this.generateSimpleHash(userId + lessonId + Date.now().toString());
        secureUrl.searchParams.set('hash', hash);
        
        return secureUrl.toString();
      }

      throw new Error('No video source found for this lesson');
    } catch (error) {
      this.logger.error(`Error generating secure video URL: ${error.message}`);
      throw error;
    }
  }

  // Simple hash generation for URL signing (in production, use proper JWT)
  private generateSimpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Generate secure thumbnail URL
  async generateSecureThumbnailUrl(userId: string, lessonId: string): Promise<string> {
    try {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { thumbnail: true },
      });

      // If no thumbnail, return a default placeholder
      if (!lesson || !lesson.thumbnail) {
        return '/api/images/default-thumbnail.jpg'; // Default placeholder
      }

      // Return a local API endpoint for thumbnails
      const secureUrl = `/api/secure-video/lesson/${lessonId}/thumbnail?user=${userId}`;
      return secureUrl;
    } catch (error) {
      this.logger.error(`Error generating secure thumbnail URL: ${error.message}`);
      // Return default thumbnail on error
      return '/api/images/default-thumbnail.jpg';
    }
  }

  // Check if user has access to a lesson
  async checkLessonAccess(userId: string, lessonId: string): Promise<boolean> {
    try {
      return await this.accessGrantsService.checkLessonAccess(userId, lessonId);
    } catch (error) {
      this.logger.error(`Error checking lesson access: ${error.message}`);
      return false;
    }
  }

  // Get lesson video info without generating external URLs
  async getLessonVideoInfo(userId: string, lessonId: string): Promise<{
    videoUrl: string | null;
    videoKey: string | null;
    thumbnail: string | null;
  } | null> {
    try {
      // Check access
      const hasAccess = await this.accessGrantsService.checkLessonAccess(userId, lessonId);
      
      if (!hasAccess) {
        throw new Error('User does not have access to this lesson');
      }

      // Get lesson video info
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { 
          videoUrl: true, 
          videoKey: true, 
          thumbnail: true 
        },
      });

      if (!lesson) {
        throw new Error('Video not found for this lesson');
      }

      return lesson;
    } catch (error) {
      this.logger.error(`Error getting lesson video info: ${error.message}`);
      throw error;
    }
  }

  // Get video streaming info with security
  async getVideoStreamingInfo(userId: string, lessonId: string): Promise<{
    secureUrl: string;
    thumbnailUrl: string;
    expiresAt: number;
    quality: string[];
  }> {
    try {
      const secureUrl = await this.generateSecureVideoUrl(userId, lessonId);
      const thumbnailUrl = await this.generateSecureThumbnailUrl(userId, lessonId);
      
      // Token expires in 1 hour
      const expiresAt = Date.now() + 3600 * 1000;
      
      // Available quality options
      const quality = ['480p', '720p', '1080p'];

      return {
        secureUrl,
        thumbnailUrl,
        expiresAt,
        quality,
      };
    } catch (error) {
      this.logger.error(`Error getting video streaming info: ${error.message}`);
      throw error;
    }
  }
}
