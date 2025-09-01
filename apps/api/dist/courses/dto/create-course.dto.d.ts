import { CourseLevel } from '@prisma/client';
export declare class CreateCourseDto {
    title: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    duration: number;
    level: CourseLevel;
    language: string;
    thumbnail?: string;
    previewVideo?: string;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    requirements?: string;
    whatYouWillLearn?: string;
    targetAudience?: string;
}
