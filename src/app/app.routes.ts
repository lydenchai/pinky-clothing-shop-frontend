import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./routes/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./routes/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./routes/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./routes/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./routes/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./routes/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./routes/login/login.component').then((m) => m.LoginComponent),
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
