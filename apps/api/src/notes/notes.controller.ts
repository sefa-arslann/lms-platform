import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotesService } from './notes.service';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notes for a specific lesson' })
  @ApiResponse({
    status: 200,
    description: 'Notes retrieved successfully',
  })
  async getNotesByLesson(
    @Param('lessonId') lessonId: string,
    @Request() req: any
  ) {
    try {
      console.log(`📝 Getting notes for lesson ${lessonId} by user ${req.user.id}`);
      const notes = await this.notesService.getNotesByLesson(req.user.id, lessonId);
      return notes;
    } catch (error) {
      console.error('❌ Error getting notes:', error);
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully',
  })
  async createNote(
    @Body() createNoteDto: {
      lessonId: string;
      content: string;
      timestamp: number;
      isPublic?: boolean;
    },
    @Request() req: any
  ) {
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
    } catch (error) {
      console.error('❌ Error creating note:', error);
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully',
  })
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: {
      content?: string;
      timestamp?: number;
      isPublic?: boolean;
    },
    @Request() req: any
  ) {
    try {
      console.log(`📝 Updating note ${id} by user ${req.user.id}`);
      const note = await this.notesService.updateNote(id, req.user.id, updateNoteDto);
      return note;
    } catch (error) {
      console.error('❌ Error updating note:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({
    status: 200,
    description: 'Note deleted successfully',
  })
  async deleteNote(
    @Param('id') id: string,
    @Request() req: any
  ) {
    try {
      console.log(`📝 Deleting note ${id} by user ${req.user.id}`);
      const note = await this.notesService.deleteNote(id, req.user.id);
      return note;
    } catch (error) {
      console.error('❌ Error deleting note:', error);
      throw error;
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notes for the current user' })
  @ApiResponse({
    status: 200,
    description: 'User notes retrieved successfully',
  })
  async getUserNotes(@Request() req: any) {
    try {
      console.log(`📝 Getting notes for user ${req.user.id}`);
      const notes = await this.notesService.getUserNotes(req.user.id);
      return notes;
    } catch (error) {
      console.error('❌ Error getting user notes:', error);
      throw error;
    }
  }
}
