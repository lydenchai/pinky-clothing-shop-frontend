import { Routes } from '@angular/router';
import { adminGuard } from '../guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/admin-layout/admin-layout.component').then(
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
        path: 'products',
        loadComponent: () =>
          import(
            './routes/products/routes/product-list/product-list.component'
          ).then((m) => m.ProductListComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./routes/inventory/inventory.component').then(
            (m) => m.InventoryComponent
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import(
            './routes/products/routes/product-form/product-form.component'
          ).then((m) => m.ProductFormComponent),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import(
            './routes/products/routes/product-form/product-form.component'
          ).then((m) => m.ProductFormComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./routes/orders/orders.component').then(
            (m) => m.OrdersAdminComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./routes/users/users.component').then(
            (m) => m.UsersAdminComponent
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
