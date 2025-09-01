import { PrismaService } from '../prisma/prisma.service';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getQuestionsByLesson(lessonId: string): Promise<{
        id: string;
        question: string;
        answer: string | null;
        userId: string;
        userName: string;
        userRole: import("@prisma/client").$Enums.UserRole;
        answeredBy: string | null;
        answeredByRole: import("@prisma/client").$Enums.UserRole | null;
        createdAt: Date;
        upvotes: number;
        downvotes: number;
        isPublic: boolean;
        attachments: never[];
    }[]>;
    createQuestion(userId: string, lessonId: string, courseId: string, title: string, content: string, file?: Express.Multer.File): Promise<{
        id: string;
        question: string;
        answer: null;
        userId: string;
        userName: string;
        userRole: import("@prisma/client").$Enums.UserRole;
        answeredBy: null;
        answeredByRole: null;
        createdAt: Date;
        upvotes: number;
        downvotes: number;
        isPublic: boolean;
        attachments: any[];
    }>;
    answerQuestion(questionId: string, userId: string, content: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        isAccepted: boolean;
        questionId: string;
    }>;
    private formatFileSize;
}
