import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsMatrix } from '../permissions.matrix';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userPermissions = PermissionsMatrix[user.role].join(',');
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (permissions?.length) {
      return permissions.some((permission) =>
        userPermissions.match(new RegExp(permission, 'i')),
      );
    }
    return true;
  }
}
