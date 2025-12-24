import { Routes } from '@angular/router';

export const adminSettingRoutes: Routes = [
  {
    path: 'payment',
    loadComponent: () =>
      import('./routes/payment/payment').then((c) => c.Payment),
  },
  {
    path: 'shipping',
    loadChildren: () =>
      import('./routes/shipping/shipping.route').then((c) => c.shippingRoutes),
  },
  {
    path: 'site-info',
    loadComponent: () =>
      import('./routes/site-info/site-info').then((c) => c.SiteInfo),
  },
];
