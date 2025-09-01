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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DeviceService = class DeviceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByInstallId(installId) {
        console.log(`🔍 findByInstallId called with installId: ${installId}`);
        const device = await this.prisma.userDevice.findUnique({
            where: { installId },
        });
        console.log(`🔍 findByInstallId result:`, device ? `Found: ${device.id}` : 'Not found');
        return device;
    }
    async findExistingDevice(userId, deviceInfo) {
        console.log(`🔍 Searching for existing device for user ${userId} with criteria:`, {
            ip: deviceInfo.ip,
            userAgent: deviceInfo.userAgent,
            platform: deviceInfo.platform,
            model: deviceInfo.model
        });
        let existingDevice = await this.prisma.userDevice.findFirst({
            where: {
                userId,
                firstIp: deviceInfo.ip
            },
        });
        if (existingDevice) {
            console.log(`🔍 Found device by exact IP match: ${existingDevice.id}, IP: ${existingDevice.firstIp}`);
            return existingDevice;
        }
        existingDevice = await this.prisma.userDevice.findFirst({
            where: {
                userId,
                userAgent: deviceInfo.userAgent
            },
        });
        if (existingDevice) {
            console.log(`🔍 Found device by exact userAgent match: ${existingDevice.id}, UserAgent: ${existingDevice.userAgent}`);
            return existingDevice;
        }
        existingDevice = await this.prisma.userDevice.findFirst({
            where: {
                userId,
                platform: deviceInfo.platform,
                model: deviceInfo.model
            },
        });
        if (existingDevice) {
            console.log(`🔍 Found device by platform + model: ${existingDevice.id}, Platform: ${existingDevice.platform}, Model: ${existingDevice.model}`);
            return existingDevice;
        }
        existingDevice = await this.prisma.userDevice.findFirst({
            where: {
                userId,
                platform: deviceInfo.platform
            },
        });
        if (existingDevice) {
            console.log(`🔍 Found device by platform only: ${existingDevice.id}, Platform: ${existingDevice.platform}`);
            return existingDevice;
        }
        console.log(`❌ No existing device found for user ${userId}`);
        return null;
    }
    async createEnrollRequest(userId, deviceInfo) {
        const activeDevices = await this.prisma.userDevice.count({
            where: {
                userId,
                isActive: true,
            },
        });
        if (activeDevices >= 3) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });
            if (user?.role !== 'ADMIN') {
                throw new common_1.BadRequestException('Maximum device limit reached. Please deactivate an existing device.');
            }
        }
        const requestId = `enroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return this.prisma.deviceEnrollRequest.create({
            data: {
                userId,
                installId: deviceInfo.installId,
                platform: deviceInfo.platform,
                model: deviceInfo.model,
                ip: deviceInfo.ip,
                requestId,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            },
        });
    }
    async approveEnrollRequest(requestId, options) {
        const request = await this.prisma.deviceEnrollRequest.findUnique({
            where: { requestId },
            include: { user: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Enrollment request not found');
        }
        if (request.status !== client_1.EnrollStatus.PENDING) {
            throw new common_1.BadRequestException('Request is not pending');
        }
        if (request.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Request has expired');
        }
        if (request.user.role !== 'ADMIN') {
            const activeDevices = await this.prisma.userDevice.count({
                where: {
                    userId: request.userId,
                    isActive: true,
                },
            });
            if (activeDevices >= 3) {
                throw new common_1.BadRequestException('Maximum device limit reached. Please deactivate an existing device.');
            }
        }
        const device = await this.prisma.userDevice.create({
            data: {
                userId: request.userId,
                installId: request.installId || '',
                publicKey: `key_${Date.now()}`,
                platform: request.platform,
                model: request.model,
                deviceName: options?.deviceName || `${request.platform} Device`,
                firstIp: request.ip,
                lastIp: request.ip,
                isActive: true,
                isTrusted: options?.isTrusted || false,
                approvedAt: new Date(),
            },
        });
        await this.prisma.deviceEnrollRequest.update({
            where: { requestId },
            data: { status: client_1.EnrollStatus.APPROVED },
        });
        return device;
    }
    async updateLastSeen(deviceId, ip) {
        return this.prisma.userDevice.update({
            where: { id: deviceId },
            data: {
                lastIp: ip,
                lastSeenAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
    async getMyDevices(userId) {
        return this.prisma.userDevice.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async enrollDevice(userId, deviceInfo) {
        try {
            console.log(`🔍 enrollDevice called for user ${userId} with device info:`, {
                platform: deviceInfo.platform,
                model: deviceInfo.model,
                ip: deviceInfo.ip,
                userAgent: deviceInfo.userAgent,
                installId: deviceInfo.installId
            });
            const existingDevice = await this.prisma.userDevice.findFirst({
                where: {
                    userId,
                    OR: [
                        ...(deviceInfo.installId ? [{ installId: deviceInfo.installId }] : []),
                        ...(deviceInfo.ip ? [{ firstIp: deviceInfo.ip }] : []),
                        {
                            userAgent: deviceInfo.userAgent,
                            platform: deviceInfo.platform,
                        },
                        {
                            model: deviceInfo.model,
                            platform: deviceInfo.platform,
                        }
                    ]
                },
            });
            if (existingDevice) {
                console.log(`🔍 Existing device found: ${existingDevice.id}, updating...`);
                return this.prisma.userDevice.update({
                    where: { id: existingDevice.id },
                    data: {
                        lastSeenAt: new Date(),
                        updatedAt: new Date(),
                        lastIp: deviceInfo.ip || existingDevice.lastIp,
                        osVersion: deviceInfo.osVersion || existingDevice.osVersion,
                        appVersion: deviceInfo.appVersion || existingDevice.appVersion,
                        model: deviceInfo.model || existingDevice.model,
                        deviceName: deviceInfo.deviceName || existingDevice.deviceName,
                        ...(deviceInfo.ip && deviceInfo.ip !== existingDevice.firstIp && {
                            lastIp: deviceInfo.ip
                        })
                    },
                });
            }
            const activeDevices = await this.prisma.userDevice.count({
                where: {
                    userId,
                    isActive: true,
                },
            });
            const isTrusted = activeDevices === 0;
            const approvedAt = isTrusted ? new Date() : null;
            const installId = deviceInfo.installId || `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const newDevice = await this.prisma.userDevice.create({
                data: {
                    userId,
                    installId,
                    publicKey: `pk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    platform: deviceInfo.platform || 'unknown',
                    model: deviceInfo.model || 'unknown',
                    userAgent: deviceInfo.userAgent || 'unknown',
                    firstIp: deviceInfo.ip || '127.0.0.1',
                    lastIp: deviceInfo.ip || '127.0.0.1',
                    lastSeenAt: new Date(),
                    isTrusted,
                    isActive: true,
                    approvedAt,
                    deviceName: deviceInfo.deviceName || `${deviceInfo.platform || 'Unknown'} Device`,
                    osVersion: deviceInfo.osVersion || 'unknown',
                    appVersion: deviceInfo.appVersion || 'unknown',
                },
            });
            console.log(`🔐 New device enrolled: ${newDevice.id}, Trusted: ${isTrusted}, Total devices: ${activeDevices + 1}, IP: ${deviceInfo.ip}`);
            return newDevice;
        }
        catch (error) {
            console.error('Device enrollment error:', error);
            throw error;
        }
    }
    async revokeDevice(deviceId) {
        return this.prisma.userDevice.update({
            where: { id: deviceId },
            data: {
                isActive: false,
            },
        });
    }
    async getUserDevices(userId) {
        return this.prisma.userDevice.findMany({
            where: { userId },
            orderBy: { lastSeenAt: 'desc' },
        });
    }
    async countActiveDevices(userId) {
        return this.prisma.userDevice.count({
            where: {
                userId,
                isActive: true,
            },
        });
    }
    async renameDevice(deviceId, deviceName) {
        return this.prisma.userDevice.update({
            where: { id: deviceId },
            data: { deviceName },
        });
    }
    async setDeviceTrusted(deviceId, isTrusted) {
        return this.prisma.userDevice.update({
            where: { id: deviceId },
            data: { isTrusted },
        });
    }
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeviceService);
//# sourceMappingURL=device.service.js.map