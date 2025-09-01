import { Controller, Get, Post, Body, Param, Request, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccessGrantsService } from './access-grants.service';

@ApiTags('access-grants')
@Controller('access-grants')
export class AccessGrantsController {
  constructor(private readonly accessGrantsService: AccessGrantsService) {}

  @Get('my-courses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user enrolled courses with progress' })
  @ApiResponse({
    status: 200,
    description: 'User courses retrieved successfully',
  })
  async getMyCourses(@Request() req: any) {
    try {
      console.log(`📚 Fetching courses for user: ${req.user.id}`);
      const courses = await this.accessGrantsService.getUserCourses(req.user.id);
      console.log(`✅ Found ${courses.length} courses for user: ${req.user.id}`);
      return courses;
    } catch (error) {
      console.error('❌ Error fetching user courses:', error);
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create access grant' })
  @ApiResponse({
    status: 201,
    description: 'Access grant created successfully',
  })
  create(@Body() createAccessGrantDto: any) {
    return this.accessGrantsService.create(createAccessGrantDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all access grants' })
  @ApiResponse({
    status: 200,
    description: 'Access grants retrieved successfully',
  })
  findAll() {
    return this.accessGrantsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get access grant by id' })
  @ApiResponse({
    status: 200,
    description: 'Access grant retrieved successfully',
  })
  findOne(@Param('id') id: string) {
    return this.accessGrantsService.findOne(id);
  }
}
