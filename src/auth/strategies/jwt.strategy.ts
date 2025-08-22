import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret || 'secretKey',
    });
  }

  async validate(payload: unknown) {
    if (!payload || typeof payload !== 'object') {
      throw new UnauthorizedException();
    }

    const { sub, username } = payload as JwtPayload;

    if (!sub || !username) {
      throw new UnauthorizedException();
    }

    return { userId: sub, username };
  }
}
