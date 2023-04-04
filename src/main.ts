import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { getConfigVariable } from './modules/core/configs/helpers';
import { Swagger } from './modules/core/swagger';
import { RouteExclusionGuard } from './modules/shared/base-crud/guards/route-exclusion.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  Swagger.init(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RouteExclusionGuard(reflector));

  const port = getConfigVariable('SERVER_APP_PORT') || 8080;
  await app.listen(port);
}
bootstrap();
