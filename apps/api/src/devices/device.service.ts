import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollStatus } from '@prisma/client';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByInstallId(installId: string) {
    console.log(`🔍 findByInstallId called with installId: ${installId}`);
    
    const device = await this.prisma.userDevice.findUnique({
      where: { installId },
    });
    
    console.log(`🔍 findByInstallId result:`, device ? `Found: ${device.id}` : 'Not found');
    return device;
  }

  async findExistingDevice(userId: string, deviceInfo: any) {
    console.log(`🔍 Searching for existing device for user ${userId} with criteria:`, {
      ip: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      platform: deviceInfo.platform,
      model: deviceInfo.model
    });

    // First try to find by exact IP match
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

    // Then try by userAgent similarity (most reliable)
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

    // Try by platform + model combination
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

    // Try by platform only (fallback)
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

  async createEnrollRequest(userId: string, deviceInfo: any) {
    // Check if user already has 3 active devices (admin bypass)
    const activeDevices = await this.prisma.userDevice.count({
      where: {
        userId,
        isActive: true,
      },
    });

    // Only check limit for non-admin users
    if (activeDevices >= 3) {
      // Get user to check role
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
      
      if (user?.role !== 'ADMIN') {
        throw new BadRequestException('Maximum device limit reached. Please deactivate an existing device.');
      }
    }

    // Create enrollment request
    const requestId = `enroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return this.prisma.deviceEnrollRequest.create({
      data: {
        userId,
        installId: deviceInfo.installId,
        platform: deviceInfo.platform,
        model: deviceInfo.model,
        ip: deviceInfo.ip,
        requestId,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });
  }

  async approveEnrollRequest(requestId: string, options?: { deviceName?: string; isTrusted?: boolean }) {
    const request = await this.prisma.deviceEnrollRequest.findUnique({
      where: { requestId },
      include: { user: true },
    });

    if (!request) {
      throw new NotFoundException('Enrollment request not found');
    }

    if (request.status !== EnrollStatus.PENDING) {
      throw new BadRequestException('Request is not pending');
    }

    if (request.expiresAt < new Date()) {
      throw new BadRequestException('Request has expired');
    }

    // Check device limit only for non-admin users with 3+ devices
    if (request.user.role !== 'ADMIN') {
      const activeDevices = await this.prisma.userDevice.count({
        where: {
          userId: request.userId,
          isActive: true,
        },
      });

      // Only check limit if user has 3 or more devices
      if (activeDevices >= 3) {
        throw new BadRequestException('Maximum device limit reached. Please deactivate an existing device.');
      }
    }

    // Create device
    const device = await this.prisma.userDevice.create({
      data: {
        userId: request.userId,
        installId: request.installId || '',
        publicKey: `key_${Date.now()}`, // In real app, this would be the actual public key
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

    // Update request status
    await this.prisma.deviceEnrollRequest.update({
      where: { requestId },
      data: { status: EnrollStatus.APPROVED },
    });

    return device;
  }

  async updateLastSeen(deviceId: string, ip: string) {
    return this.prisma.userDevice.update({
      where: { id: deviceId },
      data: {
        lastIp: ip,
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async getMyDevices(userId: string) {
    return this.prisma.userDevice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async enrollDevice(userId: string, deviceInfo: any) {
    try {
      console.log(`🔍 enrollDevice called for user ${userId} with device info:`, {
        platform: deviceInfo.platform,
        model: deviceInfo.model,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        installId: deviceInfo.installId
      });

      // Enhanced device detection with multiple criteria
      const existingDevice = await this.prisma.userDevice.findFirst({
        where: {
          userId,
          OR: [
            // Check by installId if provided
            ...(deviceInfo.installId ? [{ installId: deviceInfo.installId }] : []),
            // Check by IP address (same IP = same device)
            ...(deviceInfo.ip ? [{ firstIp: deviceInfo.ip }] : []),
            // Check by userAgent + platform combination
            {
              userAgent: deviceInfo.userAgent,
              platform: deviceInfo.platform,
            },
            // Check by model + platform combination
            {
              model: deviceInfo.model,
              platform: deviceInfo.platform,
            }
          ]
        },
      });

      if (existingDevice) {
        console.log(`🔍 Existing device found: ${existingDevice.id}, updating...`);
        
        // Update existing device with new info
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
            // Update IP if it's different
            ...(deviceInfo.ip && deviceInfo.ip !== existingDevice.firstIp && {
              lastIp: deviceInfo.ip
            })
          },
        });
      }

      // Check device limit with stricter rules
      const activeDevices = await this.prisma.userDevice.count({
        where: {
          userId,
          isActive: true,
        },
      });

      // Only auto-approve first device for security
      const isTrusted = activeDevices === 0;
      const approvedAt = isTrusted ? new Date() : null;

      // Generate unique installId
      const installId = deviceInfo.installId || `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new device with better validation
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
    } catch (error) {
      console.error('Device enrollment error:', error);
      throw error;
    }
  }

  async revokeDevice(deviceId: string) {
    return this.prisma.userDevice.update({
      where: { id: deviceId },
      data: {
        isActive: false,
      },
    });
  }

  async getUserDevices(userId: string) {
    return this.prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  async countActiveDevices(userId: string) {
    return this.prisma.userDevice.count({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  async renameDevice(deviceId: string, deviceName: string) {
    return this.prisma.userDevice.update({
      where: { id: deviceId },
      data: { deviceName },
    });
  }

  async setDeviceTrusted(deviceId: string, isTrusted: boolean) {
    return this.prisma.userDevice.update({
      where: { id: deviceId },
      data: { isTrusted },
    });
  }
}
