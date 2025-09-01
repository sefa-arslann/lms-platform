import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    createMessage(userId: string, data: {
        subject: string;
        content: string;
        messageType: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
        attachments?: Array<{
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
        }>;
    }): unknown;
    getAllMessages(adminId: string, filters?: {
        status?: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
        messageType?: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
        search?: string;
    }): unknown;
    getUserMessages(userId: string): unknown;
    getMessageById(messageId: string, userId?: string, isAdmin?: boolean): unknown;
    adminReply(messageId: string, adminId: string, content: string): unknown;
    userReply(messageId: string, userId: string, content: string): unknown;
    updateMessageStatus(messageId: string, status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED'): unknown;
    getMessageStats(adminId: string): unknown;
    markAdminRepliesAsRead(messageId: string, userId: string): unknown;
}
