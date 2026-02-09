import { PaginationType } from "./pagination-type";

export interface Product {
  _id?: string;
  code?: string;
  name: string;
  description: string;
  price: number;
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number | null;
  discount_start?: Date | null;
  discount_end?: Date | null;
  discounted_price?: number;
  category: string;
  subcategory?: string;
  image: string;
  stock: number;
  sizes?: any[];
  colors?: any[];
  created_at?: Date;
  updated_at?: Date;
}

export interface Product {
  _id?: string;
  code?: string;
  name: string;
  description: string;
  price: number;
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number | null;
  discount_start?: Date | null;
  discount_end?: Date | null;
  category: string;
  subcategory?: string;
  image: string;
  stock: number;
  sizes?: any[];
  colors?: any[];
  supplier?: string; // New: supplier name or id
  status?: "active" | "inactive"; // New: product status
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductsResponse {
  data: Product[];
  pagination: PaginationType;
}

export interface CheckoutForm {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  payment_method: "credit-card" | "paypal" | "cash-on-delivery";
  card_number: string;
  card_expiry: string;
  card_cvc: string;
}
