import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Storefront (Customer-side)
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },

  // Admin-side (Management Dashboard)
  {
    path: 'admin',
    loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./admin/products/product-list/product-list.component').then(m => m.ProductListComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products/new',
    loadComponent: () => import('./admin/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products/:id/edit',
    loadComponent: () => import('./admin/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [adminGuard],
  },
  // Add more admin routes as needed

  // Fallback
  {
    path: '**',
    redirectTo: '',
  },
];
