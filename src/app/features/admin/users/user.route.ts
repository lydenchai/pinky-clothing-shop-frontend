import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/user-list/user-list').then((m) => m.UserList),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./routes/user-form/user-form').then((m) => m.UserForm),
  },
  {
    path: ':id/update',
    loadComponent: () =>
      import('./routes/user-form/user-form').then((m) => m.UserForm),
  },
];
