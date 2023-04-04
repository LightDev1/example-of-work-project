import { BaseCrudRoutes } from '../enums/BaseCrudRoutes';
import { BaseControllerOptionsDecoratorsDto } from './BaseControllerOptionsDecoratorsDto';
import { BaseControllerOptionsDtosDto } from './BaseControllerOptionsDtosDto';
import { BaseControllerSwaggerDto } from './BaseControllerSwaggerDto';

export interface BaseControllerOptionsDto {
  dtos?: BaseControllerOptionsDtosDto;
  decorators?: BaseControllerOptionsDecoratorsDto;
  swagger?: BaseControllerSwaggerDto;
  exclude?: BaseCrudRoutes[];
  apiTags?: string;
}
