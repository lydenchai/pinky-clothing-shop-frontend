import { Address } from "./address";

export interface User {
  _id?: string;
  code?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "staff" | "customer";
  phone?: string;
  address?: Address;
  created_at?: Date;
  avatar?: string;
  is_active?: boolean;
  is_blocked?: boolean;
}