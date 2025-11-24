import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./routes/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./routes/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
];
