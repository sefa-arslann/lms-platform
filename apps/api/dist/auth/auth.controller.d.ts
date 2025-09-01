import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): unknown;
    login(loginDto: LoginDto): unknown;
    refresh(body: {
        refreshToken: string;
    }): unknown;
    logout(req: any): unknown;
    verify(req: any): unknown;
}
