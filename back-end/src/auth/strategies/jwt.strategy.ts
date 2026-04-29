import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { UsersService } from '../../users/users.service';
import { IUserPayload } from '@teddy/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IUserPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException();
    }
    
    try {
      const user = await this.usersService.findByUuid(payload.sub);
      if (!user.active) {
        throw new UnauthorizedException('Usuário inativo');
      }
      return user.toSafe();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
