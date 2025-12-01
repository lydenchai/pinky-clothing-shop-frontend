import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./routes/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./routes/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
];
