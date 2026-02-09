export interface InventoryLogItem {
  _id: string;
  inventory_id: string;
  action: "stock_in" | "stock_out" | "adjustment";
  amount: number;
  previous_quantity: number;
  new_quantity: number;
  note?: string;
  created_at: string;
}
