import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { PermissionsMatrix } from '../permissions.matrix';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async hasUserPermissions(
    userId: number,
    permissions: string,
  ): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return this.hasPermissions(role, permissions);
  }

  public async getUserRole(id: number): Promise<string> {
    const candidate = await this.usersService.getOne(id);

    if (candidate) {
      return candidate.role;
    }
    throw new BadRequestException('User was not found');
  }

  private hasPermissions(role: string, ...permissions: string[]): boolean {
    const userPermissions = PermissionsMatrix[role].join(',');
    if (permissions !== undefined && permissions.length > 0) {
      return permissions.some((permission) =>
        userPermissions.match(new RegExp(permission, 'i')),
      );
    }
  }
}
