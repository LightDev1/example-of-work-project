import { getBaseController } from 'src/modules/shared/base-crud/factories/crud-controller.factory';
import { ClientCard } from '../models/client-card.entity';
import { Permissions } from 'src/modules/permissions/decorators/permissions.decorator';
import { ClientCardsModuleActions } from '../permissions/client-cards.actions';

export const ClientCardsBaseController = getBaseController<ClientCard>(
  ClientCard,
  {
    decorators: {
      createOne: [
        Permissions(
          ClientCardsModuleActions.CAN_ALL,
          ClientCardsModuleActions.CREATE,
        ),
      ],
      getOne: [
        Permissions(
          ClientCardsModuleActions.CAN_ALL,
          ClientCardsModuleActions.READ,
        ),
      ],
      getMany: [
        Permissions(
          ClientCardsModuleActions.CAN_ALL,
          ClientCardsModuleActions.READ,
        ),
      ],
      updateOne: [
        Permissions(
          ClientCardsModuleActions.CAN_ALL,
          ClientCardsModuleActions.UPDATE,
        ),
      ],
      deleteOne: [
        Permissions(
          ClientCardsModuleActions.CAN_ALL,
          ClientCardsModuleActions.DELETE,
        ),
      ],
    },
  },
);
