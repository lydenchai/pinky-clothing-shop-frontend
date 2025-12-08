import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../components/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivateChild: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
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
        loadComponent: () =>
          import('./routes/orders/routes/orders/orders.component').then(
            (m) => m.OrdersAdminComponent
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./routes/analytic/analytic.component').then(
            (m) => m.AnalyticComponent
          ),
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
