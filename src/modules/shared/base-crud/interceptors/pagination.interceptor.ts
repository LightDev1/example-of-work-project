import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Paginated } from 'nestjs-paginate';
import { Observable, map } from 'rxjs';
import { ListDetailedResponseDto } from '../../dto/ListDetailedResponseDto';

@Injectable()
export class PaginationInterceptor<T>
  implements NestInterceptor<T, ListDetailedResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ListDetailedResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const { limit } = request.query;
    return next.handle().pipe(
      map((response: Paginated<T>) => {
        const { data, meta } = response;
        const preparedMeta = {
          page: meta.currentPage,
          limit: Number(limit),
          total: meta.totalItems,
          page_count: meta.totalPages,
        };
        return {
          data,
          meta: preparedMeta,
        };
      }),
    );
  }
}
