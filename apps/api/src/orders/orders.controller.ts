import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      console.log('🔐 Order creation request:', {
        userId: req.user?.id,
        userEmail: req.user?.email,
        hasUser: !!req.user,
        headers: req.headers?.authorization?.substring(0, 20) + '...',
        orderData: createOrderDto
      });
      
      // Override userId from authenticated user
      createOrderDto.userId = req.user.id;
      
      const result = await this.ordersService.createOrder(createOrderDto);
      console.log('✅ Order created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ Order creation error:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Order statistics retrieved successfully' })
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders for a specific user' })
  @ApiResponse({ status: 200, description: 'User orders retrieved successfully' })
  getUserOrders(@Param('userId') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, description: 'User orders retrieved successfully' })
  getMyOrders(@Request() req) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: string },
    @Request() req: any
  ) {
    try {
      console.log(`🔄 Updating order status: ${id} to ${updateStatusDto.status}`);
      
      // Check if user is admin or order owner
      const order = await this.ordersService.findOne(id);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      
      // Only admin can update order status
      if (req.user.role !== 'ADMIN') {
        throw new ForbiddenException('Only admins can update order status');
      }
      
      const result = await this.ordersService.updateOrderStatus(id, updateStatusDto.status);
      
      console.log(`✅ Order status updated: ${id} -> ${updateStatusDto.status}`);
      return result;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
