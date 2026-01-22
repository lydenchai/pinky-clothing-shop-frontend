import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./layouts/customer-layout/customer.routes").then(
        (m) => m.customerRoutes,
      ),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./layouts/auth/login/login").then((m) => m.Login),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./layouts/admin-layout/admin.routes").then((m) => m.adminRoutes),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./layouts/not-found/not-found").then((m) => m.NotFound),
  },
];
