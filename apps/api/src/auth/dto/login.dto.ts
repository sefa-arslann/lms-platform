import { IsEmail, IsString, MinLength, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DeviceInfoDto {
  @ApiProperty({
    description: 'Device platform',
    example: 'MacIntel',
  })
  @IsString()
  platform: string;

  @ApiProperty({
    description: 'Device model',
    example: 'Mac',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Device IP address',
    example: '127.0.0.1',
  })
  @IsString()
  ip: string;

  @ApiProperty({
    description: 'Device user agent',
    example: 'Mozilla/5.0...',
  })
  @IsString()
  userAgent: string;

  @ApiProperty({
    description: 'Device install ID',
    example: 'web_1234567890_abc123',
  })
  @IsString()
  installId: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Device information',
    type: DeviceInfoDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo: DeviceInfoDto;
}
