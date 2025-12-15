import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./routes/product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./routes/product-form/product-form').then((m) => m.ProductForm),
  },
];
