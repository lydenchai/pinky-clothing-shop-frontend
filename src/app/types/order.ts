import { OrderItem } from './order-item';

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: Date;
  items?: OrderItem[];
}
