import { LessonProgressService } from './lesson-progress.service';
export declare class LessonProgressController {
    private readonly lessonProgressService;
    constructor(lessonProgressService: LessonProgressService);
    getLessonProgress(lessonId: string, req: any): unknown;
    updateLessonProgress(lessonId: string, updateData: {
        progress: number;
        duration: number;
        lastPosition: number;
        completed?: boolean;
    }, req: any): unknown;
    completeLesson(lessonId: string, req: any): unknown;
    getCourseProgress(courseId: string, req: any): unknown;
    getCourseLessonsProgress(courseId: string, req: any): unknown;
    getUserLearningStats(req: any): unknown;
    getLastWatchedCourse(req: any): unknown;
    getAllLessonProgress(req: any): unknown;
    resetAllLessonProgress(req: any): unknown;
}
