import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RouteExclusionGuard {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isExcluded = this.reflector.get<boolean>(
      'isExcluded',
      context.getHandler(),
    );
    if (!isExcluded) {
      return true;
    }
    return false;
  }
}
