export const RoleEnum = {
  admin: 'admin',
  user: 'customer',
} as const;
export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
