import { Product } from "./product.model";

export interface CartItem {
  _id?: string;
  code?: string;
  user_id?: string;
  quantity: number;
  product: Product;
  size?: string;
  color?: string;
  created_at?: Date;
  updated_at?: Date;
}
