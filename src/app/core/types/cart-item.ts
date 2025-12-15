export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productStock: number;
}
