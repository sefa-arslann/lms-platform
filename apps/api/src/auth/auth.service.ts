import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { DeviceService } from '../devices/device.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly deviceService: DeviceService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, deviceInfo: any) {
    console.log(`🔐 Login attempt for ${loginDto.email} with device info:`, {
      platform: deviceInfo.platform,
      model: deviceInfo.model,
      ip: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      installId: deviceInfo.installId
    });

    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Admin users don't need device approval - bypass all device checks
    if (user.role === 'ADMIN') {
      // For admin users, create or find device automatically without any limits
      let existingDevice = await this.deviceService.findByInstallId(deviceInfo.installId);
      
      if (!existingDevice) {
        // Auto-approve device for admin users (bypass device limit)
        const enrollRequest = await this.deviceService.createEnrollRequest(user.id, deviceInfo);
        existingDevice = await this.deviceService.approveEnrollRequest(enrollRequest.requestId, {
          deviceName: `Admin-${deviceInfo.platform}`,
          isTrusted: true
        });
      }
      
      // Proceed with admin login
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        deviceId: existingDevice.id,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(
        { ...payload, type: 'refresh' },
        { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') }
      );

      // Update device last seen
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

    // Regular users - check if they need device approval
    console.log(`🔍 Starting device lookup for ${user.email}...`);
    
    let existingDevice = await this.deviceService.findByInstallId(deviceInfo.installId);
    console.log(`🔍 findByInstallId result:`, existingDevice ? `Found: ${existingDevice.id}` : 'Not found');
    
    if (!existingDevice) {
      // Try to find existing device by other criteria (IP, userAgent, etc.)
      console.log(`🔍 Trying findExistingDevice with other criteria...`);
      existingDevice = await this.deviceService.findExistingDevice(user.id, deviceInfo);
      console.log(`🔍 Device lookup result for ${user.email}:`, existingDevice ? `Found: ${existingDevice.id}` : 'Not found');
    }
    
    if (!existingDevice) {
      // Check if user has 3 or more active devices
      const activeDevices = await this.deviceService.countActiveDevices(user.id);
      console.log(`📱 User ${user.email} has ${activeDevices} active devices`);
      
      if (activeDevices >= 3) {
        // User has 3+ devices, require approval
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
      } else {
        // User has less than 3 devices, auto-approve
        console.log(`✅ Auto-approving device for ${user.email} (${activeDevices} devices)`);
        const enrollRequest = await this.deviceService.createEnrollRequest(user.id, deviceInfo);
        const newDevice = await this.deviceService.approveEnrollRequest(enrollRequest.requestId, {
          deviceName: `${deviceInfo.platform} Device`,
          isTrusted: false
        });
        existingDevice = newDevice;
        console.log(`🔐 New device created for ${user.email}: ${newDevice.id}`);
      }
    } else {
      console.log(`🔍 Existing device found for ${user.email}: ${existingDevice.id}`);
    }

    // Device is approved, proceed with login
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      deviceId: existingDevice.id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') }
    );

    // Update device last seen and IP if changed
    await this.deviceService.updateLastSeen(existingDevice.id, deviceInfo.ip);
    
    // Log device reuse
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

  async register(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(this.configService.get('BCRYPT_ROUNDS', '12'))
    );

    // Create user
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

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        deviceId: payload.deviceId,
      };

      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign(
        { ...newPayload, type: 'refresh' },
        { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') }
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, deviceId: string) {
    // Invalidate device session
    await this.deviceService.revokeDevice(deviceId);
    
    return {
      message: 'Logged out successfully',
    };
  }

  async verifyToken(user: any) {
    // Return user information from JWT payload
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
