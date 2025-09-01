import { PrismaService } from '../prisma/prisma.service';
import { LessonProgressService } from '../lesson-progress/lesson-progress.service';
export declare class AccessGrantsService {
    private prisma;
    private lessonProgressService;
    constructor(prisma: PrismaService, lessonProgressService: LessonProgressService);
    create(createAccessGrantDto: any): unknown;
    findAll(): unknown;
    findOne(id: string): unknown;
    checkLessonAccess(userId: string, lessonId: string): Promise<boolean>;
    getUserCourses(userId: string): unknown;
}
