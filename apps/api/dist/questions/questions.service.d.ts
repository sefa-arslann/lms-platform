import { PrismaService } from '../prisma/prisma.service';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getQuestionsByLesson(lessonId: string): unknown;
    createQuestion(userId: string, lessonId: string, courseId: string, title: string, content: string, file?: Express.Multer.File): unknown;
    answerQuestion(questionId: string, userId: string, content: string): unknown;
    private formatFileSize;
}
