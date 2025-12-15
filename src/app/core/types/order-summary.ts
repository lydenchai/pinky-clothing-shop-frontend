export interface OrderSummary {
  items: any[];
  subtotal: number;
  shipping: Shipping;
  tax: number;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
}

export interface Shipping {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
