import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(createOrderDto: CreateOrderDto): unknown;
    findAll(): unknown;
    findOne(id: string): unknown;
    updateOrderStatus(id: string, status: string): Promise<any>;
    remove(id: string): unknown;
    getUserOrders(userId: string): unknown;
    getOrderStats(): unknown;
}
