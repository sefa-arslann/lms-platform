import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DeviceInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Generate a unique install ID for web clients
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
  },
);
