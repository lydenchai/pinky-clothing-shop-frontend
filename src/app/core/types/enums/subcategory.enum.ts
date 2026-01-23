export const SubcategoryEnum = {
  dresses: 'dresses',
  jackets: 'jackets',
  jeans: 'jeans',
  shirts: 'shirts',
  shoes: 'shoes',
  shorts: 'shorts',
  sweaters: 'sweaters',
} as const;
export type SubcategoryEnum = (typeof SubcategoryEnum)[keyof typeof SubcategoryEnum];
