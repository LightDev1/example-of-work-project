import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EmailAuthService } from './services/email-auth.service';
import { GoogleAuthService } from './services/google-auth.service';
import { TokensService } from './services/tokens.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, JwtModule.registerAsync({ useFactory: () => ({}) })],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleAuthService,
    TokensService,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    EmailAuthService,
  ],
  exports: [AuthService, EmailAuthService, GoogleAuthService],
})
export class AuthModule {}
