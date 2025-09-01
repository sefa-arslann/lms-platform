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
    }, req: any): unknown;
    getUserMessages(req: any): unknown;
    getUserMessage(messageId: string, req: any): unknown;
    userReply(messageId: string, replyDto: {
        content: string;
    }, req: any): unknown;
    updateUserMessageStatus(messageId: string, statusDto: {
        status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
    }, req: any): unknown;
    markAdminRepliesAsRead(messageId: string, req: any): unknown;
    getAllMessages(query: {
        status?: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
        messageType?: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
        search?: string;
    }, req: any): unknown;
    getAdminMessage(messageId: string, req: any): unknown;
    adminReply(messageId: string, replyDto: {
        content: string;
    }, req: any): unknown;
    updateMessageStatus(messageId: string, statusDto: {
        status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
    }, req: any): unknown;
    getMessageStats(req: any): unknown;
}
