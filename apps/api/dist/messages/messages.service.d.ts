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
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
            messageId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        userId: string;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        isRead: boolean;
        adminId: string | null;
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
            userId: string;
            isRead: boolean;
            messageId: string;
            isAdmin: boolean;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
            messageId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        userId: string;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        isRead: boolean;
        adminId: string | null;
    })[]>;
    getUserMessages(userId: string): Promise<({
        _count: {
            replies: number;
        };
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
            userId: string;
            isRead: boolean;
            messageId: string;
            isAdmin: boolean;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
            messageId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        userId: string;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        isRead: boolean;
        adminId: string | null;
    })[]>;
    getMessageById(messageId: string, userId?: string, isAdmin?: boolean): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
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
            userId: string;
            isRead: boolean;
            messageId: string;
            isAdmin: boolean;
        })[];
        attachments: {
            id: string;
            createdAt: Date;
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
            messageId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        userId: string;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        isRead: boolean;
        adminId: string | null;
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
        userId: string;
        isRead: boolean;
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
        userId: string;
        isRead: boolean;
        messageId: string;
        isAdmin: boolean;
    }>;
    updateMessageStatus(messageId: string, status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import("@prisma/client").$Enums.MessageStatus;
        userId: string;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        isRead: boolean;
        adminId: string | null;
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
