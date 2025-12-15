import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./layouts/customer-layout/customer.routes').then(
        (m) => m.customerRoutes
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./layouts/admin-layout/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
