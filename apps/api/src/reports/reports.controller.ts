import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService, DailyStats, WeeklyStats } from './reports.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Reports')
@Controller('admin/reports')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('user-activities')
  @ApiOperation({ summary: 'Get user activities report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  @ApiResponse({
    status: 200,
    description: 'User activities report retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          todayWatched: { type: 'number' },
          todayCompleted: { type: 'number' },
          thisWeekWatched: { type: 'number' },
          thisWeekCompleted: { type: 'number' },
          totalQuestions: { type: 'number' },
          totalNotes: { type: 'number' },
          lastActive: { type: 'string' },
          totalProgress: { type: 'number' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUserActivities(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getUserActivities(period);
  }

  @Get('daily-stats')
  @ApiOperation({ summary: 'Get daily statistics report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  @ApiResponse({
    status: 200,
    description: 'Daily statistics report retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          totalWatched: { type: 'number' },
          totalCompleted: { type: 'number' },
          totalQuestions: { type: 'number' },
          totalNotes: { type: 'number' },
          activeUsers: { type: 'number' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getDailyStats(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getDailyStats(period);
  }

  @Get('weekly-stats')
  @ApiOperation({ summary: 'Get weekly statistics report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  @ApiResponse({
    status: 200,
    description: 'Weekly statistics report retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          week: { type: 'string' },
          totalWatched: { type: 'number' },
          totalCompleted: { type: 'number' },
          totalQuestions: { type: 'number' },
          totalNotes: { type: 'number' },
          activeUsers: { type: 'number' },
          averageProgress: { type: 'number' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getWeeklyStats(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getWeeklyStats(period);
  }

  @Get('detailed-questions')
  @ApiOperation({ summary: 'Get detailed questions report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  @ApiResponse({
    status: 200,
    description: 'Detailed questions report retrieved successfully'
  })
  async getDetailedQuestions(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getDetailedQuestions(period);
  }

  @Get('detailed-notes')
  @ApiOperation({ summary: 'Get detailed notes report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  @ApiResponse({
    status: 200,
    description: 'Detailed notes report retrieved successfully'
  })
  async getDetailedNotes(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getDetailedNotes(period);
  }

  @Get('lesson-activity/:lessonId')
  @ApiOperation({ summary: 'Get lesson activity report' })
  @ApiResponse({
    status: 200,
    description: 'Lesson activity report retrieved successfully'
  })
  async getLessonActivity(@Param('lessonId') lessonId: string) {
    return this.reportsService.getLessonActivity(lessonId);
  }
}
