import { Routes } from '@angular/router';

export const adminOrderRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/orders/orders').then((m) => m.OrdersAdmin),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./routes/order-detail/order-detail').then(
        (m) => m.AdminOrderDetail
      ),
  },
];
