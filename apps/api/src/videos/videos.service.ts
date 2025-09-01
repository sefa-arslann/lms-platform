import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';
import { VideoProcessingService } from './video-processing.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
    private readonly videoProcessingService: VideoProcessingService,
  ) {}

  async uploadVideo(
    file: Express.Multer.File,
    lessonId: string,
    userId: string,
    userRole: UserRole,
  ) {
    // Check if lesson exists and user has access
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check permissions
    if (userRole === UserRole.INSTRUCTOR && lesson.section.course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === UserRole.STUDENT) {
      throw new ForbiddenException('Students cannot upload videos');
    }

    try {
      // Get video metadata
      const metadata = await this.videoProcessingService.getVideoMetadata(file.path);

      // Upload original video to S3
      const videoKey = await this.s3Service.uploadVideo(file, lessonId);

      // Convert to HLS
      const hlsFiles = await this.videoProcessingService.convertToHLS(
        file.path,
        lessonId,
        'medium',
      );

      // Upload HLS files to S3
      const hlsKeys = await this.s3Service.uploadHLSFiles(lessonId, hlsFiles);

      // Generate thumbnail
      const thumbnailPath = await this.videoProcessingService.generateThumbnail(
        file.path,
        lessonId,
      );

      // Upload thumbnail to S3
      const thumbnailKey = await this.s3Service.uploadVideo(
        { ...file, path: thumbnailPath } as any,
        lessonId,
      );

      // Update lesson with video information
      const updatedLesson = await this.prisma.lesson.update({
        where: { id: lessonId },
        data: {
          videoUrl: this.s3Service.getCloudFrontUrl(videoKey),
          videoKey,
          thumbnail: this.s3Service.getCloudFrontUrl(thumbnailKey),
          duration: Math.round(metadata.duration),
          isPublished: false, // Video needs review before publishing
        },
      });

      // Clean up temp files
      await this.videoProcessingService.cleanupTempFiles(lessonId);

      this.logger.log(`Video uploaded and processed successfully for lesson: ${lessonId}`);

      return {
        lesson: updatedLesson,
        videoKey,
        hlsKeys,
        thumbnailKey,
        metadata,
      };
    } catch (error) {
      this.logger.error(`Video upload failed: ${error.message}`);
      throw error;
    }
  }

  async getVideoStream(lessonId: string, userId: string, userRole: UserRole) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (!lesson.videoKey) {
      throw new NotFoundException('No video available for this lesson');
    }

          // Check if user has access to the course
      if (userRole === UserRole.STUDENT) {
        const accessGrant = await this.prisma.accessGrant.findFirst({
          where: {
            userId,
            courseId: lesson.section.courseId,
            isActive: true,
          },
        });

      if (!accessGrant) {
        throw new ForbiddenException('Access denied - Course not purchased');
      }
    }

    // Generate signed URL for video access
    const signedUrl = await this.s3Service.getSignedUrl(lesson.videoKey, 3600); // 1 hour

    return {
      lessonId,
      videoUrl: signedUrl,
      thumbnail: lesson.thumbnail,
      duration: lesson.duration,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    };
  }

  async getHLSStream(lessonId: string, userId: string, userRole: UserRole) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check access permissions (same as getVideoStream)
    if (userRole === UserRole.STUDENT) {
      const accessGrant = await this.prisma.accessGrant.findFirst({
        where: {
          userId,
          courseId: lesson.section.courseId,
          isActive: true,
        },
      });

      if (!accessGrant) {
        throw new ForbiddenException('Access denied - Course not purchased');
      }
    }

    // For HLS, we return the CloudFront URL (no signed URL needed for public HLS)
    const hlsUrl = lesson.videoKey?.replace('videos/', 'hls/').replace('.mp4', '/playlist.m3u8');
    
    if (!hlsUrl) {
      throw new NotFoundException('HLS stream not available');
    }

    return {
      lessonId,
      hlsUrl: this.s3Service.getCloudFrontUrl(hlsUrl),
      thumbnail: lesson.thumbnail,
      duration: lesson.duration,
    };
  }

  async deleteVideo(lessonId: string, userId: string, userRole: UserRole) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (userRole === UserRole.INSTRUCTOR && lesson.section.course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      // Delete from S3
      if (lesson.videoKey) {
        await this.s3Service.deleteObject(lesson.videoKey);
      }

      // Update lesson
      await this.prisma.lesson.update({
        where: { id: lessonId },
        data: {
          videoUrl: null,
          videoKey: null,
          thumbnail: null,
          duration: undefined,
        },
      });

      this.logger.log(`Video deleted successfully for lesson: ${lessonId}`);
      return { message: 'Video deleted successfully' };
    } catch (error) {
      this.logger.error(`Video deletion failed: ${error.message}`);
      throw error;
    }
  }

  async addWatermark(
    lessonId: string,
    watermarkText: string,
    userId: string,
    userRole: UserRole,
  ) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });

    if (!lesson || !lesson.videoKey) {
      throw new NotFoundException('Lesson or video not found');
    }

    if (userRole === UserRole.INSTRUCTOR && lesson.section.course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      // Download video from S3 temporarily
      const tempPath = `./uploads/temp/${lessonId}_temp.mp4`;
      // TODO: Implement S3 download functionality

      // Add watermark
      const watermarkedPath = await this.videoProcessingService.addWatermark(
        tempPath,
        lessonId,
        watermarkText,
      );

      // Upload watermarked video
      const newVideoKey = await this.s3Service.uploadVideo(
        { path: watermarkedPath } as any,
        lessonId,
      );

      // Update lesson
      await this.prisma.lesson.update({
        where: { id: lessonId },
        data: {
          videoKey: newVideoKey,
          videoUrl: this.s3Service.getCloudFrontUrl(newVideoKey),
        },
      });

      // Clean up
      await this.videoProcessingService.cleanupTempFiles(lessonId);

      return { message: 'Watermark added successfully', videoKey: newVideoKey };
    } catch (error) {
      this.logger.error(`Watermark addition failed: ${error.message}`);
      throw error;
    }
  }
}
