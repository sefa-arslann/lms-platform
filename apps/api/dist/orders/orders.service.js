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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(createOrderDto) {
        const { userId, courseId, amount, paymentMethod, metadata, orderNumber, billingInfo } = createOrderDto;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateOrderStatus(id, status) {
        try {
            console.log(`🔄 Updating order status: ${id} -> ${status}`);
            const updatedOrder = await this.prisma.order.update({
                where: { id },
                data: { status: status },
                include: {
                    course: true,
                    user: true
                }
            });
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
        }
        catch (error) {
            console.error('❌ Error updating order status:', error);
            throw error;
        }
    }
    async remove(id) {
        return this.prisma.order.delete({
            where: { id },
        });
    }
    async getUserOrders(userId) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map