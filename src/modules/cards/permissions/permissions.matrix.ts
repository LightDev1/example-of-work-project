import { UserRole } from 'src/modules/users/enums/UserRole';
import { CardsModuleActions } from './cards.actions';

export const CardsModulePermissions = {
  [UserRole.ADMIN]: [CardsModuleActions.CAN_ALL],
  [UserRole.OWNER]: [CardsModuleActions.CAN_ALL],
  [UserRole.OPERATOR]: [],
};
