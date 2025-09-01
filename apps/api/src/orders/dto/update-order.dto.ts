import { IsString, IsNumber, IsEnum, IsOptional, IsObject } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
