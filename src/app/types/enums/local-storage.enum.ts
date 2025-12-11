export const LocalStorageEnum = {
  Token: '_t',
  RefreshToken: '_rt',
  UserId: '_uid',
  lang: 'lang',
  Cart: '_cart',
  AdminViewedOrders: 'admin_viewed_orders',
} as const;
export type LocalStorageEnum =
  (typeof LocalStorageEnum)[keyof typeof LocalStorageEnum];
