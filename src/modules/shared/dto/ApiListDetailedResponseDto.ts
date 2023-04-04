import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SwaggerResponseOptions } from '../interfaces/SwaggerResponseOptions';
import { PaginatedMeta } from '../base-crud/interfaces/PaginatedMeta';

export const ApiListDetailedResponseDto = <TModel extends Type<any>>(
  model: TModel,
  swaggerResponseOptions?: SwaggerResponseOptions,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        ...swaggerResponseOptions,
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  total: { type: 'number' },
                  page_count: { type: 'number' },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
