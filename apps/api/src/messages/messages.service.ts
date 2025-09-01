import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Kullanıcı admin'e mesaj gönderir
  async createMessage(userId: string, data: {
    subject: string;
    content: string;
    messageType: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
    attachments?: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    }>;
  }) {
    try {
      console.log(`📨 Creating message from user ${userId}:`, data);

      const message = await this.prisma.message.create({
        data: {
          userId,
          subject: data.subject,
          content: data.content,
          messageType: data.messageType,
          attachments: data.attachments ? {
            create: data.attachments.map(att => ({
              fileName: att.fileName,
              fileUrl: att.fileUrl,
              fileType: att.fileType,
              fileSize: att.fileSize,
            }))
          } : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          attachments: true,
        }
      });

      console.log(`✅ Message created successfully:`, message.id);
      return message;
    } catch (error) {
      console.error('❌ Error creating message:', error);
      throw error;
    }
  }

  // Admin tüm mesajları görür
  async getAllMessages(adminId: string, filters?: {
    status?: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
    messageType?: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
    search?: string;
  }) {
    try {
      console.log(`📨 Getting all messages for admin ${adminId} with filters:`, filters);

      const where: any = {};
      
      if (filters?.status) {
        where.status = filters.status;
      }
      
      if (filters?.messageType) {
        where.messageType = filters.messageType;
      }
      
      if (filters?.search) {
        where.OR = [
          { subject: { contains: filters.search, mode: 'insensitive' } },
          { content: { contains: filters.search, mode: 'insensitive' } },
          { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
          { user: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      console.log('🔍 Database query where clause:', where);

      const messages = await this.prisma.message.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          attachments: true,
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          },
          _count: {
            select: { replies: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`✅ Found ${messages.length} messages:`, messages.map(m => ({ id: m.id, subject: m.subject, userId: m.userId })));
      return messages;
    } catch (error) {
      console.error('❌ Error getting messages:', error);
      throw error;
    }
  }

  // Kullanıcı kendi mesajlarını görür
  async getUserMessages(userId: string) {
    try {
      console.log(`📨 Getting messages for user ${userId}`);

      const messages = await this.prisma.message.findMany({
        where: { userId },
        include: {
          attachments: true,
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          },
          _count: {
            select: { replies: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`✅ Found ${messages.length} messages for user`);
      return messages;
    } catch (error) {
      console.error('❌ Error getting user messages:', error);
      throw error;
    }
  }

  // Mesaj detayını görür
  async getMessageById(messageId: string, userId?: string, isAdmin: boolean = false) {
    try {
      console.log(`📨 Getting message ${messageId} for ${isAdmin ? 'admin' : 'user'} ${userId}`);

      const where: any = { id: messageId };
      
      if (!isAdmin && userId) {
        where.userId = userId;
      }

      const message = await this.prisma.message.findUnique({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          attachments: true,
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!message) {
        throw new Error('Message not found');
      }

      // Admin mesajı okundu olarak işaretler
      if (isAdmin && !message.isRead) {
        await this.prisma.message.update({
          where: { id: messageId },
          data: { isRead: true, status: 'READ' }
        });
      }

      return message;
    } catch (error) {
      console.error('❌ Error getting message:', error);
      throw error;
    }
  }

  // Admin mesaja yanıt verir
  async adminReply(messageId: string, adminId: string, content: string) {
    try {
      console.log(`📨 Admin ${adminId} replying to message ${messageId}`);

      const reply = await this.prisma.messageReply.create({
        data: {
          messageId,
          userId: adminId,
          content,
          isAdmin: true,
          isRead: false,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            }
          }
        }
      });

      // Mesaj durumunu güncelle
      await this.prisma.message.update({
        where: { id: messageId },
        data: { 
          status: 'REPLIED',
          adminId,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Admin reply created successfully`);
      return reply;
    } catch (error) {
      console.error('❌ Error creating admin reply:', error);
      throw error;
    }
  }

  // Kullanıcı mesaja yanıt verir
  async userReply(messageId: string, userId: string, content: string) {
    try {
      console.log(`📨 User ${userId} replying to message ${messageId}`);

      const reply = await this.prisma.messageReply.create({
        data: {
          messageId,
          userId,
          content,
          isAdmin: false,
          isRead: false,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            }
          }
        }
      });

      // Mesaj durumunu güncelle
      await this.prisma.message.update({
        where: { id: messageId },
        data: { 
          status: 'UNREAD',
          updatedAt: new Date()
        }
      });

      console.log(`✅ User reply created successfully`);
      return reply;
    } catch (error) {
      console.error('❌ Error creating user reply:', error);
      throw error;
    }
  }

  // Mesaj durumunu güncelle
  async updateMessageStatus(messageId: string, status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED') {
    try {
      console.log(`📨 Updating message ${messageId} status to ${status}`);

      const message = await this.prisma.message.update({
        where: { id: messageId },
        data: { status }
      });

      // Eğer mesaj READ olarak işaretleniyorsa, tüm reply'ları da okundu olarak işaretle
      if (status === 'READ') {
        await this.prisma.messageReply.updateMany({
          where: { messageId },
          data: { isRead: true }
        });
        console.log(`✅ All replies marked as read for message ${messageId}`);
      }
      
      // Eğer mesaj CLOSED olarak işaretleniyorsa, tüm reply'ları da okundu olarak işaretle
      if (status === 'CLOSED') {
        await this.prisma.messageReply.updateMany({
          where: { messageId },
          data: { isRead: true }
        });
        console.log(`✅ All replies marked as read for closed message ${messageId}`);
      }

      console.log(`✅ Message status updated successfully`);
      return message;
    } catch (error) {
      console.error('❌ Error updating message status:', error);
      throw error;
    }
  }

  // Mesaj istatistikleri
  async getMessageStats(adminId: string) {
    try {
      console.log(`📊 Getting message stats for admin ${adminId}`);

      const stats = await this.prisma.message.groupBy({
        by: ['status'],
        _count: { id: true }
      });

      const totalMessages = await this.prisma.message.count();
      const unreadMessages = await this.prisma.message.count({ where: { status: 'UNREAD' } });
      const repliedMessages = await this.prisma.message.count({ where: { status: 'REPLIED' } });

      return {
        total: totalMessages,
        unread: unreadMessages,
        replied: repliedMessages,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.id;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      console.error('❌ Error getting message stats:', error);
      throw error;
    }
  }

  // Admin yanıtlarını okundu olarak işaretler
  async markAdminRepliesAsRead(messageId: string, userId: string) {
    try {
      console.log(`📨 Marking admin replies as read for message ${messageId} by user ${userId}`);
      
      // Sadece admin yanıtlarını okundu olarak işaretle
      const result = await this.prisma.messageReply.updateMany({
        where: {
          messageId,
          isAdmin: true,
          isRead: false
        },
        data: { isRead: true }
      });

      console.log(`✅ ${result.count} admin replies marked as read for message ${messageId}`);
      return { success: true, count: result.count };
    } catch (error) {
      console.error('❌ Error marking admin replies as read:', error);
      throw error;
    }
  }
}
