import { UserRole } from '../enums/UserRole';
import { User } from '../models/user.entity';

export const isUserOwner = (user: User): boolean =>
  user.role === UserRole.OWNER;
export const isUserOperator = (user: User): boolean =>
  user.role === UserRole.OPERATOR;
