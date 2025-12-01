import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./routes/user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./routes/user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
  },
];
