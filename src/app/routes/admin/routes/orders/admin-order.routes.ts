import { Routes } from '@angular/router';

export const adminOrderRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/orders/orders.component').then(
        (m) => m.OrdersAdminComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./routes/order-detail/order-detail.component').then(
        (m) => m.AdminOrderDetailComponent
      ),
  },
];
