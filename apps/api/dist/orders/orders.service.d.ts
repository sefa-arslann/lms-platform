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
        orderNumber: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
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
        orderNumber: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
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
        orderNumber: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
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
        orderNumber: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
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
        orderNumber: string;
        invoiceNumber: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        billingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        paymentIntentId: string | null;
        purchasedAt: Date;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
    })[]>;
    getOrderStats(): Promise<{
        totalOrders: number;
        completedOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        successRate: number;
    }>;
}
