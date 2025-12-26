import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'user', plural: true },
    children: [
      {
        path: '',
        data: { breadcrumb: 'user', plural: true },
        loadComponent: () =>
          import('./routes/user-list/user-list').then((m) => m.UserList),
      },
      {
        path: 'create',
        data: { breadcrumb: 'create' },
        loadComponent: () =>
          import('./routes/user-form/user-form').then((m) => m.UserForm),
      },
      {
        path: ':id/update',
        data: { breadcrumb: 'update' },
        loadComponent: () =>
          import('./routes/user-form/user-form').then((m) => m.UserForm),
      },
    ],
  },
];
