import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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

  // PDF Upload method
  async uploadPdf(
    file: Express.Multer.File,
    lessonId: string,
    userId: string,
    userRole: UserRole,
  ) {
    try {
      this.logger.log(`📄 Uploading PDF for lesson ${lessonId} by user ${userId}`);

      // Validate file type
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException(`Invalid file type. Expected application/pdf, got ${file.mimetype}`);
      }

      // Check if lesson exists and user has permission
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { section: { include: { course: true } } },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }

      // Check permissions
      if (userRole === UserRole.STUDENT) {
        throw new ForbiddenException('Students cannot upload PDFs');
      }

      if (userRole === UserRole.INSTRUCTOR) {
        if (lesson.section.course.instructorId !== userId) {
          throw new ForbiddenException('You can only upload PDFs to your own courses');
        }
      }

      // Generate unique filename
      const fileExtension = '.pdf';
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
      
      // For now, save to local storage (you can integrate with S3 later)
      const uploadPath = `./uploads/pdfs/${uniqueFileName}`;
      
      // Ensure directory exists
      const fs = require('fs');
      const path = require('path');
      const uploadDir = path.dirname(uploadPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save file - Debug file object
      console.log('🔍 File object:', {
        buffer: file.buffer ? 'EXISTS' : 'UNDEFINED',
        size: file.size,
        mimetype: file.mimetype,
        originalname: file.originalname,
        fieldname: file.fieldname
      });
      
      // Multer stores file data in buffer property
      if (file.buffer) {
        fs.writeFileSync(uploadPath, file.buffer);
      } else {
        throw new Error('File buffer is undefined');
      }

      // Get file size
      const fileSize = file.size;

      // Update lesson with PDF info
      const updatedLesson = await this.prisma.lesson.update({
        where: { id: lessonId },
        data: {
          pdfUrl: `/uploads/pdfs/${uniqueFileName}`,
          pdfKey: uniqueFileName,
          pdfFileName: file.originalname,
          pdfSize: fileSize,
          contentType: 'PDF',
          // Set duration to 0 for PDFs (they're considered completed when opened)
          duration: 0,
        },
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      });

      this.logger.log(`✅ PDF uploaded successfully for lesson ${lessonId}`);

      return {
        success: true,
        message: 'PDF uploaded successfully',
        data: {
          lessonId,
          pdfUrl: updatedLesson.pdfUrl,
          pdfFileName: updatedLesson.pdfFileName,
          pdfSize: updatedLesson.pdfSize,
          contentType: updatedLesson.contentType,
        },
      };
    } catch (error) {
      this.logger.error(`PDF upload failed: ${error.message}`);
      throw error;
    }
  }

  // PDF Get method
  async getPdf(lessonId: string, userId: string, userRole: UserRole) {
    try {
      this.logger.log(`📄 Getting PDF for lesson ${lessonId} by user ${userId}`);

      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { section: { include: { course: true } } },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }

      if (!lesson.pdfUrl) {
        throw new NotFoundException('No PDF available for this lesson');
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

      return {
        success: true,
        data: {
          lessonId,
          pdfUrl: `http://localhost:3001${lesson.pdfUrl}`,
          pdfFileName: lesson.pdfFileName,
          pdfSize: lesson.pdfSize,
          contentType: lesson.contentType,
        },
      };
    } catch (error) {
      this.logger.error(`PDF retrieval failed: ${error.message}`);
      throw error;
    }
  }
}
