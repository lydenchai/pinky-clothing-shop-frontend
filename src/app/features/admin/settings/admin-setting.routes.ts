import { Routes } from '@angular/router';

export const adminSettingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'payment',
        data: { breadcrumb: 'payment', plural: true },
        loadComponent: () =>
          import('./routes/payment/payment').then((c) => c.Payment),
      },
      {
        path: 'shipping',
        data: { breadcrumb: 'shipping', plural: true },
        loadChildren: () =>
          import('./routes/shipping/shipping.route').then(
            (c) => c.shippingRoutes,
          ),
      },
      {
        path: 'site-info',
        data: { breadcrumb: 'site_info' },
        loadComponent: () =>
          import('./routes/site-info/site-info').then((c) => c.SiteInfo),
      },
    ],
  },
];
