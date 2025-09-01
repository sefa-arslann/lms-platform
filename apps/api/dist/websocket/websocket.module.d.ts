import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class AdminWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinAdmin(client: Socket, payload: {
        adminId: string;
    }): void;
    sendDashboardUpdate(data: any): void;
    sendUserActivityUpdate(data: any): void;
    sendCourseViewUpdate(data: any): void;
    sendVideoAnalyticsUpdate(data: any): void;
    getConnectedClientsCount(): number;
    sendToClient(clientId: string, event: string, data: any): void;
    broadcastToAll(event: string, data: any): void;
}
export declare class WebSocketModule {
}
