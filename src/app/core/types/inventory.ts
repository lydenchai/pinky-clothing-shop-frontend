export interface Inventory {
  id: number;
  name: string;
  quantity: number;
  location: string;
  supplier?: string;
  createdAt?: Date;
}
