import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./routes/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./routes/products/products').then((m) => m.Products),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./routes/product-detail/product-detail').then(
        (m) => m.ProductDetail
      ),
  },
  {
    path: 'cart',
    loadComponent: () => import('./routes/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./routes/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'orders',
    loadComponent: () => import('./routes/orders/orders').then((m) => m.Orders),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./routes/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'login',
    loadComponent: () => import('./routes/login/login').then((m) => m.Login),
  },

  // Admin-side (Management Dashboard) using AdminLayout with nested child routes
  {
    path: 'admin',
    loadChildren: () =>
      import('./routes/admin/admin.routes').then((m) => m.adminRoutes),
    canActivate: [adminGuard],
  },

  // Fallback
  {
    path: '**',
    redirectTo: '',
  },
];
