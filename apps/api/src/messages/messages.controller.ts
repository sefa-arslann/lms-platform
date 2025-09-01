import { Controller, Get, Post, Put, Param, Body, Request, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Kullanıcı admin'e mesaj gönderir
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send message to admin' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  async createMessage(
    @Body() createMessageDto: {
      subject: string;
      content: string;
      messageType: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
      attachments?: Array<{
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
      }>;
    },
    @Request() req: any
  ) {
    try {
      console.log(`📨 User ${req.user.id} sending message to admin`);
      const message = await this.messagesService.createMessage(req.user.id, createMessageDto);
      return message;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
    }
  }

  // Kullanıcı kendi mesajlarını görür
  @Get('my-messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user messages' })
  @ApiResponse({
    status: 200,
    description: 'User messages retrieved successfully',
  })
  async getUserMessages(@Request() req: any) {
    try {
      console.log(`📨 Getting messages for user ${req.user.id}`);
      const messages = await this.messagesService.getUserMessages(req.user.id);
      return messages;
    } catch (error) {
      console.error('❌ Error getting user messages:', error);
      throw error;
    }
  }

  // Kullanıcı mesaj detayını görür
  @Get('my-messages/:messageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user message detail' })
  @ApiResponse({
    status: 200,
    description: 'Message detail retrieved successfully',
  })
  async getUserMessage(
    @Param('messageId') messageId: string,
    @Request() req: any
  ) {
    try {
      console.log(`📨 Getting message ${messageId} for user ${req.user.id}`);
      const message = await this.messagesService.getMessageById(messageId, req.user.id, false);
      return message;
    } catch (error) {
      console.error('❌ Error getting message detail:', error);
      throw error;
    }
  }

  // Kullanıcı mesaja yanıt verir
  @Post('my-messages/:messageId/reply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User reply to message' })
  @ApiResponse({
    status: 201,
    description: 'Reply sent successfully',
  })
  async userReply(
    @Param('messageId') messageId: string,
    @Body() replyDto: { content: string },
    @Request() req: any
  ) {
    try {
      console.log(`📨 User ${req.user.id} replying to message ${messageId}`);
      const reply = await this.messagesService.userReply(messageId, req.user.id, replyDto.content);
      return reply;
    } catch (error) {
      console.error('❌ Error sending user reply:', error);
      throw error;
    }
  }

  // Kullanıcı mesaj durumunu günceller
  @Put('my-messages/:messageId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user message status' })
  @ApiResponse({
    status: 200,
    description: 'Message status updated successfully',
  })
  async updateUserMessageStatus(
    @Param('messageId') messageId: string,
    @Body() statusDto: { status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED' },
    @Request() req: any
  ) {
    try {
      console.log(`📨 User ${req.user.id} updating message ${messageId} status to ${statusDto.status}`);
      const message = await this.messagesService.updateMessageStatus(messageId, statusDto.status);
      return message;
    } catch (error) {
      console.error('❌ Error updating message status:', error);
      throw error;
    }
  }

  // Kullanıcı admin yanıtını okundu olarak işaretler
  @Put('my-messages/:messageId/admin-replies/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark admin replies as read' })
  @ApiResponse({
    status: 200,
    description: 'Admin replies marked as read successfully',
  })
  async markAdminRepliesAsRead(
    @Param('messageId') messageId: string,
    @Request() req: any
  ) {
    try {
      console.log(`📨 User ${req.user.id} marking admin replies as read for message ${messageId}`);
      const result = await this.messagesService.markAdminRepliesAsRead(messageId, req.user.id);
      return result;
    } catch (error) {
      console.error('❌ Error marking admin replies as read:', error);
      throw error;
    }
  }

  // Admin tüm mesajları görür
  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all messages for admin' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
  })
  async getAllMessages(
    @Query() query: {
      status?: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED';
      messageType?: 'QUESTION' | 'SUPPORT' | 'FEEDBACK' | 'GENERAL';
      search?: string;
    },
    @Request() req: any
  ) {
    try {
      console.log(`📨 Admin ${req.user.id} getting all messages`);
      const messages = await this.messagesService.getAllMessages(req.user.id, query);
      return messages;
    } catch (error) {
      console.error('❌ Error getting all messages:', error);
      throw error;
    }
  }

  // Admin mesaj detayını görür
  @Get('admin/:messageId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get message detail for admin' })
  @ApiResponse({
    status: 200,
    description: 'Message detail retrieved successfully',
  })
  async getAdminMessage(
    @Param('messageId') messageId: string,
    @Request() req: any
  ) {
    try {
      console.log(`📨 Admin ${req.user.id} getting message ${messageId}`);
      const message = await this.messagesService.getMessageById(messageId, undefined, true);
      return message;
    } catch (error) {
      console.error('❌ Error getting admin message detail:', error);
      throw error;
    }
  }

  // Admin mesaja yanıt verir
  @Post('admin/:messageId/reply')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin reply to message' })
  @ApiResponse({
    status: 201,
    description: 'Admin reply sent successfully',
  })
  async adminReply(
    @Param('messageId') messageId: string,
    @Body() replyDto: { content: string },
    @Request() req: any
  ) {
    try {
      console.log(`📨 Admin ${req.user.id} replying to message ${messageId}`);
      const reply = await this.messagesService.adminReply(messageId, req.user.id, replyDto.content);
      return reply;
    } catch (error) {
      console.error('❌ Error sending admin reply:', error);
      throw error;
    }
  }

  // Admin mesaj durumunu günceller
  @Put('admin/:messageId/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update message status' })
  @ApiResponse({
    status: 200,
    description: 'Message status updated successfully',
  })
  async updateMessageStatus(
    @Param('messageId') messageId: string,
    @Body() statusDto: { status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED' },
    @Request() req: any
  ) {
    try {
      console.log(`📨 Admin ${req.user.id} updating message ${messageId} status to ${statusDto.status}`);
      const message = await this.messagesService.updateMessageStatus(messageId, statusDto.status);
      return message;
    } catch (error) {
      console.error('❌ Error updating message status:', error);
      throw error;
    }
  }

  // Admin mesaj istatistiklerini görür
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get message statistics for admin' })
  @ApiResponse({
    status: 200,
    description: 'Message stats retrieved successfully',
  })
  async getMessageStats(@Request() req: any) {
    try {
      console.log(`📊 Admin ${req.user.id} getting message stats`);
      const stats = await this.messagesService.getMessageStats(req.user.id);
      return stats;
    } catch (error) {
      console.error('❌ Error getting message stats:', error);
      throw error;
    }
  }
}
