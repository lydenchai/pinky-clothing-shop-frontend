import { Address } from "./address";

export interface User {
  _id?: string;
  code?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "customer";
  phone?: string;
  address?: Address;
  created_at?: Date;
  avatar?: string;
}