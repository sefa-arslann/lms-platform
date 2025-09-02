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
    login(loginDto: LoginDto, deviceInfo: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
        status?: undefined;
        requestId?: undefined;
        message?: undefined;
    } | {
        status: string;
        requestId: string;
        message: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
        accessToken?: undefined;
        refreshToken?: undefined;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, deviceId: string): Promise<{
        message: string;
    }>;
    verifyToken(user: any): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        role: any;
    }>;
}
