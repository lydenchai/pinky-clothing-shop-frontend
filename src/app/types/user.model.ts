export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt?: Date;
}
