import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRole } from '@prisma/client';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCourseDto: CreateCourseDto, instructorId: string): unknown;
    findAll(role?: UserRole, userId?: string): unknown;
    findBySlug(slug: string, role?: UserRole, userId?: string): unknown;
    findOne(id: string, role?: UserRole, userId?: string): unknown;
    update(id: string, updateCourseDto: UpdateCourseDto, userId: string, role: UserRole): unknown;
    remove(id: string, userId: string, role: UserRole): unknown;
    publish(id: string, userId: string, role: UserRole): unknown;
    unpublish(id: string, userId: string, role: UserRole): unknown;
}
