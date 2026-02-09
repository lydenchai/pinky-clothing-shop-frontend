export const RoleEnum = {
  admin: 'admin',
  staff: 'staff',
  user: 'customer',
} as const;
export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
