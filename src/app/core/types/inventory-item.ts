export interface InventoryItem {
  _id: string;
  code?: string;
  product_id?: any;
  quantity: number;
  location?: string;
  created_at?: string;
  updated_at?: string;
  product?: any;
  product_name?: string;
}
