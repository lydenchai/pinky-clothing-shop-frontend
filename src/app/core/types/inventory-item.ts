export interface InventoryItem {
  _id: string;
  code?: string;
  product_id?: any;
  quantity: number;
  location?: string;
  supplier?: string;
  expiry_date?: string | null;
  low_stock_threshold?: number;
  low_stock_alerted?: boolean;
  created_at?: string;
  updated_at?: string;
  product?: any;
  product_name?: string;
}
