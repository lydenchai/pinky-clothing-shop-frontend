export const SubcategoryEnum = {
  activewear: 'activewear',
  dresses: 'dresses',
  jackets: 'jackets',
  jeans: 'jeans',
  shirts: 'shirts',
  shoes: 'shoes',
  shorts: 'shorts',
  sweaters: 'sweaters',
  tshirts: 'T-shirts',
} as const;
export type SubcategoryEnum = (typeof SubcategoryEnum)[keyof typeof SubcategoryEnum];
