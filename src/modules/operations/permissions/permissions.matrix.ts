import { UserRole } from 'src/modules/users/enums/UserRole';
import { OperationsModuleActions } from './operations.actions';

export const OperationsModulePermissions = {
  [UserRole.ADMIN]: [],
  [UserRole.OWNER]: [
    OperationsModuleActions.CREATE,
    OperationsModuleActions.READ,
  ],
  [UserRole.OPERATOR]: [OperationsModuleActions.CREATE],
};
