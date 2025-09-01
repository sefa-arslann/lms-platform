import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Patch,
  Body,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ReportsService, DailyStats, WeeklyStats } from '../reports/reports.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN)
// @ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly reportsService: ReportsService
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  async test() {
    return { message: 'Admin test endpoint working!', timestamp: new Date() };
  }



  @Patch('devices/:id/status')
  @ApiOperation({ summary: 'Update device status' })
  @ApiResponse({
    status: 200,
    description: 'Device status updated successfully',
  })
  async updateDeviceStatus(
    @Param('id') deviceId: string,
    @Body() body: { isActive: boolean; isTrusted?: boolean }
  ) {
    return this.adminService.updateDeviceStatus(deviceId, body);
  }

  @Delete('devices/:id')
  @ApiOperation({ summary: 'Delete device' })
  @ApiResponse({
    status: 200,
    description: 'Device deleted successfully',
  })
  async deleteDevice(@Param('id') deviceId: string) {
    return this.adminService.deleteDevice(deviceId);
  }

  @Get('devices')
  @ApiOperation({ summary: 'Get all user devices' })
  @ApiResponse({ status: 200, description: 'User devices retrieved successfully' })
  async getUserDevices() {
    try {
      return await this.adminService.getUserDevices();
    } catch (error) {
      console.error('Controller error:', error);
      return { devices: [] };
    }
  }



  @Get('users/stats')
  @ApiOperation({ summary: 'Get user management statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getUserManagementStats() {
    return this.adminService.getUserManagementStats();
  }

  // Reports endpoints
  @Get('reports/user-activities')
  @ApiOperation({ summary: 'Get user activities report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  async getUserActivities(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getUserActivities(period);
  }

  @Get('reports/daily-stats')
  @ApiOperation({ summary: 'Get daily statistics report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  async getDailyStats(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getDailyStats(period);
  }

  @Get('reports/weekly-stats')
  @ApiOperation({ summary: 'Get weekly statistics report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  async getWeeklyStats(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getWeeklyStats(period);
  }

  @Get('reports/detailed-questions')
  @ApiOperation({ summary: 'Get detailed questions report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  async getDetailedQuestions(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getDetailedQuestions(period);
  }

  @Get('reports/detailed-notes')
  @ApiOperation({ summary: 'Get detailed notes report' })
  @ApiQuery({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' })
  async getDetailedNotes(@Query('period') period: 'today' | 'week' | 'month' = 'today') {
    return this.reportsService.getDetailedNotes(period);
  }

  @Get('reports/lesson-activity/:lessonId')
  @ApiOperation({ summary: 'Get lesson activity report' })
  async getLessonActivity(@Param('lessonId') lessonId: string) {
    return this.reportsService.getLessonActivity(lessonId);
  }

  // Soru-Cevap Yönetimi
  @Get('questions')
  @ApiOperation({ summary: 'Get all questions for admin' })
  @ApiQuery({ name: 'status', enum: ['all', 'unanswered', 'answered'], description: 'Question status filter' })
  async getAllQuestions(@Query('status') status: 'all' | 'unanswered' | 'answered' = 'all') {
    return this.adminService.getAllQuestions(status);
  }

  @Get('questions/:questionId')
  @ApiOperation({ summary: 'Get question details' })
  async getQuestionDetails(@Param('questionId') questionId: string) {
    return this.adminService.getQuestionDetails(questionId);
  }

  @Post('questions/:questionId/answer')
  @ApiOperation({ summary: 'Admin answer to question' })
  async answerQuestion(
    @Param('questionId') questionId: string,
    @Body() body: { content: string }
  ) {
    return this.adminService.answerQuestion(questionId, body.content);
  }

  @Patch('questions/:questionId/status')
  @ApiOperation({ summary: 'Update question status' })
  async updateQuestionStatus(
    @Param('questionId') questionId: string,
    @Body() body: { status: 'pending' | 'answered' | 'closed' }
  ) {
    return this.adminService.updateQuestionStatus(questionId, body.status);
  }

  // Silme İşlemleri
  @Delete('questions/:questionId')
  @ApiOperation({ summary: 'Delete question and all answers' })
  async deleteQuestion(@Param('questionId') questionId: string) {
    return this.adminService.deleteQuestion(questionId);
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: 'Delete note' })
  async deleteNote(@Param('noteId') noteId: string) {
    return this.adminService.deleteNote(noteId);
  }

  @Delete('messages/:messageId')
  @ApiOperation({ summary: 'Delete message and all replies' })
  async deleteMessage(@Param('messageId') messageId: string) {
    return this.adminService.deleteMessage(messageId);
  }

  @Delete('answers/:answerId')
  @ApiOperation({ summary: 'Delete specific answer' })
  async deleteAnswer(@Param('answerId') answerId: string) {
    return this.adminService.deleteAnswer(answerId);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders for admin' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  async getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: string }
  ) {
    return this.adminService.updateOrderStatus(orderId, body.status);
  }

  @Get('courses/stats')
  @ApiOperation({ summary: 'Get course management statistics' })
  @ApiResponse({
    status: 200,
    description: 'Course statistics retrieved successfully',
  })
  async getCourseManagementStats() {
    return this.adminService.getCourseManagementStats();
  }

  @Get('devices/stats')
  @ApiOperation({ summary: 'Get device management statistics' })
  @ApiResponse({
    status: 200,
    description: 'Device statistics retrieved successfully',
  })
  async getDeviceManagementStats() {
    return this.adminService.getDeviceManagementStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.adminService['prisma'].user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.adminService['prisma'].user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
  })
  async changeUserRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.adminService['prisma'].user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Change user status (active/inactive)' })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully',
  })
  async changeUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService['prisma'].user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  @Get('courses/pending')
  @ApiOperation({ summary: 'Get pending course approvals' })
  @ApiResponse({
    status: 200,
    description: 'Pending courses retrieved successfully',
  })
  async getPendingCourses() {
    return this.adminService['prisma'].course.findMany({
      where: { isPublished: false },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sections: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get course by ID with full details' })
  @ApiResponse({
    status: 200,
    description: 'Course retrieved successfully',
  })
  async getCourseById(@Param('id') id: string) {
    try {
      const course = await this.adminService['prisma'].course.findUnique({
        where: { id },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          sections: {
            include: {
              lessons: {
                select: { 
                  id: true,
                  title: true,
                  description: true,
                  duration: true,
                  order: true,
                  isPublished: true,
                  videoUrl: true,
                  thumbnail: true,
                  videoType: true,
                  isFree: true,
                  resources: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      });
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      return course;
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get all courses with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['all', 'published', 'draft'] })
  @ApiQuery({ name: 'level', required: false, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
  })
  async getCourses(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status = 'all',
    @Query('level') level?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Status filter
    if (status === 'published') where.isPublished = true;
    else if (status === 'draft') where.isPublished = false;
    
    // Level filter
    if (level) where.level = level;
    
    // Category filter
    if (category) where.category = category;
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [courses, total] = await Promise.all([
      this.adminService['prisma'].course.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          sections: {
            include: {
              lessons: {
                select: { 
                  id: true,
                  title: true,
                  description: true,
                  duration: true,
                  order: true,
                  isPublished: true,
                },
              },
            },
          },
          _count: {
            select: {
              sections: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.adminService['prisma'].course.count({ where }),
    ]);

    return {
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  @Patch('courses/:id')
  @ApiOperation({ summary: 'Update course details' })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
  })
  async updateCourse(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.adminService['prisma'].course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        sections: {
          include: {
            lessons: {
              select: { 
                id: true,
                title: true,
                description: true,
                duration: true,
                order: true,
                isPublished: true,
              },
            },

          },
        },
      },
    });
  }



  @Patch('courses/:id/status')
  @ApiOperation({ summary: 'Toggle course publish status' })
  @ApiResponse({
    status: 200,
    description: 'Course publish status updated successfully',
  })
  async toggleCourseStatus(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ) {
    return this.adminService['prisma'].course.update({
      where: { id },
      data: { isPublished },
      select: {
        id: true,
        title: true,
        isPublished: true,
        updatedAt: true,
      },
    });
  }

  @Patch('courses/:id/approve')
  @ApiOperation({ summary: 'Approve course for publishing' })
  @ApiResponse({
    status: 200,
    description: 'Course approved successfully',
  })
  async approveCourse(@Param('id') id: string) {
    return this.adminService['prisma'].course.update({
      where: { id },
      data: { isPublished: true },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  @Post('courses')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  async createCourse(@Body() createCourseDto: any) {
    try {
      return await this.adminService.createCourse(createCourseDto);
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Delete('courses/:id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  async deleteCourse(@Param('id') id: string) {
    try {
      return await this.adminService.deleteCourse(id);
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  // Section Management Endpoints
  @Post('courses/:courseId/sections')
  @ApiOperation({ summary: 'Create a new section for a course' })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  async createSection(
    @Param('courseId') courseId: string,
    @Body() createSectionDto: any,
  ) {
    return this.adminService['prisma'].section.create({
      data: {
        ...createSectionDto,
        courseId,
      },
      include: {
        lessons: true,
      },
    });
  }

  @Patch('sections/:id')
  @ApiOperation({ summary: 'Update section details' })
  @ApiResponse({ status: 200, description: 'Section updated successfully' })
  async updateSection(
    @Param('id') id: string,
    @Body() updateSectionDto: any,
  ) {
    return this.adminService['prisma'].section.update({
      where: { id },
      data: updateSectionDto,
      include: {
        lessons: true,
      },
    });
  }

  @Delete('sections/:id')
  @ApiOperation({ summary: 'Delete a section' })
  @ApiResponse({ status: 200, description: 'Section deleted successfully' })
  async deleteSection(@Param('id') id: string) {
    return this.adminService['prisma'].section.delete({
      where: { id },
    });
  }

  // Lesson Management Endpoints
  @Post('sections/:sectionId/lessons')
  @ApiOperation({ summary: 'Create a new lesson for a section' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  async createLesson(
    @Param('sectionId') sectionId: string,
    @Body() createLessonDto: any,
  ) {
    return this.adminService['prisma'].lesson.create({
      data: {
        ...createLessonDto,
        sectionId,
      },
    });
  }

  @Patch('lessons/:id')
  @ApiOperation({ summary: 'Update lesson details' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  async updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: any,
  ) {
    return this.adminService['prisma'].lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  @Delete('lessons/:id')
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  async deleteLesson(@Param('id') id: string) {
    return this.adminService['prisma'].lesson.delete({
      where: { id },
    });
  }

  // Q&A Management Endpoints
  @Post('courses/:courseId/qna')
  @ApiOperation({ summary: 'Create a new Q&A for a course' })
  @ApiResponse({ status: 201, description: 'Q&A created successfully' })
  async createQnA(
    @Param('courseId') courseId: string,
    @Body() createQnADto: any,
  ) {
    return this.adminService['prisma'].question.create({
      data: {
        userId: createQnADto.askedBy.id,
        courseId,
        title: createQnADto.question,
        content: createQnADto.question,
      },
      include: {
        user: true,
      },
    });
  }

  @Patch('qna/:id')
  @ApiOperation({ summary: 'Update Q&A details' })
  @ApiResponse({ status: 200, description: 'Q&A updated successfully' })
  async updateQnA(
    @Param('id') id: string,
    @Body() updateQnADto: any,
  ) {
    return this.adminService['prisma'].question.update({
      where: { id },
      data: {
        title: updateQnADto.question,
        content: updateQnADto.question,
      },
      include: {
        user: true,
      },
    });
  }

  @Delete('qna/:id')
  @ApiOperation({ summary: 'Delete a Q&A' })
  @ApiResponse({ status: 200, description: 'Q&A deleted successfully' })
  async deleteQnA(@Param('id') id: string) {
    return this.adminService['prisma'].question.delete({
      where: { id },
    });
  }

  // Device Management Endpoints
  @Get('devices/requests')
  @ApiOperation({ summary: 'Get device enrollment requests' })
  @ApiResponse({ status: 200, description: 'Device requests retrieved successfully' })
  async getDeviceRequests() {
    try {
      console.log('Controller: Getting device requests...');
      const result = await this.adminService.getDeviceRequests();
      console.log('Controller: Result:', result);
      return result;
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }



  @Patch('devices/requests/:id/approve')
  @ApiOperation({ summary: 'Approve device enrollment request' })
  @ApiResponse({ status: 200, description: 'Device request approved successfully' })
  async approveDeviceRequest(
    @Param('id') id: string,
    @Body() body: { deviceName: string; isTrusted?: boolean }
  ) {
    return this.adminService.approveDeviceRequest(id, body);
  }

  @Patch('devices/requests/:id/deny')
  @ApiOperation({ summary: 'Deny device enrollment request' })
  @ApiResponse({ status: 200, description: 'Device request denied successfully' })
  async denyDeviceRequest(@Param('id') id: string) {
    return this.adminService.denyDeviceRequest(id);
  }

  @Get('devices/user/:id')
  @ApiOperation({ summary: 'Get devices for specific user' })
  @ApiResponse({ status: 200, description: 'User devices retrieved successfully' })
  async getDevicesForUser(@Param('id') userId: string) {
    try {
      return await this.adminService.getUserDevicesByUserId(userId);
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Get('courses/:courseId/duration')
  @ApiOperation({ summary: 'Calculate course duration from lessons' })
  @ApiResponse({ status: 200, description: 'Course duration calculated successfully' })
  async calculateCourseDuration(@Param('courseId') courseId: string) {
    try {
      return await this.adminService.calculateCourseDuration(courseId);
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Get('tax/settings')
  @ApiOperation({ summary: 'Get tax settings' })
  @ApiResponse({ status: 200, description: 'Tax settings retrieved successfully' })
  async getTaxSettings() {
    try {
      const [taxRate, defaultTaxIncluded] = await Promise.all([
        this.adminService.getTaxRate(),
        this.adminService.getDefaultTaxIncluded(),
      ]);

      return {
        taxRate,
        defaultTaxIncluded,
      };
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Post('tax/calculate')
  @ApiOperation({ summary: 'Calculate price with tax' })
  @ApiResponse({ status: 200, description: 'Price calculated successfully' })
  async calculatePriceWithTax(@Body() body: { price: number; taxIncluded: boolean }) {
    try {
      return await this.adminService.calculatePriceWithTax(body.price, body.taxIncluded);
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Post('video/duration')
  @ApiOperation({ summary: 'Get video duration from URL' })
  @ApiResponse({ status: 200, description: 'Video duration retrieved successfully' })
  async getVideoDuration(@Body() body: { videoUrl: string }) {
    try {
      const durationData = await this.adminService.getVideoDuration(body.videoUrl);
      
      console.log('Duration data received:', durationData);
      
      const response = { 
        duration: durationData.durationInSeconds, // Saniye olarak (frontend için)
        durationInSeconds: durationData.durationInSeconds, // Saniye olarak
        durationInMinutes: Math.round(durationData.durationInSeconds / 60 * 100) / 100, // Saniyeyi dakikaya çevir
        formattedDuration: durationData.formattedDuration, // Formatlanmış string
        videoUrl: body.videoUrl 
      };
      
      console.log('Response being sent:', response);
      return response;
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Post('video/metadata')
  @ApiOperation({ summary: 'Get video metadata from URL' })
  @ApiResponse({ status: 200, description: 'Video metadata retrieved successfully' })
  async getVideoMetadata(@Body() body: { videoUrl: string }) {
    try {
      const metadata = await this.adminService.getVideoMetadata(body.videoUrl);
      return { ...metadata, videoUrl: body.videoUrl };
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
