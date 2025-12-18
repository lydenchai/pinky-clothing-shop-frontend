export interface Inventory {
  _id?: string;
  name: string;
  quantity: number;
  location: string;
  supplier?: string;
  created_at?: Date;
}
