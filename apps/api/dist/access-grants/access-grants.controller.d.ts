import { AccessGrantsService } from './access-grants.service';
export declare class AccessGrantsController {
    private readonly accessGrantsService;
    constructor(accessGrantsService: AccessGrantsService);
    getMyCourses(req: any): unknown;
    create(createAccessGrantDto: any): unknown;
    findAll(): unknown;
    findOne(id: string): unknown;
}
