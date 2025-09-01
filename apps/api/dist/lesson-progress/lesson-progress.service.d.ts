import { PrismaService } from '../prisma/prisma.service';
export declare class LessonProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getLessonProgress(userId: string, lessonId: string): unknown;
    updateLessonProgress(userId: string, lessonId: string, data: {
        progress: number;
        duration: number;
        lastPosition: number;
        completed?: boolean;
    }): unknown;
    completeLesson(userId: string, lessonId: string): unknown;
    getCourseProgress(userId: string, courseId: string): unknown;
    getCourseLessonsProgress(userId: string, courseId: string): unknown;
    getUserLearningStats(userId: string): unknown;
    getLastWatchedCourse(userId: string): unknown;
    getAllLessonProgress(userId: string): unknown;
    resetAllLessonProgress(userId: string): unknown;
}
