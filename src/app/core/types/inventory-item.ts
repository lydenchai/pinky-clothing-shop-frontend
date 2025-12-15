export interface InventoryItem {
  id: number;
  productId: number;
  quantity: number;
  location?: string;
  updatedAt?: string;
  product?: any;
}
