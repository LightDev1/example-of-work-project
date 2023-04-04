import { BonusLevelsModulePermissions } from '../bonus-levels/permissions/permissions.matrix';
import { CardsModulePermissions } from '../cards/permissions/permissions.matrix';
import { ClientCardsModulePermissions } from '../client-cards/permissions/permissions.matrix';
import { OperationsModulePermissions } from '../operations/permissions/permissions.matrix';
import { UserRole } from '../users/enums/UserRole';
import { UsersModulePermissions } from '../users/permissions/permissions.matrix';

export const PermissionsMatrix = {
  [UserRole.ADMIN]: [
    UsersModulePermissions.admin,
    ClientCardsModulePermissions.admin,
    CardsModulePermissions.admin,
    BonusLevelsModulePermissions.admin,
    OperationsModulePermissions.admin,
  ],
  [UserRole.OWNER]: [
    UsersModulePermissions.owner,
    ClientCardsModulePermissions.owner,
    CardsModulePermissions.owner,
    BonusLevelsModulePermissions.owner,
    OperationsModulePermissions.owner,
  ],
  [UserRole.OPERATOR]: [
    UsersModulePermissions.operator,
    ClientCardsModulePermissions.operator,
    CardsModulePermissions.operator,
    BonusLevelsModulePermissions.operator,
    OperationsModulePermissions.operator,
  ],
};
