import { DeviceService } from './device.service';
export declare class DeviceController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    getMyDevices(req: any): unknown;
    enrollDevice(deviceInfo: any, req: any): unknown;
    approveEnrollRequest(body: {
        requestId: string;
    }, req: any): unknown;
    renameDevice(id: string, body: {
        deviceName: string;
    }, req: any): unknown;
    revokeDevice(id: string, req: any): unknown;
    setDeviceTrusted(id: string, body: {
        isTrusted: boolean;
    }, req: any): unknown;
    getEnrollRequests(): {};
}
