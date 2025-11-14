export interface BaseDatatable<T = any[]> {
  order: number;
  data: T[];
  total: number;
  totalCount?: number;
}
