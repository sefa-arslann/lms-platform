import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: any): unknown;
    findAll(): unknown;
    getOrderStats(): unknown;
    getUserOrders(userId: string): unknown;
    getMyOrders(req: any): unknown;
    findOne(id: string): unknown;
    updateOrderStatus(id: string, updateStatusDto: {
        status: string;
    }, req: any): unknown;
    remove(id: string): unknown;
}
