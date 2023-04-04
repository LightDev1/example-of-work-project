import { UserRole } from 'src/modules/users/enums/UserRole';
import { BonusLevelsModuleActions } from './bonus-levels.actions';

export const BonusLevelsModulePermissions = {
  [UserRole.ADMIN]: [],
  [UserRole.OWNER]: [BonusLevelsModuleActions.CAN_ALL],
  [UserRole.OPERATOR]: [],
};
