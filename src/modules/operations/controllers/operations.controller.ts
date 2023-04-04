import { Controller } from '@nestjs/common';
import { OperationsService } from '../services/operations.service';
import { OperationsBaseController } from './operations.base-controller';

@Controller('operations')
export class OperationsController extends OperationsBaseController {
  constructor(private readonly service: OperationsService) {
    super(service);
  }
}
