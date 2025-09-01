import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService, private readonly prisma: PrismaService) {}

  @Post('upload/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video for a lesson (Instructor/Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Video uploaded and processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Lesson not found',
  })
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Param('lessonId') lessonId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB
          new FileTypeValidator({ fileType: 'video/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.videosService.uploadVideo(file, lessonId, req.user.id, req.user.role);
  }

  // Simple video stream endpoint for testing
  @Get('stream/:lessonId')
  async streamVideo(@Param('lessonId') lessonId: string, @Res() res: any) {
    try {
      console.log(`🎥 Streaming video for lesson ${lessonId}`);
      
      // Get lesson video info
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { videoUrl: true, videoKey: true },
      });

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      if (lesson.videoUrl) {
        // Redirect to the actual video URL
        return res.redirect(lesson.videoUrl);
      }

      if (lesson.videoKey) {
        // For now, return video key info
        return res.json({
          success: true,
          data: {
            videoKey: lesson.videoKey,
            message: 'Video key found, implement streaming logic'
          }
        });
      }

      return res.status(404).json({ error: 'No video source found' });
    } catch (error) {
      console.error('❌ Error streaming video:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  @Get('hls/:lessonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get HLS stream URL' })
  @ApiResponse({
    status: 200,
    description: 'HLS stream URL generated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Access denied',
  })
  @ApiResponse({
    status: 404,
    description: 'Lesson or HLS stream not found',
  })
  async getHLSStream(@Param('lessonId') lessonId: string, @Request() req: any) {
    return this.videosService.getHLSStream(lessonId, req.user.id, req.user.role);
  }

  @Delete(':lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete video from lesson (Instructor/Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Video deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Lesson not found',
  })
  async deleteVideo(@Param('lessonId') lessonId: string, @Request() req: any) {
    return this.videosService.deleteVideo(lessonId, req.user.id, req.user.role);
  }

  @Post(':lessonId/watermark')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add watermark to video (Instructor/Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Watermark added successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Lesson or video not found',
  })
  async addWatermark(
    @Param('lessonId') lessonId: string,
    @Body() body: { watermarkText: string },
    @Request() req: any,
  ) {
    return this.videosService.addWatermark(
      lessonId,
      body.watermarkText,
      req.user.id,
      req.user.role,
    );
  }
}
