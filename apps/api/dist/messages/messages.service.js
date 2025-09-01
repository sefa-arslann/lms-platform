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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMessage(userId, data) {
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
        }
        catch (error) {
            console.error('❌ Error creating message:', error);
            throw error;
        }
    }
    async getAllMessages(adminId, filters) {
        try {
            console.log(`📨 Getting all messages for admin ${adminId} with filters:`, filters);
            const where = {};
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
        }
        catch (error) {
            console.error('❌ Error getting messages:', error);
            throw error;
        }
    }
    async getUserMessages(userId) {
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
        }
        catch (error) {
            console.error('❌ Error getting user messages:', error);
            throw error;
        }
    }
    async getMessageById(messageId, userId, isAdmin = false) {
        try {
            console.log(`📨 Getting message ${messageId} for ${isAdmin ? 'admin' : 'user'} ${userId}`);
            const where = { id: messageId };
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
            if (isAdmin && !message.isRead) {
                await this.prisma.message.update({
                    where: { id: messageId },
                    data: { isRead: true, status: 'READ' }
                });
            }
            return message;
        }
        catch (error) {
            console.error('❌ Error getting message:', error);
            throw error;
        }
    }
    async adminReply(messageId, adminId, content) {
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
        }
        catch (error) {
            console.error('❌ Error creating admin reply:', error);
            throw error;
        }
    }
    async userReply(messageId, userId, content) {
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
            await this.prisma.message.update({
                where: { id: messageId },
                data: {
                    status: 'UNREAD',
                    updatedAt: new Date()
                }
            });
            console.log(`✅ User reply created successfully`);
            return reply;
        }
        catch (error) {
            console.error('❌ Error creating user reply:', error);
            throw error;
        }
    }
    async updateMessageStatus(messageId, status) {
        try {
            console.log(`📨 Updating message ${messageId} status to ${status}`);
            const message = await this.prisma.message.update({
                where: { id: messageId },
                data: { status }
            });
            if (status === 'READ') {
                await this.prisma.messageReply.updateMany({
                    where: { messageId },
                    data: { isRead: true }
                });
                console.log(`✅ All replies marked as read for message ${messageId}`);
            }
            if (status === 'CLOSED') {
                await this.prisma.messageReply.updateMany({
                    where: { messageId },
                    data: { isRead: true }
                });
                console.log(`✅ All replies marked as read for closed message ${messageId}`);
            }
            console.log(`✅ Message status updated successfully`);
            return message;
        }
        catch (error) {
            console.error('❌ Error updating message status:', error);
            throw error;
        }
    }
    async getMessageStats(adminId) {
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
                }, {})
            };
        }
        catch (error) {
            console.error('❌ Error getting message stats:', error);
            throw error;
        }
    }
    async markAdminRepliesAsRead(messageId, userId) {
        try {
            console.log(`📨 Marking admin replies as read for message ${messageId} by user ${userId}`);
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
        }
        catch (error) {
            console.error('❌ Error marking admin replies as read:', error);
            throw error;
        }
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map