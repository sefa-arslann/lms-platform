import { PrismaService } from '../prisma/prisma.service';
export declare class NotesService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotesByLesson(userId: string, lessonId: string): unknown;
    createNote(data: {
        userId: string;
        lessonId: string;
        content: string;
        timestamp: number;
        isPublic?: boolean;
    }): unknown;
    updateNote(noteId: string, userId: string, data: {
        content?: string;
        timestamp?: number;
        isPublic?: boolean;
    }): unknown;
    deleteNote(noteId: string, userId: string): unknown;
    getUserNotes(userId: string): unknown;
}
