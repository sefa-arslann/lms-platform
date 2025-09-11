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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
const device_service_1 = require("../devices/device.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    deviceService;
    constructor(usersService, jwtService, configService, deviceService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.deviceService = deviceService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto, deviceInfo) {
        console.log(`🔐 Login attempt for ${loginDto.email} with device info:`, {
            platform: deviceInfo.platform,
            model: deviceInfo.model,
            ip: deviceInfo.ip,
            userAgent: deviceInfo.userAgent,
            installId: deviceInfo.installId
        });
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.role === 'ADMIN') {
            let existingDevice = await this.deviceService.findByInstallId(deviceInfo.installId);
            if (!existingDevice) {
                const enrollRequest = await this.deviceService.createEnrollRequest(user.id, deviceInfo);
                existingDevice = await this.deviceService.approveEnrollRequest(enrollRequest.requestId, {
                    deviceName: `Admin-${deviceInfo.platform}`,
                    isTrusted: true
                });
            }
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                deviceId: existingDevice.id,
            };
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') });
            await this.deviceService.updateLastSeen(existingDevice.id, deviceInfo.ip);
            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            };
        }
        console.log(`🔍 Starting device lookup for ${user.email}...`);
        let existingDevice = await this.deviceService.findByInstallId(deviceInfo.installId);
        console.log(`🔍 findByInstallId result:`, existingDevice ? `Found: ${existingDevice.id}` : 'Not found');
        if (!existingDevice) {
            console.log(`🔍 Trying findExistingDevice with other criteria...`);
            existingDevice = await this.deviceService.findExistingDevice(user.id, deviceInfo);
            console.log(`🔍 Device lookup result for ${user.email}:`, existingDevice ? `Found: ${existingDevice.id}` : 'Not found');
        }
        if (!existingDevice) {
            const activeDevices = await this.deviceService.countActiveDevices(user.id);
            console.log(`📱 User ${user.email} has ${activeDevices} active devices`);
            if (activeDevices >= 3) {
                console.log(`⚠️ User ${user.email} has reached device limit, requiring approval`);
                const enrollRequest = await this.deviceService.createEnrollRequest(user.id, deviceInfo);
                return {
                    status: 'pending_approval',
                    requestId: enrollRequest.requestId,
                    message: 'Device approval required - maximum device limit reached',
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.firstName,
                        role: user.role,
                    },
                };
            }
            else {
                console.log(`✅ Auto-approving device for ${user.email} (${activeDevices} devices)`);
                const enrollRequest = await this.deviceService.createEnrollRequest(user.id, deviceInfo);
                const newDevice = await this.deviceService.approveEnrollRequest(enrollRequest.requestId, {
                    deviceName: `${deviceInfo.platform} Device`,
                    isTrusted: false
                });
                existingDevice = newDevice;
                console.log(`🔐 New device created for ${user.email}: ${newDevice.id}`);
            }
        }
        else {
            console.log(`🔍 Existing device found for ${user.email}: ${existingDevice.id}`);
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            deviceId: existingDevice.id,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign({ ...payload, type: 'refresh' }, { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') });
        await this.deviceService.updateLastSeen(existingDevice.id, deviceInfo.ip);
        console.log(`🔐 User ${user.email} logged in with existing device: ${existingDevice.id}, IP: ${deviceInfo.ip}`);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async register(createUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, parseInt(this.configService.get('BCRYPT_ROUNDS', '12')));
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const newPayload = {
                sub: user.id,
                email: user.email,
                role: user.role,
                deviceId: payload.deviceId,
            };
            const accessToken = this.jwtService.sign(newPayload);
            const refreshToken = this.jwtService.sign({ ...newPayload, type: 'refresh' }, { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') });
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, deviceId) {
        await this.deviceService.revokeDevice(deviceId);
        return {
            message: 'Logged out successfully',
        };
    }
    async verifyToken(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        device_service_1.DeviceService])
], AuthService);
//# sourceMappingURL=auth.service.js.map