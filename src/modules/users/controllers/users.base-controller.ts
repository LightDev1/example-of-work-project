import { getBaseController } from 'src/modules/shared/base-crud/factories/crud-controller.factory';
import { User } from '../models/user.entity';
import { Permissions } from 'src/modules/permissions/decorators/permissions.decorator';
import { UsersModuleActions } from '../permissions/users.actions';

export const UsersBaseController = getBaseController<User>(User, {
  decorators: {
    createOne: [
      Permissions(UsersModuleActions.CAN_ALL, UsersModuleActions.CREATE),
    ],
    getOne: [
      Permissions(
        UsersModuleActions.CAN_ALL,
        UsersModuleActions.READ,
        UsersModuleActions.READ_OPERATOR,
        UsersModuleActions.CAN_ALL_OPERATOR,
      ),
    ],
    getMany: [
      Permissions(
        UsersModuleActions.CAN_ALL,
        UsersModuleActions.READ,
        UsersModuleActions.READ_OPERATOR,
        UsersModuleActions.CAN_ALL_OPERATOR,
      ),
    ],
    updateOne: [
      Permissions(
        UsersModuleActions.CAN_ALL,
        UsersModuleActions.UPDATE,
        UsersModuleActions.UPDATE_OPERATOR,
        UsersModuleActions.CAN_ALL_OPERATOR,
      ),
    ],
    deleteOne: [
      Permissions(
        UsersModuleActions.CAN_ALL,
        UsersModuleActions.DELETE,
        UsersModuleActions.DELETE_OPERATOR,
        UsersModuleActions.CAN_ALL_OPERATOR,
      ),
    ],
  },
});
