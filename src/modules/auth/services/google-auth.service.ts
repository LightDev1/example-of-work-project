import { BadRequestException, Injectable } from '@nestjs/common';
import { Auth, google, oauth2_v2 } from 'googleapis';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { UserRole } from 'src/modules/users/enums/UserRole';
import { UsersService } from 'src/modules/users/services/users.service';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { GoogleUserData } from '../interfaces/GoogleUserData';
import { AuthService } from './auth.service';
import { TokensService } from './tokens.service';

@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly tokenService: TokensService,
  ) {
    const clientID = getConfigVariable('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = getConfigVariable('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  public async authenticate(token: string): Promise<AuthResponseDto> {
    const tokenInfo = await this.tokenService.decode(token);
    const email = tokenInfo.email;
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      return this.authService.registerUser(email, UserRole.OWNER);
    }
    return this.authService.login(user);
  }

  public async getUserData(token: string): Promise<GoogleUserData> {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }
}
