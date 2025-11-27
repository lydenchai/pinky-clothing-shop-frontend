import { Routes } from '@angular/router';

export const adminSettingRoutes: Routes = [
  {
    path: 'payment',
    loadComponent: () =>
      import('./routes/payment/payment.component').then(
        (c) => c.PaymentComponent
      ),
  },
  {
    path: 'shipping',
    loadComponent: () =>
      import('./routes/shipping/shipping.component').then(
        (c) => c.ShippingComponent
      ),
  },
  {
    path: 'site-info',
    loadComponent: () =>
      import('./routes/site-info/site-info.component').then(
        (c) => c.SiteInfoComponent
      ),
  },
];
