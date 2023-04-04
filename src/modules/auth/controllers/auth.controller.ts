import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/modules/users/models/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserDecorator } from '../decorators/user.decorator';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';
import { EmailAuthDto } from '../dto/EmailAuthDto';
import { RefreshTokenRequestDto } from '../dto/RefreshTokenRequestDto';
import { RefreshTokenResponseDto } from '../dto/RefreshTokenResponseDto';
import JwtRefreshGuard from '../guards/jwt-refresh.guard';
import JwtAuthenticationGuard from '../guards/jwt.guard';
import { AuthService } from '../services/auth.service';
import { EmailAuthService } from '../services/email-auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailAuthService: EmailAuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({ type: RefreshTokenResponseDto })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  public async refreshToken(
    @UserDecorator() user: User,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(user);
  }

  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @Get('validate-token')
  public async validateToken(@UserDecorator() user): Promise<User> {
    return user;
  }

  @ApiResponse({ type: AuthResponseDto })
  @ApiBody({ type: EmailAuthDto })
  @ApiOperation({ summary: 'Login by email' })
  @Post('login/email')
  public loginByEmail(@Body() data: EmailAuthDto): Promise<AuthResponseDto> {
    return this.emailAuthService.authenticate(data);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({ type: ChangePasswordDto })
  @ApiOperation({ summary: 'Change password' })
  @Patch('change-password/:userId')
  public changePassword(
    @Body() data: ChangePasswordDto,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.usersService.changePassword(userId, data.password);
  }
}
