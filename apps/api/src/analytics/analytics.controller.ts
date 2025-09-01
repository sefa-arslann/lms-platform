import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Public endpoints for tracking (no auth required)
  @Post('track/page-view')
  @ApiOperation({ summary: 'Track page view' })
  @ApiResponse({ status: 201, description: 'Page view tracked successfully' })
  async trackPageView(
    @Body() data: { userId?: string; page: string; metadata?: any },
  ) {
    return this.analyticsService.trackPageView(data.userId || null, data.page, data.metadata);
  }

  @Post('track/course-view')
  @ApiOperation({ summary: 'Track course view' })
  @ApiResponse({ status: 201, description: 'Course view tracked successfully' })
  async trackCourseView(
    @Body() data: { userId?: string; courseId: string; viewType: string },
  ) {
    return this.analyticsService.trackCourseView(data.userId || null, data.courseId, data.viewType);
  }

  @Post('track/video-action')
  @ApiOperation({ summary: 'Track video action' })
  @ApiResponse({ status: 201, description: 'Video action tracked successfully' })
  async trackVideoAction(
    @Body() data: { userId?: string; videoId: string; action: string; timestamp?: number },
  ) {
    return this.analyticsService.trackVideoAction(data.userId || null, data.videoId, data.action, data.timestamp);
  }

  @Post('track/session')
  @ApiOperation({ summary: 'Track user session' })
  @ApiResponse({ status: 201, description: 'Session tracked successfully' })
  async trackSession(
    @Body() data: { userId: string; sessionId: string; deviceId?: string; ipAddress?: string },
  ) {
    return this.analyticsService.trackUserSession(data.userId, data.sessionId, data.deviceId, data.ipAddress);
  }

  @Post('track/session-activity')
  @ApiOperation({ summary: 'Update session activity' })
  @ApiResponse({ status: 200, description: 'Session activity updated successfully' })
  async updateSessionActivity(
    @Body() data: { sessionId: string },
  ) {
    return this.analyticsService.updateSessionActivity(data.sessionId);
  }

  // Admin-only endpoints
  @Get('admin/real-time')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get real-time dashboard data (Admin only)' })
  @ApiResponse({ status: 200, description: 'Real-time data retrieved successfully' })
  async getRealTimeData() {
    return this.analyticsService.getRealTimeDashboardData();
  }

  @Get('admin/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get analytics summary (Admin only)' })
  @ApiResponse({ status: 200, description: 'Analytics summary retrieved successfully' })
  async getAnalyticsSummary(
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
  ) {
    return this.analyticsService.getAnalyticsSummary(period);
  }
}
