import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, courseId, amount, paymentMethod, metadata, orderNumber, billingInfo } = createOrderDto;

    // Varsayılan olarak 1 yıl erişim süresi
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const order = await this.prisma.order.create({
      data: {
        userId,
        courseId,
        amount,
        paymentMethod,
        expiresAt,
        metadata,
        orderNumber: orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        billingInfo,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
          },
        },
      },
    });

    // Erişim hakkı oluştur
    await this.prisma.accessGrant.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        endAt: expiresAt,
        isActive: true,
        orderId: order.id,
      },
      create: {
        userId,
        courseId,
        orderId: order.id,
        endAt: expiresAt,
        isActive: true,
      },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
          },
        },
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<any> {
    try {
      console.log(`🔄 Updating order status: ${id} -> ${status}`);
      
      // Update order status
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: status as OrderStatus },
        include: {
          course: true,
          user: true
        }
      });
      
      // If status is COMPLETED, activate access grant
      if (status === 'COMPLETED') {
        console.log(`🔓 Activating access grant for order: ${id}`);
        
        await this.prisma.accessGrant.updateMany({
          where: { orderId: id },
          data: { 
            isActive: true,
            startAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ Access grant activated for order: ${id}`);
      }
      
      // If status is CANCELLED or FAILED, deactivate access grant
      if (['CANCELLED', 'FAILED'].includes(status)) {
        console.log(`🔒 Deactivating access grant for order: ${id}`);
        
        await this.prisma.accessGrant.updateMany({
          where: { orderId: id },
          data: { 
            isActive: false,
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ Access grant deactivated for order: ${id}`);
      }
      
      return {
        message: 'Order status updated successfully',
        order: updatedOrder
      };
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }

  async remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
  }

  async getOrderStats() {
    const [totalOrders, completedOrders, totalRevenue] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({
        where: { status: 'COMPLETED' },
      }),
      this.prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      successRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    };
  }
}
