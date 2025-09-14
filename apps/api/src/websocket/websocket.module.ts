import { Module } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/admin-dashboard',
})
export class AdminWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    
    // Send welcome message
    client.emit('connected', { 
      message: 'Admin dashboard WebSocket connected',
      clientId: client.id,
      timestamp: new Date()
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join-admin')
  handleJoinAdmin(client: Socket, payload: { adminId: string }) {
    client.join('admin-room');
    client.emit('joined-admin', { 
      message: 'Joined admin room',
      adminId: payload.adminId,
      timestamp: new Date()
    });
  }

  // Send real-time updates to admin dashboard
  sendDashboardUpdate(data: any) {
    if (this.server) {
      this.server.to('admin-room').emit('dashboard-update', {
        ...data,
        timestamp: new Date(),
      });
    }
  }

  // Send user activity updates
  sendUserActivityUpdate(data: any) {
    if (this.server) {
      this.server.to('admin-room').emit('user-activity', {
        ...data,
        timestamp: new Date(),
      });
    }
  }

  // Send course view updates
  sendCourseViewUpdate(data: any) {
    if (this.server) {
      this.server.to('admin-room').emit('course-view', {
        ...data,
        timestamp: new Date(),
      });
    }
  }

  // Send video analytics updates
  sendVideoAnalyticsUpdate(data: any) {
    if (this.server) {
      this.server.to('admin-room').emit('video-analytics', {
        ...data,
        timestamp: new Date(),
      });
    }
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  // Send message to specific client
  sendToClient(clientId: string, event: string, data: any) {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  // Broadcast to all connected clients
  broadcastToAll(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, {
        ...data,
        timestamp: new Date(),
      });
    }
  }
}

@Module({
  providers: [AdminWebSocketGateway],
  exports: [AdminWebSocketGateway],
})
export class WebSocketModule {}
