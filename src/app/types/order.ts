import { OrderStatus } from './enums/order-status.enum';
import { OrderItem } from './order-item';

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: Date;
  items?: OrderItem[];
  total: number;
}
