import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { getConfigVariable } from '../configs/helpers';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: getConfigVariable('REDIS_HOST'),
        port: +getConfigVariable('REDIS_PORT'),
      },
    }),
  ],
})
export class QueuesModule {}
