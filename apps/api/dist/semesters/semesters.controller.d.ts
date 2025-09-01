import { SemestersService } from './semesters.service';
export declare class SemestersController {
    private readonly semestersService;
    constructor(semestersService: SemestersService);
    getCurrentPeriod(): unknown;
    getCourseAccessDuration(): unknown;
}
