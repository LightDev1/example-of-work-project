import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { UserRole } from 'src/modules/users/enums/UserRole';
import { PublicUser } from 'src/modules/users/interfaces/PublicUser';
import { User } from 'src/modules/users/models/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { RefreshTokenResponseDto } from '../dto/RefreshTokenResponseDto';
import { AppUnauthorizedException } from '../exceptions/UnauthorizedException';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  public async validateJwt(
    userId: number,
  ): Promise<
    | { user: PublicUser; Err: undefined }
    | { user: undefined; Err: typeof AppUnauthorizedException }
  > {
    const user = await this.usersService.getOne(userId);
    if (user) {
      return { user, Err: undefined };
    }
    return { user: undefined, Err: AppUnauthorizedException };
  }

  public generateTokenForUser(user: User): string {
    return this.jwtService.sign(
      { userId: user.id },
      {
        secret: getConfigVariable('JWT_SECRET'),
        expiresIn: `${getConfigVariable('TOKEN_EXPIRES_IN')}s`,
      },
    );
  }

  public async login(user: User): Promise<AuthResponseDto> {
    const { token, refreshToken } = this.tokensService.getTokens(user.id);
    const { hashed_refresh_token, password, ...updatedUser } =
      await this.updateUserRefreshToken(refreshToken, user);
    return {
      ...updatedUser,
      token,
      refresh_token: refreshToken,
    };
  }

  public async refreshToken(user: User): Promise<RefreshTokenResponseDto> {
    const { token, refreshToken } = this.tokensService.getTokens(user.id);
    await this.updateUserRefreshToken(refreshToken, user);
    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  public async getUserIdByToken(token: string): Promise<number | undefined> {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: getConfigVariable('JWT_SECRET'),
      });

      if (decoded) {
        return decoded.userId;
      }
    } catch (err) {
      return undefined;
    }
  }

  public async updateUserRefreshToken(
    refreshToken: string,
    user: User,
  ): Promise<User> {
    const hashedRefreshToken = await this.tokensService.makeHash(refreshToken);
    return this.usersService.updateUserToken<User>({
      ...user,
      hashed_refresh_token: hashedRefreshToken,
    });
  }

  public async registerUser(
    email: string,
    role: UserRole,
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.create({
      email,
      role,
    });
    return this.login(user);
  }
}
