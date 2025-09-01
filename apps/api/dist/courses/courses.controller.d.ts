import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRole } from '@prisma/client';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto, req: any): unknown;
    findAll(role?: UserRole, req?: any): unknown;
    findPublic(): unknown;
    findBySlug(slug: string, req?: any): unknown;
    findOne(id: string, req?: any): unknown;
    update(id: string, updateCourseDto: UpdateCourseDto, req: any): unknown;
    remove(id: string, req: any): unknown;
    publish(id: string, req: any): unknown;
    unpublish(id: string, req: any): unknown;
}
