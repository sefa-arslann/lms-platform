import { PrismaService } from '../prisma/prisma.service';
export declare class DeviceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByInstallId(installId: string): unknown;
    findExistingDevice(userId: string, deviceInfo: any): unknown;
    createEnrollRequest(userId: string, deviceInfo: any): unknown;
    approveEnrollRequest(requestId: string, options?: {
        deviceName?: string;
        isTrusted?: boolean;
    }): unknown;
    updateLastSeen(deviceId: string, ip: string): unknown;
    getMyDevices(userId: string): unknown;
    enrollDevice(userId: string, deviceInfo: any): unknown;
    revokeDevice(deviceId: string): unknown;
    getUserDevices(userId: string): unknown;
    countActiveDevices(userId: string): unknown;
    renameDevice(deviceId: string, deviceName: string): unknown;
    setDeviceTrusted(deviceId: string, isTrusted: boolean): unknown;
}
