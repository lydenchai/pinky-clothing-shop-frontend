export const CategoryEnum = {
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
export type CategoryEnum = (typeof CategoryEnum)[keyof typeof CategoryEnum];
