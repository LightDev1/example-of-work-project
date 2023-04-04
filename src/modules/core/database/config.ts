import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConfigVariable } from '../configs/helpers';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: getConfigVariable('DB_HOST'),
    port: parseInt(getConfigVariable('DB_PORT')),
    username: getConfigVariable('DB_USER'),
    password: getConfigVariable('DB_PASSWORD'),
    database: getConfigVariable('DB_NAME'),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsRun: getConfigVariable('RUN_MIGRATIONS') === 'true',
    migrations: ['./dist/migrations/*.js'],
    cli: {
      migrationsDir: './src/migrations',
    },
    autoLoadEntities: true,
  };
}
