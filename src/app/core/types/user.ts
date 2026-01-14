export interface User {
  _id?: string;
  code?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at?: Date;
  avatar?: string;
}
