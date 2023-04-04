import { Controller } from '@nestjs/common';
import { BonusLevelsService } from '../services/bonus-levels.service';
import { BonusLevelsBaseController } from './bonus-levels.base-controller';

@Controller('bonus-levels')
export class BonusLevelsController extends BonusLevelsBaseController {
  constructor(private readonly service: BonusLevelsService) {
    super(service);
  }
}
