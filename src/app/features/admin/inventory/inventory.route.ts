import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'inventory', plural: true },
    children: [
      {
        path: '',
        data: { breadcrumb: 'inventory', plural: true },
        loadComponent: () =>
          import('./routes/inventory-list/inventory-list').then(
            (m) => m.InventoryList,
          ),
      },
      {
        path: 'create',
        data: { breadcrumb: 'create' },
        loadComponent: () =>
          import('./routes/inventory-form/inventory-form').then(
            (m) => m.InventoryForm,
          ),
      },
      {
        path: ':id/update',
        data: { breadcrumb: 'update' },
        loadComponent: () =>
          import('./routes/inventory-form/inventory-form').then(
            (m) => m.InventoryForm,
          ),
      },
    ],
  },
];
