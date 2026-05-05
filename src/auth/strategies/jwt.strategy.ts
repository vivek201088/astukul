import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub?: number | string; // User ID
  email: string;
  name: string;
  iat?: number | string;
  exp?: number | string;
  role?: number | string;
  schoolId?: number | string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.authentication ||
          request?.headers?.authentication,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }


  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      userId: payload.sub,
      role: payload.role,
      schoolId: payload.schoolId
    };
  }
}
