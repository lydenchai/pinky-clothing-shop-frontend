export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  minOrder?: number;
  maxOrder?: number;
  isActive: boolean;
}
