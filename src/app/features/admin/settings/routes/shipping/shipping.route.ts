import { Routes } from '@angular/router';

export const shippingRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'shipping', plural: true },
    children: [
      {
        path: '',
        data: { breadcrumb: 'shipping', plural: true },
        loadComponent: () =>
          import('./routes/shipping/shipping').then((m) => m.Shipping),
      },
      {
        path: 'create',
        data: { breadcrumb: 'create' },
        loadComponent: () =>
          import('./routes/shipping-form/shipping-form').then(
            (m) => m.ShippingForm,
          ),
      },
      {
        path: ':id/update',
        data: { breadcrumb: 'update' },
        loadComponent: () =>
          import('./routes/shipping-form/shipping-form').then(
            (m) => m.ShippingForm,
          ),
      },
    ],
  },
];
