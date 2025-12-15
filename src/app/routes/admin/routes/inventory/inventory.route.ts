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
    path: 'new',
    loadComponent: () =>
      import('./routes/inventory-form/inventory-form').then(
        (m) => m.InventoryForm
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./routes/inventory-form/inventory-form').then(
        (m) => m.InventoryForm
      ),
  },
];
