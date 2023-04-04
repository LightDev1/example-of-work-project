import { INestApplication } from '@nestjs/common';
import { initSwagger } from './common';

export class Swagger {
  static init(app: INestApplication) {
    initSwagger(app);
  }
}
