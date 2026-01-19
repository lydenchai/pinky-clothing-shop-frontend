import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full', // redirect root to home
      },
      {
        path: 'home',
        loadComponent: () =>
          import('../../features/customer/home/home').then((m) => m.Home),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../../features/customer/products/products').then(
            (m) => m.Products,
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('../../features/customer/product-detail/product-detail').then(
            (m) => m.ProductDetail,
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../../features/customer/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../../features/customer/profile/profile').then(
            (m) => m.Profile,
          ),
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../../features/customer/orders/components/order/orders').then(
                (m) => m.Orders,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../../features/customer/orders/components/order-detail/order-detail').then(
                (m) => m.OrderDetail,
              ),
          },
        ],
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('../../features/customer/checkout/checkout').then(
            (m) => m.Checkout,
          ),
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('../../features/customer/wishlist/wishlist').then(
            (m) => m.Wishlist,
          ),
      },
    ],
  },
];
