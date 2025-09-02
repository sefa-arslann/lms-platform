import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    createMessage(createMessageDto: {
        subject: string;
        content: string;
        messageType: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
        attachments?: Array<{
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
        }>;
    }, req: any): Promise<{
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
    getUserMessages(req: any): Promise<({
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
    getUserMessage(messageId: string, req: any): Promise<{
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
    userReply(messageId: string, replyDto: {
        content: string;
    }, req: any): Promise<{
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
    updateUserMessageStatus(messageId: string, statusDto: {
        status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
    }, req: any): Promise<{
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
    markAdminRepliesAsRead(messageId: string, req: any): Promise<{
        success: boolean;
        count: number;
    }>;
    getAllMessages(query: {
        status?: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
        messageType?: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
        search?: string;
    }, req: any): Promise<({
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
    getAdminMessage(messageId: string, req: any): Promise<{
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
    adminReply(messageId: string, replyDto: {
        content: string;
    }, req: any): Promise<{
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
    updateMessageStatus(messageId: string, statusDto: {
        status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
    }, req: any): Promise<{
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
    getMessageStats(req: any): Promise<{
        total: number;
        unread: number;
        replied: number;
        byStatus: Record<string, number>;
    }>;
}
