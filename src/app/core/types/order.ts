
import { OrderItem } from "./order-item";
import { User } from "./user";
import { Address } from "./address";
import { OrderStatusEnum } from "./enums/order-status.enum";

export interface Order {
  _id?: string;
  code?: string;
  user_id?: string;
  total_amount: number;
  status: OrderStatusEnum;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  created_at: Date;
  items?: OrderItem[];
  total: number;
  payment_method?: string;
  user?: User;
  address?: Address;
}
