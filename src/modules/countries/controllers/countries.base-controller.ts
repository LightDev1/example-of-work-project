import { getBaseController } from 'src/modules/shared/base-crud/factories/crud-controller.factory';
import { Country } from '../models/country.entity';

export const CountriesBaseController = getBaseController<Country>(Country);
