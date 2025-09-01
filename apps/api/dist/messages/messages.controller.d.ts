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
    getUserMessages(req: any): Promise<({
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
    getUserMessage(messageId: string, req: any): Promise<{
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
        userId: string;
        isRead: boolean;
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
        userId: string;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        isRead: boolean;
        adminId: string | null;
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
    getAdminMessage(messageId: string, req: any): Promise<{
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
        userId: string;
        isRead: boolean;
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
        userId: string;
        subject: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        isRead: boolean;
        adminId: string | null;
    }>;
    getMessageStats(req: any): Promise<{
        total: number;
        unread: number;
        replied: number;
        byStatus: Record<string, number>;
    }>;
}
