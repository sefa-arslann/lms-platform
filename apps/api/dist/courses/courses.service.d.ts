import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRole } from '@prisma/client';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCourseDto: CreateCourseDto, instructorId: string): Promise<{
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    findAll(role?: UserRole, userId?: string): Promise<({
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        sections: ({
            lessons: {
                order: number;
                id: string;
                title: string;
                description: string | null;
                videoUrl: string | null;
                duration: number;
                sectionId: string;
                isPublished: boolean;
                videoKey: string | null;
                thumbnail: string | null;
                subtitles: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
                isFree: boolean;
                resources: import("@prisma/client/runtime/library").JsonValue | null;
                videoType: string | null;
            }[];
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    })[]>;
    findBySlug(slug: string, role?: UserRole, userId?: string): Promise<{
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        sections: ({
            lessons: {
                order: number;
                id: string;
                title: string;
                description: string | null;
                videoUrl: string | null;
                duration: number;
                sectionId: string;
                isPublished: boolean;
                videoKey: string | null;
                thumbnail: string | null;
                subtitles: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
                isFree: boolean;
                resources: import("@prisma/client/runtime/library").JsonValue | null;
                videoType: string | null;
            }[];
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    findOne(id: string, role?: UserRole, userId?: string): Promise<{
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        sections: ({
            lessons: {
                order: number;
                id: string;
                title: string;
                description: string | null;
                videoUrl: string | null;
                duration: number;
                sectionId: string;
                isPublished: boolean;
                videoKey: string | null;
                thumbnail: string | null;
                subtitles: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
                isFree: boolean;
                resources: import("@prisma/client/runtime/library").JsonValue | null;
                videoType: string | null;
            }[];
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto, userId: string, role: UserRole): Promise<{
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    remove(id: string, userId: string, role: UserRole): Promise<{
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    publish(id: string, userId: string, role: UserRole): Promise<{
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    unpublish(id: string, userId: string, role: UserRole): Promise<{
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
}
