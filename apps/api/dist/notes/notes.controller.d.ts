import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    getNotesByLesson(lessonId: string, req: any): unknown;
    createNote(createNoteDto: {
        lessonId: string;
        content: string;
        timestamp: number;
        isPublic?: boolean;
    }, req: any): unknown;
    updateNote(id: string, updateNoteDto: {
        content?: string;
        timestamp?: number;
        isPublic?: boolean;
    }, req: any): unknown;
    deleteNote(id: string, req: any): unknown;
    getUserNotes(req: any): unknown;
}
