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
    }): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        attachments: {
            id: string;
            createdAt: Date;
            messageId: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        isRead: boolean;
        userId: string;
        adminId: string | null;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
    }>;
    getAllMessages(adminId: string, filters?: {
        status?: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
        messageType?: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
        search?: string;
    }): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        _count: {
            replies: number;
        };
        attachments: {
            id: string;
            createdAt: Date;
            messageId: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
        }[];
        replies: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            isRead: boolean;
            userId: string;
            messageId: string;
            isAdmin: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        isRead: boolean;
        userId: string;
        adminId: string | null;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
    })[]>;
    getUserMessages(userId: string): Promise<({
        _count: {
            replies: number;
        };
        attachments: {
            id: string;
            createdAt: Date;
            messageId: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
        }[];
        replies: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            isRead: boolean;
            userId: string;
            messageId: string;
            isAdmin: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        isRead: boolean;
        userId: string;
        adminId: string | null;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
    })[]>;
    getMessageById(messageId: string, userId?: string, isAdmin?: boolean): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        attachments: {
            id: string;
            createdAt: Date;
            messageId: string;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
        }[];
        replies: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            isRead: boolean;
            userId: string;
            messageId: string;
            isAdmin: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        isRead: boolean;
        userId: string;
        adminId: string | null;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
    }>;
    adminReply(messageId: string, adminId: string, content: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        isRead: boolean;
        userId: string;
        messageId: string;
        isAdmin: boolean;
    }>;
    userReply(messageId: string, userId: string, content: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        isRead: boolean;
        userId: string;
        messageId: string;
        isAdmin: boolean;
    }>;
    updateMessageStatus(messageId: string, status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        isRead: boolean;
        userId: string;
        adminId: string | null;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
    }>;
    getMessageStats(adminId: string): Promise<{
        total: number;
        unread: number;
        replied: number;
        byStatus: Record<string, number>;
    }>;
    markAdminRepliesAsRead(messageId: string, userId: string): Promise<{
        success: boolean;
        count: number;
    }>;
}
