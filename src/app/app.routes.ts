import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

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
    canActivate: [adminGuard],
  },

  {
    path: 'login',
    loadComponent: () => import('./layouts/login/login').then((m) => m.Login),
  },

  // Fallback
  {
    path: '**',
    redirectTo: '',
  },
];
