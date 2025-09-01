import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    getQuestionsByLesson(lessonId: string): unknown;
    createQuestion(lessonId: string, body: {
        title: string;
        content: string;
        courseId: string;
    }, file: Express.Multer.File, req: any): unknown;
    answerQuestion(questionId: string, body: {
        content: string;
    }, req: any): unknown;
}
