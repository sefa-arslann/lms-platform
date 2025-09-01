import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🔍 JWT Strategy - Validating payload:', { sub: payload.sub, email: payload.email, role: payload.role });
    
    const user = await this.usersService.findById(payload.sub);
    console.log('🔍 JWT Strategy - User found:', user ? { id: user.id, email: user.email, isActive: user.isActive } : 'NULL');
    
    if (!user || !user.isActive) {
      console.log('❌ JWT Strategy - User validation failed:', { userExists: !!user, isActive: user?.isActive });
      throw new UnauthorizedException('User not found or inactive');
    }

    console.log('✅ JWT Strategy - User validated successfully');
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      deviceId: payload.deviceId,
    };
  }
}
