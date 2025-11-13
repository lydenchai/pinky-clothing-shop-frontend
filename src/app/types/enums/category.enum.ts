export const CategoryEnum = {
  activewear: 'activewear',
  dresses: 'dresses',
  jackets: 'jackets',
  jeans: 'jeans',
  kids: 'kids',
  men: 'men',
  shirts: 'shirts',
  shoes: 'shoes',
  shorts: 'shorts',
  sweaters: 'sweaters',
  tshirts: 'T-shirts',
} as const;
export type CategoryEnum = (typeof CategoryEnum)[keyof typeof CategoryEnum];
