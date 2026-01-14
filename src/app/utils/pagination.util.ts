import { PaginationType } from '../core/types/pagination-type';

export abstract class PaginationUtil {
  page: number = 1;
  limit: number = 15;
  total: number = 0;
  totalCount?: number = 0;
  abstract getList(event: PaginationType): void;
}
