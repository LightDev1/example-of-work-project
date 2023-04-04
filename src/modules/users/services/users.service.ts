import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/modules/shared/base-crud/services/base-crud.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserRole } from '../enums/UserRole';
import { User } from '../models/user.entity';
import { UserStatus } from '../enums/UserStatus';
import { PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';
import { EmailAuthService } from 'src/modules/auth/services/email-auth.service';
import { EmailRegisterDto } from 'src/modules/auth/dto/EmailRegisterDto';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    private readonly emailAuthService: EmailAuthService,
  ) {
    super(repository);
  }

  public getByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }

  public async updateUserToken<T>(data: T): Promise<T> {
    return await this.repository.save(data);
  }

  public createOperator(data: EmailRegisterDto, user: User): Promise<User> {
    return this.emailAuthService.register({
      ...data,
      role: UserRole.OPERATOR,
      owner: user,
    });
  }

  public async blockUser(id: string): Promise<User> {
    return super.update(id, { status: UserStatus.DISABLED });
  }

  public async unblockUser(id: string): Promise<User> {
    return super.update(id, { status: UserStatus.ACTIVE });
  }

  public getUsers(query: PaginateQuery, user?: User): Promise<Paginated<User>> {
    const userQb = this.buildUserQB(user);
    return super.getMany(query, userQb, {
      relations: ['country'],
      sortableColumns: ['id'],
      filterableColumns: {
        'country.id': [FilterOperator.EQ],
        role: [FilterOperator.EQ],
      },
      maxLimit: 50,
    });
  }

  public getOne(id: string | number): Promise<User> {
    return super.getOne(id, { relations: ['country'] });
  }

  private buildUserQB(user?: User): SelectQueryBuilder<User> {
    const userQb = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.country', 'country')
      .leftJoinAndSelect('user.owner', 'owner');

    if (user && user.role === UserRole.OWNER) {
      userQb.andWhere('owner.id = :ownerId', { ownerId: user.id });
    }

    if (user && user.role === UserRole.ADMIN) {
      userQb.andWhere('user.role = :userRole', { userRole: UserRole.OWNER });
    }
    return userQb;
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.getOne(id);

    if (!user.is_fulfilled) {
      data.is_fulfilled = true;
    }

    return super.update(id, data);
  }

  public async changePassword(userId: string, password: string): Promise<void> {
    const salt = await bcrypt.genSalt(+getConfigVariable('CRYPT_SALT'));
    const newHashedPassword = await bcrypt.hash(password, salt);
    await super.update(userId, { password: newHashedPassword });
  }
}
