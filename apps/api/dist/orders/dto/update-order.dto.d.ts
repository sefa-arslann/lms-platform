import { PaymentMethod } from '@prisma/client';
export declare class UpdateOrderDto {
    userId?: string;
    courseId?: string;
    amount?: number;
    paymentMethod?: PaymentMethod;
    metadata?: Record<string, any>;
}
