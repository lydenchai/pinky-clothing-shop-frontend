export const LocalStorageEnum = {
  Token: '_t',
  RefreshToken: '_rt',
  UserId: '_uid',
  lang: 'lang',
  Cart: '_cart',
} as const;
export type LocalStorageEnum =
  (typeof LocalStorageEnum)[keyof typeof LocalStorageEnum];
