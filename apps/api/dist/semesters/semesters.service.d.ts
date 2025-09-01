import { PrismaService } from '../prisma/prisma.service';
export declare class SemestersService {
    private prisma;
    constructor(prisma: PrismaService);
    getCurrentPeriod(): unknown;
    calculateCourseAccessDuration(): unknown;
}
