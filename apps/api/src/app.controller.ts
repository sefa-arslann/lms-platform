import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test() {
    return { message: 'App test endpoint working!', timestamp: new Date() };
  }

  @Get('ping')
  ping() {
    return { message: 'pong', timestamp: new Date() };
  }

  @Get('test-video/:lessonId')
  async testVideo(@Param('lessonId') lessonId: string) {
    try {
      console.log(`🎥 Testing video for lesson ${lessonId}`);
      
      // This is a simple test endpoint
      return {
        success: true,
        message: 'Video test endpoint working',
        lessonId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error in test video endpoint:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('video-test/:lessonId')
  async videoTest(@Param('lessonId') lessonId: string) {
    try {
      console.log(`🎥 Testing video for lesson ${lessonId}`);
      
      // This is a simple test endpoint that bypasses all security
      return {
        success: true,
        message: 'Video test endpoint working',
        lessonId,
        videoUrl: 'http://arsolix.com/1.mp4', // Direct URL for testing
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error in video test endpoint:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('video-direct/:lessonId')
  async videoDirect(@Param('lessonId') lessonId: string) {
    try {
      console.log(`🎥 Direct video access for lesson ${lessonId}`);
      
      // Return the actual video URL from database
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { videoUrl: true, title: true },
      });

      if (!lesson) {
        return {
          success: false,
          error: 'Lesson not found'
        };
      }

      return {
        success: true,
        lessonId,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        message: 'Direct video URL retrieved',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error in direct video endpoint:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('video-simple')
  async videoSimple() {
    try {
      console.log(`🎥 Simple video test endpoint`);
      
      // Return the real video URL directly
      return {
        success: true,
        message: 'Simple video endpoint working',
        videoUrl: 'http://arsolix.com/1.mp4',
        lessonId: 'cmemoob920001kh1jih1chy3c',
        title: 'Vue.js Kurulumu',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error in simple video endpoint:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
