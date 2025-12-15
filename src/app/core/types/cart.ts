import { CartItem } from './cart-item';

export interface Cart {
  items: CartItem[] | null;
  totalItems: number | null;
  subtotal: any;
  shipping: number | null;
  tax: number | null;
  total: number | null;
}
