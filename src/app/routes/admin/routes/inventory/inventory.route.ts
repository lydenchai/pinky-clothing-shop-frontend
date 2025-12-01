import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/inventory-list/inventory-list.component').then(
        (m) => m.InventoryListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./routes/inventory-form/inventory-form.component').then(
        (m) => m.InventoryFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./routes/inventory-form/inventory-form.component').then(
        (m) => m.InventoryFormComponent
      ),
  },
];
