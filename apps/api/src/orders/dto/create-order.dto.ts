import { IsString, IsNumber, IsEnum, IsOptional, IsObject } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsString()
  courseId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsObject()
  billingInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
