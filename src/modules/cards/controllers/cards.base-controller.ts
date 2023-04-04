import { Card } from 'src/modules/cards/models/card.entity';
import { CardsModuleActions } from 'src/modules/cards/permissions/cards.actions';
import { getBaseController } from 'src/modules/shared/base-crud/factories/crud-controller.factory';
import { Permissions } from 'src/modules/permissions/decorators/permissions.decorator';

export const CardsBaseController = getBaseController<Card>(Card, {
  decorators: {
    createOne: [
      Permissions(CardsModuleActions.CAN_ALL, CardsModuleActions.CREATE),
    ],
    getOne: [Permissions(CardsModuleActions.CAN_ALL, CardsModuleActions.READ)],
    getMany: [Permissions(CardsModuleActions.CAN_ALL, CardsModuleActions.READ)],
    updateOne: [
      Permissions(CardsModuleActions.CAN_ALL, CardsModuleActions.UPDATE),
    ],
    deleteOne: [
      Permissions(CardsModuleActions.CAN_ALL, CardsModuleActions.DELETE),
    ],
  },
});
