"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceInfo = void 0;
const common_1 = require("@nestjs/common");
exports.DeviceInfo = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const installId = request.headers['x-device-id'] ||
        request.headers['x-installation-id'] ||
        `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
        installId,
        platform: request.headers['x-platform'] || 'web',
        model: request.headers['x-device-model'] || 'Unknown',
        userAgent: request.headers['user-agent'],
        ip: request.ip || request.connection.remoteAddress || '127.0.0.1',
    };
});
//# sourceMappingURL=device-info.decorator.js.map