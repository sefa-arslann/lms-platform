"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketModule = exports.AdminWebSocketGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let AdminWebSocketGateway = class AdminWebSocketGateway {
    server;
    connectedClients = new Map();
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        this.connectedClients.set(client.id, client);
        client.emit('connected', {
            message: 'Admin dashboard WebSocket connected',
            clientId: client.id,
            timestamp: new Date()
        });
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }
    handleJoinAdmin(client, payload) {
        client.join('admin-room');
        client.emit('joined-admin', {
            message: 'Joined admin room',
            adminId: payload.adminId,
            timestamp: new Date()
        });
    }
    sendDashboardUpdate(data) {
        if (this.server) {
            this.server.to('admin-room').emit('dashboard-update', {
                ...data,
                timestamp: new Date(),
            });
        }
    }
    sendUserActivityUpdate(data) {
        if (this.server) {
            this.server.to('admin-room').emit('user-activity', {
                ...data,
                timestamp: new Date(),
            });
        }
    }
    sendCourseViewUpdate(data) {
        if (this.server) {
            this.server.to('admin-room').emit('course-view', {
                ...data,
                timestamp: new Date(),
            });
        }
    }
    sendVideoAnalyticsUpdate(data) {
        if (this.server) {
            this.server.to('admin-room').emit('video-analytics', {
                ...data,
                timestamp: new Date(),
            });
        }
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
    sendToClient(clientId, event, data) {
        const client = this.connectedClients.get(clientId);
        if (client) {
            client.emit(event, data);
        }
    }
    broadcastToAll(event, data) {
        if (this.server) {
            this.server.emit(event, {
                ...data,
                timestamp: new Date(),
            });
        }
    }
};
exports.AdminWebSocketGateway = AdminWebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], AdminWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], AdminWebSocketGateway.prototype, "handleJoinAdmin", null);
exports.AdminWebSocketGateway = AdminWebSocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/admin-dashboard',
    })
], AdminWebSocketGateway);
let WebSocketModule = class WebSocketModule {
};
exports.WebSocketModule = WebSocketModule;
exports.WebSocketModule = WebSocketModule = __decorate([
    (0, common_1.Module)({
        providers: [AdminWebSocketGateway],
        exports: [AdminWebSocketGateway],
    })
], WebSocketModule);
//# sourceMappingURL=websocket.module.js.map