import { Pagination } from '../types/pagination';

export abstract class PaginationComponentUtil {
  page: number = 1;
  limit: number = 15;
  total: number = 0;
  totalCount?: number = 0;
  abstract getList(event: Pagination): void;
}
