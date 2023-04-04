import { getBaseController } from 'src/modules/shared/base-crud/factories/crud-controller.factory';
import { Operation } from '../models/operation.entity';
import { Permissions } from 'src/modules/permissions/decorators/permissions.decorator';
import { OperationsModuleActions } from '../permissions/operations.actions';
import { BaseCrudRoutes } from 'src/modules/shared/base-crud/enums/BaseCrudRoutes';
import { CreateOperationDto } from '../dto/CreateOperationDto';

export const OperationsBaseController = getBaseController<Operation>(
  Operation,
  {
    dtos: {
      createOneDto: CreateOperationDto,
    },
    decorators: {
      createOne: [Permissions(OperationsModuleActions.CREATE)],
      getMany: [Permissions(OperationsModuleActions.READ)],
    },
    exclude: [
      BaseCrudRoutes.CREATE_MANY,
      BaseCrudRoutes.GET_ONE,
      BaseCrudRoutes.UPDATE_ONE,
      BaseCrudRoutes.DELETE_ONE,
    ],
  },
);
