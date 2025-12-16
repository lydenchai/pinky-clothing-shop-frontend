import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/inventory-list/inventory-list').then(
        (m) => m.InventoryList
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./routes/inventory-form/inventory-form').then(
        (m) => m.InventoryForm
      ),
  },
  {
    path: ':id/update',
    loadComponent: () =>
      import('./routes/inventory-form/inventory-form').then(
        (m) => m.InventoryForm
      ),
  },
];
