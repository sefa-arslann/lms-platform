import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    getNotesByLesson(lessonId: string, req: any): Promise<({
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
    createNote(createNoteDto: {
        lessonId: string;
        content: string;
        timestamp: number;
        isPublic?: boolean;
    }, req: any): Promise<{
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
    updateNote(id: string, updateNoteDto: {
        content?: string;
        timestamp?: number;
        isPublic?: boolean;
    }, req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    deleteNote(id: string, req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getUserNotes(req: any): Promise<({
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
