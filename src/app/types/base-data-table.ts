export interface BaseDataTable<T = any[]> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems?: number;
  totalPages?: number;
}
