import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SemestersService } from './semesters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('semesters')
@Controller('semesters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Get('current-period')
  @ApiOperation({ summary: 'Get current education period' })
  @ApiResponse({ status: 200, description: 'Current period retrieved successfully' })
  getCurrentPeriod() {
    return this.semestersService.getCurrentPeriod();
  }

  @Get('course-access-duration')
  @ApiOperation({ summary: 'Calculate course access duration' })
  @ApiResponse({ status: 200, description: 'Course access duration calculated successfully' })
  getCourseAccessDuration() {
    return this.semestersService.calculateCourseAccessDuration();
  }
}
