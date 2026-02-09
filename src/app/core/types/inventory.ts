export interface Inventory {
  _id?: string;
  code?: string;
  name: string;
  quantity: number;
  location: string;
  supplier?: string;
  expiry_date?: Date | null;
  low_stock_threshold?: number;
  low_stock_alerted?: boolean;
  created_at?: Date;
}
