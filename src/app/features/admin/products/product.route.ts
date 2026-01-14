import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'product', plural: true },
    children: [
      {
        path: '',
        data: { breadcrumb: 'product' },
        loadComponent: () =>
          import('./routes/product-list/product-list').then(
            (m) => m.ProductList,
          ),
      },
      {
        path: 'create',
        data: { breadcrumb: 'create' },
        loadComponent: () =>
          import('./routes/product-form/product-form').then(
            (m) => m.ProductForm,
          ),
      },
      {
        path: ':id/update',
        data: { breadcrumb: 'update' },
        loadComponent: () =>
          import('./routes/product-form/product-form').then(
            (m) => m.ProductForm,
          ),
      },
    ],
  },
];
