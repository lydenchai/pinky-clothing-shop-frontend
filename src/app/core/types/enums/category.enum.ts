export const CategoryEnum = {
  MEN: "men",
  WOMEN: "women",
  KIDS: "kids",
} as const;
export type CategoryEnum = (typeof CategoryEnum)[keyof typeof CategoryEnum];
