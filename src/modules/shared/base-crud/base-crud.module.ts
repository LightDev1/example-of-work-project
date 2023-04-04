import { Module } from '@nestjs/common';
import { PaginationInterceptor } from './interceptors/pagination.interceptor';
import { BaseCrudService } from './services/base-crud.service';

@Module({
  providers: [BaseCrudService, PaginationInterceptor],
  exports: [BaseCrudService, PaginationInterceptor],
})
export class BaseCrudModule {}
