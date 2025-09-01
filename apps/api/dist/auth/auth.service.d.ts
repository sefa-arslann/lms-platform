import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { DeviceService } from '../devices/device.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly deviceService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, deviceService: DeviceService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto, deviceInfo: any): unknown;
    register(createUserDto: CreateUserDto): unknown;
    refreshToken(token: string): unknown;
    logout(userId: string, deviceId: string): unknown;
    verifyToken(user: any): unknown;
}
