import { UserRole } from 'src/modules/users/enums/UserRole';
import { ClientCardsModuleActions } from './client-cards.actions';

export const ClientCardsModulePermissions = {
  [UserRole.ADMIN]: [ClientCardsModuleActions.CAN_ALL],
  [UserRole.OWNER]: [
    ClientCardsModuleActions.READ,
    ClientCardsModuleActions.CREATE,
  ],
  [UserRole.OPERATOR]: [ClientCardsModuleActions.READ],
};
