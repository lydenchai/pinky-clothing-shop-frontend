export const LocalStorageEnum = {
  Token: '_t',
  RefreshToken: '_rt',
  UserId: '_uid',
  lang: 'lang',
} as const;
export type LocalStorageEnum =
  (typeof LocalStorageEnum)[keyof typeof LocalStorageEnum];
