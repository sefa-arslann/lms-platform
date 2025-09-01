import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // Get all questions for a lesson
  async getQuestionsByLesson(lessonId: string) {
    try {
      const questions = await this.prisma.question.findMany({
        where: { lessonId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          answers: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform data to match frontend interface
      return questions.map(question => ({
        id: question.id,
        question: question.title,
        answer: question.answers.find(a => a.isAccepted)?.content || null,
        userId: question.userId,
        userName: `${question.user.firstName} ${question.user.lastName}`,
        userRole: question.user.role,
        answeredBy: question.answers.find(a => a.isAccepted)?.user ? 
          `${question.answers.find(a => a.isAccepted)?.user.firstName} ${question.answers.find(a => a.isAccepted)?.user.lastName}` : 
          null,
        answeredByRole: question.answers.find(a => a.isAccepted)?.user?.role || null,
        createdAt: question.createdAt,
        upvotes: 0, // TODO: Implement voting system
        downvotes: 0, // TODO: Implement voting system
        isPublic: true,
        attachments: [], // TODO: Add attachments support
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  // Create a new question with optional file attachment
  async createQuestion(userId: string, lessonId: string, courseId: string, title: string, content: string, file?: Express.Multer.File) {
    try {
      // Handle file upload if provided
      let attachmentData: any = null;
      if (file) {
        // For now, we'll store file info in the question content
        // In production, you'd want to upload to S3 or similar service
        attachmentData = {
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          // fileUrl: await this.uploadFileToStorage(file), // TODO: Implement file storage
        };
        
        // Add file info to content
        content += `\n\n📎 Ek Dosya: ${file.originalname} (${this.formatFileSize(file.size)})`;
      }

      const question = await this.prisma.question.create({
        data: {
          userId,
          lessonId,
          courseId,
          title,
          content,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      return {
        id: question.id,
        question: question.title,
        answer: null,
        userId: question.userId,
        userName: `${question.user.firstName} ${question.user.lastName}`,
        userRole: question.user.role,
        answeredBy: null,
        answeredByRole: null,
        createdAt: question.createdAt,
        upvotes: 0,
        downvotes: 0,
        isPublic: true,
        attachments: attachmentData ? [attachmentData] : [],
      };
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  // Answer a question (admin/instructor only)
  async answerQuestion(questionId: string, userId: string, content: string) {
    try {
      const answer = await this.prisma.answer.create({
        data: {
          userId,
          questionId,
          content,
          isAccepted: true, // Auto-accept admin/instructor answers
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      // Update question as answered
      await this.prisma.question.update({
        where: { id: questionId },
        data: { 
          isAccepted: true,
          acceptedAnswerId: answer.id,
        },
      });

      return answer;
    } catch (error) {
      console.error('Error answering question:', error);
      throw error;
    }
  }

  // Helper function to format file size
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
