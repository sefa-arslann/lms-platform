"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotesService = class NotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotesByLesson(userId, lessonId) {
        try {
            const notes = await this.prisma.note.findMany({
                where: {
                    lessonId: lessonId,
                    OR: [
                        { userId: userId },
                        { isPublic: true }
                    ]
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return notes;
        }
        catch (error) {
            console.error('❌ Error getting notes:', error);
            throw error;
        }
    }
    async createNote(data) {
        try {
            const note = await this.prisma.note.create({
                data: {
                    userId: data.userId,
                    lessonId: data.lessonId,
                    content: data.content,
                    timestamp: data.timestamp,
                    isPublic: data.isPublic || false
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true
                        }
                    }
                }
            });
            console.log('✅ Note created successfully:', note.id);
            return note;
        }
        catch (error) {
            console.error('❌ Error creating note:', error);
            throw error;
        }
    }
    async updateNote(noteId, userId, data) {
        try {
            const note = await this.prisma.note.updateMany({
                where: {
                    id: noteId,
                    userId: userId
                },
                data: {
                    content: data.content,
                    timestamp: data.timestamp,
                    isPublic: data.isPublic,
                    updatedAt: new Date()
                }
            });
            console.log('✅ Note updated successfully:', noteId);
            return note;
        }
        catch (error) {
            console.error('❌ Error updating note:', error);
            throw error;
        }
    }
    async deleteNote(noteId, userId) {
        try {
            const note = await this.prisma.note.deleteMany({
                where: {
                    id: noteId,
                    userId: userId
                }
            });
            console.log('✅ Note deleted successfully:', noteId);
            return note;
        }
        catch (error) {
            console.error('❌ Error deleting note:', error);
            throw error;
        }
    }
    async getUserNotes(userId) {
        try {
            const notes = await this.prisma.note.findMany({
                where: {
                    userId: userId
                },
                include: {
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                            section: {
                                select: {
                                    id: true,
                                    title: true,
                                    course: {
                                        select: {
                                            id: true,
                                            title: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return notes;
        }
        catch (error) {
            console.error('❌ Error getting user notes:', error);
            throw error;
        }
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotesService);
//# sourceMappingURL=notes.service.js.map