import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { decode } from 'jsonwebtoken';

@Injectable()
export class TokensService {
  constructor(private readonly jwt: JwtService) {}

  public getToken(
    userId: string,
    secret: string,
    expiresIn: string | number,
  ): string {
    return this.jwt.sign(
      { userId },
      {
        secret,
        expiresIn: `${expiresIn}ms`,
      },
    );
  }

  public getTokens(userId: string): { token: string; refreshToken: string } {
    const token = this.getToken(
      userId,
      getConfigVariable('JWT_SECRET'),
      getConfigVariable('TOKEN_EXPIRES_IN'),
    );
    const refreshToken = this.getToken(
      userId,
      getConfigVariable('JWT_REFRESH_SECRET'),
      getConfigVariable('REFRESH_TOKEN_EXPIRES_IN'),
    );
    return { token, refreshToken };
  }

  public verifyToken(incoming: string, userToken: string): Promise<boolean> {
    return this.compareCredentials(incoming, userToken);
  }

  public compareCredentials(incoming: string, real: string): Promise<boolean> {
    return compare(incoming, real);
  }

  public makeHash(value: string): Promise<string> {
    return hash(value, +getConfigVariable('CRYPT_SALT'));
  }

  public decode(token: string): string | any {
    return decode(token);
  }
}
