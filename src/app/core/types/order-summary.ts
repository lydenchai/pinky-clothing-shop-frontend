export interface OrderSummary {
  code?: string;
  items: any[];
  subtotal: number;
  shipping: Shipping;
  tax: number;
  total: number;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
}

export interface Shipping {
  address: string;
  postal_code?: string;
  village?: string;
  commune?: string;
  district?: string;
  province?: string;
  city: string;
  country?: string;
}
