export interface CartItemRequest {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}
