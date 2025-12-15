import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/admin-layout/admin-layout').then(
        (m) => m.AdminLayout
      ),
    canActivateChild: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./routes/users/user.route').then((m) => m.userRoutes),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./routes/products/product.route').then(
            (m) => m.productRoutes
          ),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./routes/inventory/inventory.route').then(
            (m) => m.inventoryRoutes
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./routes/orders/admin-order.routes').then(
            (m) => m.adminOrderRoutes
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./routes/analytic/analytic').then((m) => m.Analytic),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./routes/settings/admin-setting.routes').then(
            (m) => m.adminSettingRoutes
          ),
      },
      // Fallback for admin subpaths
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
