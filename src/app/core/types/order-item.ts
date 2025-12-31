export interface OrderItem {
  _id?: string;
  code?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}
