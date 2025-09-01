import { PaymentMethod } from '@prisma/client';
export declare class CreateOrderDto {
    userId: string;
    courseId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    orderNumber?: string;
    billingInfo?: Record<string, any>;
    metadata?: Record<string, any>;
}
