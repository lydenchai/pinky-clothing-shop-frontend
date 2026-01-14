export interface CartItemRequest {
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
}
