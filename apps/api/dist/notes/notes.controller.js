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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const notes_service_1 = require("./notes.service");
let NotesController = class NotesController {
    notesService;
    constructor(notesService) {
        this.notesService = notesService;
    }
    async getNotesByLesson(lessonId, req) {
        try {
            console.log(`📝 Getting notes for lesson ${lessonId} by user ${req.user.id}`);
            const notes = await this.notesService.getNotesByLesson(req.user.id, lessonId);
            return notes;
        }
        catch (error) {
            console.error('❌ Error getting notes:', error);
            throw error;
        }
    }
    async createNote(createNoteDto, req) {
        try {
            console.log(`📝 Creating note for lesson ${createNoteDto.lessonId} by user ${req.user.id}`);
            const note = await this.notesService.createNote({
                userId: req.user.id,
                lessonId: createNoteDto.lessonId,
                content: createNoteDto.content,
                timestamp: createNoteDto.timestamp,
                isPublic: createNoteDto.isPublic || false
            });
            return note;
        }
        catch (error) {
            console.error('❌ Error creating note:', error);
            throw error;
        }
    }
    async updateNote(id, updateNoteDto, req) {
        try {
            console.log(`📝 Updating note ${id} by user ${req.user.id}`);
            const note = await this.notesService.updateNote(id, req.user.id, updateNoteDto);
            return note;
        }
        catch (error) {
            console.error('❌ Error updating note:', error);
            throw error;
        }
    }
    async deleteNote(id, req) {
        try {
            console.log(`📝 Deleting note ${id} by user ${req.user.id}`);
            const note = await this.notesService.deleteNote(id, req.user.id);
            return note;
        }
        catch (error) {
            console.error('❌ Error deleting note:', error);
            throw error;
        }
    }
    async getUserNotes(req) {
        try {
            console.log(`📝 Getting notes for user ${req.user.id}`);
            const notes = await this.notesService.getUserNotes(req.user.id);
            return notes;
        }
        catch (error) {
            console.error('❌ Error getting user notes:', error);
            throw error;
        }
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Get)('lesson/:lessonId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get notes for a specific lesson' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notes retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getNotesByLesson", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new note' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Note created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "createNote", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a note' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Note updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "updateNote", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a note' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Note deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "deleteNote", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notes for the current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User notes retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getUserNotes", null);
exports.NotesController = NotesController = __decorate([
    (0, swagger_1.ApiTags)('notes'),
    (0, common_1.Controller)('notes'),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map