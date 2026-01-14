export const LocalStorageEnum = {
  Token: '_t',
  RefreshToken: '_rt',
  user_id: '_uid',
  lang: 'lang',
  Cart: '_cart',
  AdminViewedOrders: 'admin_viewed_orders',
  menuExtended: 'menu_extended',
} as const;
export type LocalStorageEnum =
  (typeof LocalStorageEnum)[keyof typeof LocalStorageEnum];
