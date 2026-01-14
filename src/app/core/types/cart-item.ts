export interface CartItem {
  _id?: string;
  code?: string;
  user_id?: string;
  product_id?: string;
  quantity: number;
  size?: string;
  color?: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_stock: number;
}
