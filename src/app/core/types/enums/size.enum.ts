export const SizeEnum = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
} as const;
export type SizeEnum = (typeof SizeEnum)[keyof typeof SizeEnum];
