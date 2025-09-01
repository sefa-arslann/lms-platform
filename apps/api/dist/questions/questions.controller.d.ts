import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
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
    createQuestion(lessonId: string, body: {
        title: string;
        content: string;
        courseId: string;
    }, file: Express.Multer.File, req: any): Promise<{
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
    answerQuestion(questionId: string, body: {
        content: string;
    }, req: any): Promise<{
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
}
