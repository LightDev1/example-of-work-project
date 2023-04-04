import { UserRole } from '../enums/UserRole';
import { UsersModuleActions } from './users.actions';

export const UsersModulePermissions = {
  [UserRole.ADMIN]: [UsersModuleActions.CAN_ALL],
  [UserRole.OWNER]: [
    UsersModuleActions.CAN_ALL_OPERATOR,
    UsersModuleActions.UPDATE_PROFILE,
    UsersModuleActions.READ,
  ],
  [UserRole.OPERATOR]: [UsersModuleActions.UPDATE_PROFILE],
};
