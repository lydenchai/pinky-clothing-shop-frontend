import { Routes } from '@angular/router';
import { AdminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../layouts/admin-layout/admin-layout/admin-layout').then(
        (m) => m.AdminLayout
      ),
    canActivate: [AdminGuard],
    canLoad: [AdminGuard], // Prevent loading if not admin
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../features/admin/dashboard/dashboard').then(
            (m) => m.Dashboard
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../../features/admin/users/user.route').then(
            (m) => m.userRoutes
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../../features/admin/products/product.route').then(
            (m) => m.productRoutes
          ),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('../../features/admin/inventory/inventory.route').then(
            (m) => m.inventoryRoutes
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../../features/admin/orders/admin-order.routes').then(
            (m) => m.adminOrderRoutes
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('../../features/admin/analytic/analytic').then(
            (m) => m.Analytic
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../../features/admin/settings/admin-setting.routes').then(
            (m) => m.adminSettingRoutes
          ),
      },
    ],
  },
];
