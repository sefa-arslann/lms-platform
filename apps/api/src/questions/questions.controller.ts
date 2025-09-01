import { Controller, Get, Post, Param, Body, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionsService } from './questions.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Get questions for a lesson
  @Get('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get questions for a lesson' })
  @ApiResponse({
    status: 200,
    description: 'Questions retrieved successfully',
  })
  async getQuestionsByLesson(@Param('lessonId') lessonId: string) {
    return this.questionsService.getQuestionsByLesson(lessonId);
  }

  // Create a new question with file upload
  @Post('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new question for a lesson with optional file attachment' })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  async createQuestion(
    @Param('lessonId') lessonId: string,
    @Body() body: { title: string; content: string; courseId: string },
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    return this.questionsService.createQuestion(
      req.user.id,
      lessonId,
      body.courseId,
      body.title,
      body.content,
      file
    );
  }

  // Answer a question (admin/instructor only)
  @Post(':questionId/answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Answer a question (admin/instructor only)' })
  @ApiResponse({
    status: 201,
    description: 'Answer created successfully',
  })
  async answerQuestion(
    @Param('questionId') questionId: string,
    @Body() body: { content: string },
    @Request() req: any
  ) {
    // TODO: Add role checking for admin/instructor only
    return this.questionsService.answerQuestion(questionId, req.user.id, body.content);
  }
}
