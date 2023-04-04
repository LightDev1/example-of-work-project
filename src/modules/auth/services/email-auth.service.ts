import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { EmailAuthDto } from '../dto/EmailAuthDto';
import { User } from 'src/modules/users/models/user.entity';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { EmailRegisterDto } from '../dto/EmailRegisterDto';

@Injectable()
export class EmailAuthService {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async authenticate(data: EmailAuthDto): Promise<AuthResponseDto> {
    const user = await this.usersService.getByEmail(data.email);
    if (user) {
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Неправильный логин или пароль');
      }
      return this.authService.login(user);
    } else {
      throw new BadRequestException('Пользователь с такой почтой не найден');
    }
  }

  public async register(data: EmailRegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt(+getConfigVariable('CRYPT_SALT'));
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return this.usersService.create({ ...data, password: hashedPassword });
  }
}
