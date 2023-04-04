import { registerAs } from '@nestjs/config';
import { getTypeOrmConfig } from '../database/config';

export const databaseConfig = registerAs('database', () => getTypeOrmConfig());

const configs = [databaseConfig];
export default configs;
