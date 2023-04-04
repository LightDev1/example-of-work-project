import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface SwaggerResponseOptions {
  summary?: string;
  schema?: SchemaObject & Partial<ReferenceObject>;
}
