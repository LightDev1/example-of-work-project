import { getBaseController } from 'src/modules/shared/base-crud/factories/crud-controller.factory';
import { BonusLevel } from '../models/bonus-level.entity';
import { Permissions } from 'src/modules/permissions/decorators/permissions.decorator';
import { BonusLevelsModuleActions } from '../permissions/bonus-levels.actions';

export const BonusLevelsBaseController = getBaseController<BonusLevel>(
  BonusLevel,
  {
    decorators: {
      createOne: [
        Permissions(
          BonusLevelsModuleActions.CAN_ALL,
          BonusLevelsModuleActions.CREATE,
        ),
      ],
      getOne: [
        Permissions(
          BonusLevelsModuleActions.CAN_ALL,
          BonusLevelsModuleActions.READ,
        ),
      ],
      getMany: [
        Permissions(
          BonusLevelsModuleActions.CAN_ALL,
          BonusLevelsModuleActions.READ,
        ),
      ],
      updateOne: [
        Permissions(
          BonusLevelsModuleActions.CAN_ALL,
          BonusLevelsModuleActions.UPDATE,
        ),
      ],
      deleteOne: [
        Permissions(
          BonusLevelsModuleActions.CAN_ALL,
          BonusLevelsModuleActions.DELETE,
        ),
      ],
    },
  },
);
