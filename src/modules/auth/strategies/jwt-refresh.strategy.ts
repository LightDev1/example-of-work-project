import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/modules/users/models/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { TokensService } from '../services/tokens.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: { userId: number },
  ): Promise<User | undefined> {
    const refreshToken = request.body?.refresh_token;
    const user = await this.usersService.getOne(payload.userId);

    if (user) {
      const isValid = this.tokenService.verifyToken(
        refreshToken,
        user.hashed_refresh_token,
      );

      if (isValid) {
        return user;
      }
    }
  }
}
