import { Module } from '@nestjs/common';
import { BaseCrudModule } from './base-crud/base-crud.module';

@Module({
  imports: [BaseCrudModule],
})
export class SharedModule {}
