import { PaginatedMeta } from '../base-crud/interfaces/PaginatedMeta';

export interface ListDetailedResponseDto<T extends {}> {
  data: T[];
  meta: PaginatedMeta;
}
