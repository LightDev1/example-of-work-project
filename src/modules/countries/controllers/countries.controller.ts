import { Controller } from '@nestjs/common';
import { CountriesService } from '../services/countries.service';
import { CountriesBaseController } from './countries.base-controller';

@Controller('country')
export class CountriesController extends CountriesBaseController {
  constructor(private readonly service: CountriesService) {
    super(service);
  }
}
