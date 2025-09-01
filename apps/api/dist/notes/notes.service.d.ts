import { PrismaService } from '../prisma/prisma.service';
export declare class NotesService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotesByLesson(userId: string, lessonId: string): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        lessonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        timestamp: number | null;
        isPublic: boolean;
    })[]>;
    createNote(data: {
        userId: string;
        lessonId: string;
        content: string;
        timestamp: number;
        isPublic?: boolean;
    }): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        lessonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        timestamp: number | null;
        isPublic: boolean;
    }>;
    updateNote(noteId: string, userId: string, data: {
        content?: string;
        timestamp?: number;
        isPublic?: boolean;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNote(noteId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getUserNotes(userId: string): Promise<({
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                };
                id: string;
                title: string;
            };
            id: string;
            title: string;
        };
    } & {
        lessonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        timestamp: number | null;
        isPublic: boolean;
    })[]>;
}
