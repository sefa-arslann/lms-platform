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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const device_service_1 = require("./device.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let DeviceController = class DeviceController {
    deviceService;
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    async getMyDevices(req) {
        return this.deviceService.getMyDevices(req.user.id);
    }
    async enrollDevice(deviceInfo, req) {
        return this.deviceService.enrollDevice(req.user.id, deviceInfo);
    }
    approveEnrollRequest(body, req) {
        return this.deviceService.approveEnrollRequest(body.requestId, req.user.id);
    }
    renameDevice(id, body, req) {
        return this.deviceService.renameDevice(id, body.deviceName);
    }
    revokeDevice(id, req) {
        return this.deviceService.revokeDevice(id);
    }
    setDeviceTrusted(id, body, req) {
        return this.deviceService.setDeviceTrusted(id, body.isTrusted);
    }
    getEnrollRequests() {
        return [];
    }
};
exports.DeviceController = DeviceController;
__decorate([
    (0, common_1.Get)('my-devices'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user devices' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User devices retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "getMyDevices", null);
__decorate([
    (0, common_1.Post)('enroll'),
    (0, swagger_1.ApiOperation)({ summary: 'Enroll new device' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Device enrolled successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Device enrollment failed',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "enrollDevice", null);
__decorate([
    (0, common_1.Post)('enroll/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve device enrollment request' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device approved successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "approveEnrollRequest", null);
__decorate([
    (0, common_1.Patch)(':id/rename'),
    (0, swagger_1.ApiOperation)({ summary: 'Rename device' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device renamed successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "renameDevice", null);
__decorate([
    (0, common_1.Patch)(':id/revoke'),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke device access' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device revoked successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "revokeDevice", null);
__decorate([
    (0, common_1.Patch)(':id/trust'),
    (0, swagger_1.ApiOperation)({ summary: 'Set device as trusted' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device trust status updated',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "setDeviceTrusted", null);
__decorate([
    (0, common_1.Get)('enroll-requests'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all enrollment requests (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Enrollment requests retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeviceController.prototype, "getEnrollRequests", null);
exports.DeviceController = DeviceController = __decorate([
    (0, swagger_1.ApiTags)('Devices'),
    (0, common_1.Controller)('devices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [device_service_1.DeviceService])
], DeviceController);
//# sourceMappingURL=device.controller.js.map