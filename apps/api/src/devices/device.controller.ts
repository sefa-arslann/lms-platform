import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Devices')
@Controller('devices')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('my-devices')
  @ApiOperation({ summary: 'Get current user devices' })
  @ApiResponse({
    status: 200,
    description: 'User devices retrieved successfully',
  })
  async getMyDevices(@Request() req: any) {
    return this.deviceService.getMyDevices(req.user.id);
  }

  @Post('enroll')
  @ApiOperation({ summary: 'Enroll new device' })
  @ApiResponse({
    status: 201,
    description: 'Device enrolled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Device enrollment failed',
  })
  async enrollDevice(@Body() deviceInfo: any, @Request() req: any) {
    return this.deviceService.enrollDevice(req.user.id, deviceInfo);
  }

  @Post('enroll/approve')
  @ApiOperation({ summary: 'Approve device enrollment request' })
  @ApiResponse({
    status: 200,
    description: 'Device approved successfully',
  })
  approveEnrollRequest(
    @Body() body: { requestId: string },
    @Request() req: any,
  ) {
    return this.deviceService.approveEnrollRequest(body.requestId, req.user.id);
  }

  @Patch(':id/rename')
  @ApiOperation({ summary: 'Rename device' })
  @ApiResponse({
    status: 200,
    description: 'Device renamed successfully',
  })
  renameDevice(
    @Param('id') id: string,
    @Body() body: { deviceName: string },
    @Request() req: any,
  ) {
    // Verify device belongs to user
    return this.deviceService.renameDevice(id, body.deviceName);
  }

  @Patch(':id/revoke')
  @ApiOperation({ summary: 'Revoke device access' })
  @ApiResponse({
    status: 200,
    description: 'Device revoked successfully',
  })
  revokeDevice(@Param('id') id: string, @Request() req: any) {
    return this.deviceService.revokeDevice(id);
  }

  @Patch(':id/trust')
  @ApiOperation({ summary: 'Set device as trusted' })
  @ApiResponse({
    status: 200,
    description: 'Device trust status updated',
  })
  setDeviceTrusted(
    @Param('id') id: string,
    @Body() body: { isTrusted: boolean },
    @Request() req: any,
  ) {
    return this.deviceService.setDeviceTrusted(id, body.isTrusted);
  }

  @Get('enroll-requests')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all enrollment requests (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment requests retrieved successfully',
  })
  getEnrollRequests() {
    // This would be implemented in DeviceService
    return [];
  }
}
