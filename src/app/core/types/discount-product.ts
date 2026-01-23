export interface DiscountProduct {
  product_ids: string[];
  discount: Discount;
}

export interface Discount {
  discount_type: string;
  discount_value: string;
  discount_start: string;
  discount_end: string;
}
