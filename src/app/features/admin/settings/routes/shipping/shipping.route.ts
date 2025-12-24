import { Routes } from '@angular/router';

export const shippingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/shipping/shipping').then((m) => m.Shipping),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./routes/shipping-form/shipping-form').then(
        (m) => m.ShippingForm
      ),
  },
  {
    path: ':id/update',
    loadComponent: () =>
      import('./routes/shipping-form/shipping-form').then(
        (m) => m.ShippingForm
      ),
  },
];
