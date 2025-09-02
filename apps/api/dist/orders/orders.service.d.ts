import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        course: {
            id: string;
            title: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        currency: string;
        userId: string;
        expiresAt: Date | null;
        courseId: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        orderNumber: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        course: {
            id: string;
            title: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        currency: string;
        userId: string;
        expiresAt: Date | null;
        courseId: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        orderNumber: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        course: {
            id: string;
            title: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        currency: string;
        userId: string;
        expiresAt: Date | null;
        courseId: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        orderNumber: string;
    }>;
    updateOrderStatus(id: string, status: string): Promise<any>;
    remove(id: string): Promise<{
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        currency: string;
        userId: string;
        expiresAt: Date | null;
        courseId: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        orderNumber: string;
    }>;
    getUserOrders(userId: string): Promise<({
        course: {
            id: string;
            title: string;
            description: string;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        currency: string;
        userId: string;
        expiresAt: Date | null;
        courseId: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        orderNumber: string;
    })[]>;
    getOrderStats(): Promise<{
        totalOrders: number;
        completedOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        successRate: number;
    }>;
}
