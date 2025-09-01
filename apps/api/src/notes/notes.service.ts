import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // Kullanıcının bir ders için notlarını getir
  async getNotesByLesson(userId: string, lessonId: string) {
    try {
      const notes = await this.prisma.note.findMany({
        where: {
          lessonId: lessonId,
          OR: [
            { userId: userId }, // Kendi notları
            { isPublic: true }  // Public notlar
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
    } catch (error) {
      console.error('❌ Error getting notes:', error);
      throw error;
    }
  }

  // Yeni not ekle
  async createNote(data: {
    userId: string;
    lessonId: string;
    content: string;
    timestamp: number;
    isPublic?: boolean;
  }) {
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
    } catch (error) {
      console.error('❌ Error creating note:', error);
      throw error;
    }
  }

  // Not güncelle
  async updateNote(noteId: string, userId: string, data: {
    content?: string;
    timestamp?: number;
    isPublic?: boolean;
  }) {
    try {
      const note = await this.prisma.note.updateMany({
        where: {
          id: noteId,
          userId: userId // Sadece kendi notunu güncelleyebilir
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
    } catch (error) {
      console.error('❌ Error updating note:', error);
      throw error;
    }
  }

  // Not sil
  async deleteNote(noteId: string, userId: string) {
    try {
      const note = await this.prisma.note.deleteMany({
        where: {
          id: noteId,
          userId: userId // Sadece kendi notunu silebilir
        }
      });

      console.log('✅ Note deleted successfully:', noteId);
      return note;
    } catch (error) {
      console.error('❌ Error deleting note:', error);
      throw error;
    }
  }

  // Kullanıcının tüm notlarını getir
  async getUserNotes(userId: string) {
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
    } catch (error) {
      console.error('❌ Error getting user notes:', error);
      throw error;
    }
  }
}
