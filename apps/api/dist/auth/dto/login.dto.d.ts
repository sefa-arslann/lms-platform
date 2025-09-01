export declare class DeviceInfoDto {
    platform: string;
    model: string;
    ip: string;
    userAgent: string;
    installId: string;
}
export declare class LoginDto {
    email: string;
    password: string;
    deviceInfo: DeviceInfoDto;
}
