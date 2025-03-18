import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('5c72b14f6e4a8a3d9e3f0b7c1a8d92f9c4e3a7b9d2e3f1c8b4a6e7d5c2f0a9b'), // Get secret from environment variables
    });
  }

  // Validate the JWT and return the user info
  async validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
