import { SwaggerResponseOptions } from '../../interfaces/SwaggerResponseOptions';

export interface BaseControllerSwaggerDto {
  createOne?: SwaggerResponseOptions;
  createMany?: SwaggerResponseOptions;
  getMany?: SwaggerResponseOptions;
  getOne?: SwaggerResponseOptions;
  updateOne?: SwaggerResponseOptions;
  deleteOne?: SwaggerResponseOptions;
}
