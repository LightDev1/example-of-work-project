import { ConfigModule } from '@nestjs/config';
import configs from './index';

export const CoreConfigModule = ConfigModule.forRoot({
    isGlobal: true,
    load: configs,
});