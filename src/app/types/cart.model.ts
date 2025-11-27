import { Product } from './product.model';

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

export interface CartItemRequest {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[] | null;
  totalItems: number | null;
  subtotal: any;
  shipping: number | null;
  tax: number | null;
  total: number | null;
}
