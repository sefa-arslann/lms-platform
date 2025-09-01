import { PrismaService } from '../prisma/prisma.service';
export declare class SemestersService {
    private prisma;
    constructor(prisma: PrismaService);
    getCurrentPeriod(): Promise<{
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
    calculateCourseAccessDuration(): Promise<{
        startDate: Date;
        endDate: Date;
        durationInDays: number;
    }>;
}
