export interface BaseDataTable<T = any[]> {
  order: number;
  data: T[];
  total: number;
  totalCount?: number;
}
