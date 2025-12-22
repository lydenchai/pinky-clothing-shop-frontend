import { OrderStatus } from './enums/order-status.enum';
import { OrderItem } from './order-item';
import { User } from './user.model';

export interface Order {
  _id?: string;
  user_id?: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  created_at: Date;
  items?: OrderItem[];
  total: number;
  payment_method?: string;
  user?: User;
}
