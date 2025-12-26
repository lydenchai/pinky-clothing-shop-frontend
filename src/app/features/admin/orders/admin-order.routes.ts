import { Routes } from '@angular/router';

export const adminOrderRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'order', plural: true },
    children: [
      {
        path: '',
        data: { breadcrumb: 'order', plural: true },
        loadComponent: () =>
          import('./routes/orders/orders').then((m) => m.OrdersAdmin),
      },
      {
        path: ':id',
        data: { breadcrumb: 'detail' },
        loadComponent: () =>
          import('./routes/order-detail/order-detail').then(
            (m) => m.AdminOrderDetail,
          ),
      },
    ],
  },
];
