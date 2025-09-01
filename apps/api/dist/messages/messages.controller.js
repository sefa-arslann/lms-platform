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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const messages_service_1 = require("./messages.service");
let MessagesController = class MessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async createMessage(createMessageDto, req) {
        try {
            console.log(`📨 User ${req.user.id} sending message to admin`);
            const message = await this.messagesService.createMessage(req.user.id, createMessageDto);
            return message;
        }
        catch (error) {
            console.error('❌ Error sending message:', error);
            throw error;
        }
    }
    async getUserMessages(req) {
        try {
            console.log(`📨 Getting messages for user ${req.user.id}`);
            const messages = await this.messagesService.getUserMessages(req.user.id);
            return messages;
        }
        catch (error) {
            console.error('❌ Error getting user messages:', error);
            throw error;
        }
    }
    async getUserMessage(messageId, req) {
        try {
            console.log(`📨 Getting message ${messageId} for user ${req.user.id}`);
            const message = await this.messagesService.getMessageById(messageId, req.user.id, false);
            return message;
        }
        catch (error) {
            console.error('❌ Error getting message detail:', error);
            throw error;
        }
    }
    async userReply(messageId, replyDto, req) {
        try {
            console.log(`📨 User ${req.user.id} replying to message ${messageId}`);
            const reply = await this.messagesService.userReply(messageId, req.user.id, replyDto.content);
            return reply;
        }
        catch (error) {
            console.error('❌ Error sending user reply:', error);
            throw error;
        }
    }
    async updateUserMessageStatus(messageId, statusDto, req) {
        try {
            console.log(`📨 User ${req.user.id} updating message ${messageId} status to ${statusDto.status}`);
            const message = await this.messagesService.updateMessageStatus(messageId, statusDto.status);
            return message;
        }
        catch (error) {
            console.error('❌ Error updating message status:', error);
            throw error;
        }
    }
    async markAdminRepliesAsRead(messageId, req) {
        try {
            console.log(`📨 User ${req.user.id} marking admin replies as read for message ${messageId}`);
            const result = await this.messagesService.markAdminRepliesAsRead(messageId, req.user.id);
            return result;
        }
        catch (error) {
            console.error('❌ Error marking admin replies as read:', error);
            throw error;
        }
    }
    async getAllMessages(query, req) {
        try {
            console.log(`📨 Admin ${req.user.id} getting all messages`);
            const messages = await this.messagesService.getAllMessages(req.user.id, query);
            return messages;
        }
        catch (error) {
            console.error('❌ Error getting all messages:', error);
            throw error;
        }
    }
    async getAdminMessage(messageId, req) {
        try {
            console.log(`📨 Admin ${req.user.id} getting message ${messageId}`);
            const message = await this.messagesService.getMessageById(messageId, undefined, true);
            return message;
        }
        catch (error) {
            console.error('❌ Error getting admin message detail:', error);
            throw error;
        }
    }
    async adminReply(messageId, replyDto, req) {
        try {
            console.log(`📨 Admin ${req.user.id} replying to message ${messageId}`);
            const reply = await this.messagesService.adminReply(messageId, req.user.id, replyDto.content);
            return reply;
        }
        catch (error) {
            console.error('❌ Error sending admin reply:', error);
            throw error;
        }
    }
    async updateMessageStatus(messageId, statusDto, req) {
        try {
            console.log(`📨 Admin ${req.user.id} updating message ${messageId} status to ${statusDto.status}`);
            const message = await this.messagesService.updateMessageStatus(messageId, statusDto.status);
            return message;
        }
        catch (error) {
            console.error('❌ Error updating message status:', error);
            throw error;
        }
    }
    async getMessageStats(req) {
        try {
            console.log(`📊 Admin ${req.user.id} getting message stats`);
            const stats = await this.messagesService.getMessageStats(req.user.id);
            return stats;
        }
        catch (error) {
            console.error('❌ Error getting message stats:', error);
            throw error;
        }
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send message to admin' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Message sent successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Get)('my-messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user messages' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User messages retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getUserMessages", null);
__decorate([
    (0, common_1.Get)('my-messages/:messageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user message detail' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message detail retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getUserMessage", null);
__decorate([
    (0, common_1.Post)('my-messages/:messageId/reply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'User reply to message' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reply sent successfully',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "userReply", null);
__decorate([
    (0, common_1.Put)('my-messages/:messageId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user message status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message status updated successfully',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "updateUserMessageStatus", null);
__decorate([
    (0, common_1.Put)('my-messages/:messageId/admin-replies/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark admin replies as read' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Admin replies marked as read successfully',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markAdminRepliesAsRead", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all messages for admin' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Messages retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getAllMessages", null);
__decorate([
    (0, common_1.Get)('admin/:messageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get message detail for admin' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message detail retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getAdminMessage", null);
__decorate([
    (0, common_1.Post)('admin/:messageId/reply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin reply to message' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Admin reply sent successfully',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "adminReply", null);
__decorate([
    (0, common_1.Put)('admin/:messageId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update message status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message status updated successfully',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "updateMessageStatus", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get message statistics for admin' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message stats retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessageStats", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('messages'),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map