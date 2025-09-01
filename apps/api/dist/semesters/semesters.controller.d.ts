import { SemestersService } from './semesters.service';
export declare class SemestersController {
    private readonly semestersService;
    constructor(semestersService: SemestersService);
    getCurrentPeriod(): Promise<{
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
    getCourseAccessDuration(): Promise<{
        startDate: Date;
        endDate: Date;
        durationInDays: number;
    }>;
}
