export interface Product {
  _id?: string;
  code?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  sizes?: string; // Comma-separated string from backend
  colors?: string; // Comma-separated string from backend
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  data: Product[];
  pagination: PaginationInfo;
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
  payment_method: 'credit-card' | 'paypal' | 'cash-on-delivery';
  card_number: string;
  card_expiry: string;
  card_cvc: string;
}
