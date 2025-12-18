export const MainCategoryEnum = {
  MEN: 'men',
  WOMEN: 'women',
  KIDS: 'kids',
} as const;
export type MainCategoryEnum =
  (typeof MainCategoryEnum)[keyof typeof MainCategoryEnum];
