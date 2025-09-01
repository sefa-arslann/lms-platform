import { Controller, Get, Post, Patch, Param, Body, Request, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LessonProgressService } from './lesson-progress.service';

@ApiTags('lesson-progress')
@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Get('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user progress for a specific lesson' })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress retrieved successfully',
  })
  async getLessonProgress(
    @Param('lessonId') lessonId: string,
    @Request() req: any
  ) {
    try {
      console.log(`📊 Getting progress for lesson ${lessonId} by user ${req.user.id}`);
      const progress = await this.lessonProgressService.getLessonProgress(req.user.id, lessonId);
      return progress;
    } catch (error) {
      console.error('❌ Error getting lesson progress:', error);
      throw error;
    }
  }

  @Post('lesson/:lessonId/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lesson progress' })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress updated successfully',
  })
  async updateLessonProgress(
    @Param('lessonId') lessonId: string,
    @Body() updateData: {
      progress: number;
      duration: number;
      lastPosition: number;
      completed?: boolean;
    },
    @Request() req: any
  ) {
    try {
      console.log(`📊 Updating progress for lesson ${lessonId} by user ${req.user.id}`);
      const progress = await this.lessonProgressService.updateLessonProgress(
        req.user.id,
        lessonId,
        updateData
      );
      return progress;
    } catch (error) {
      console.error('❌ Error updating lesson progress:', error);
      throw error;
    }
  }

  @Patch('lesson/:lessonId/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark lesson as completed' })
  @ApiResponse({
    status: 200,
    description: 'Lesson marked as completed successfully',
  })
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @Request() req: any
  ) {
    try {
      console.log(`🎯 Marking lesson ${lessonId} as completed by user ${req.user.id}`);
      const progress = await this.lessonProgressService.completeLesson(req.user.id, lessonId);
      return progress;
    } catch (error) {
      console.error('❌ Error completing lesson:', error);
      throw error;
    }
  }

  @Get('course/:courseId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course progress for user' })
  @ApiResponse({
    status: 200,
    description: 'Course progress retrieved successfully',
  })
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @Request() req: any
  ) {
    try {
      console.log(`📚 Getting course progress for course ${courseId} by user ${req.user.id}`);
      const progress = await this.lessonProgressService.getCourseProgress(req.user.id, courseId);
      return progress;
    } catch (error) {
      console.error('❌ Error getting course progress:', error);
      throw error;
    }
  }

  @Get('course/:courseId/lessons')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lessons progress for a course' })
  @ApiResponse({
    status: 200,
    description: 'All lessons progress retrieved successfully',
  })
  async getCourseLessonsProgress(
    @Param('courseId') courseId: string,
    @Request() req: any
  ) {
    try {
      console.log(`📚 Getting all lessons progress for course ${courseId} by user ${req.user.id}`);
      const progress = await this.lessonProgressService.getCourseLessonsProgress(req.user.id, courseId);
      return progress;
    } catch (error) {
      console.error('❌ Error getting course lessons progress:', error);
      throw error;
    }
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user learning statistics' })
  @ApiResponse({
    status: 200,
    description: 'User learning stats retrieved successfully',
  })
  async getUserLearningStats(@Request() req: any) {
    try {
      console.log(`📊 Getting learning stats for user ${req.user.id}`);
      const stats = await this.lessonProgressService.getUserLearningStats(req.user.id);
      return stats;
    } catch (error) {
      console.error('❌ Error getting user learning stats:', error);
      throw error;
    }
  }

  @Get('user/last-watched')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user last watched course' })
  @ApiResponse({
    status: 200,
    description: 'Last watched course retrieved successfully',
  })
  async getLastWatchedCourse(@Request() req: any) {
    try {
      console.log(`🎬 Getting last watched course for user ${req.user.id}`);
      const lastWatched = await this.lessonProgressService.getLastWatchedCourse(req.user.id);
      return lastWatched;
    } catch (error) {
      console.error('❌ Error getting last watched course:', error);
      throw error;
    }
  }

  @Get('user/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lesson progress for user' })
  @ApiResponse({
    status: 200,
    description: 'All lesson progress retrieved successfully',
  })
  async getAllLessonProgress(@Request() req: any) {
    try {
      console.log(`📊 Getting all lesson progress for user ${req.user.id}`);
      const allProgress = await this.lessonProgressService.getAllLessonProgress(req.user.id);
      return allProgress;
    } catch (error) {
      console.error('❌ Error getting all lesson progress:', error);
      throw error;
    }
  }

  @Delete('user/reset')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset all lesson progress for user' })
  @ApiResponse({
    status: 200,
    description: 'All lesson progress reset successfully',
  })
  async resetAllLessonProgress(@Request() req: any) {
    try {
      console.log(`🗑️ Resetting all lesson progress for user ${req.user.id}`);
      const result = await this.lessonProgressService.resetAllLessonProgress(req.user.id);
      return result;
    } catch (error) {
      console.error('❌ Error resetting all lesson progress:', error);
      throw error;
    }
  }
}
