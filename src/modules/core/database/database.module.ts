import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const CoreDatabaseModule = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) =>
    configService.get<TypeOrmModuleOptions>('database')!,
  inject: [ConfigService],
});
