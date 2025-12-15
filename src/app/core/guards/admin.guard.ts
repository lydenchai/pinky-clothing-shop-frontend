import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use userSubject.value for synchronous check
  const user = authService.userSubject.value;
  if (user) {
    if (user.role === 'admin') {
      return true;
    } else {
      // If logged in as customer, redirect to home
      router.navigate(['/']);
      return false;
    }
  }

  // If there is a token stored, attempt to load profile and decide
  const token = authService.getToken();
  if (!token) {
    // No token — redirect to login (or home) and block
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Token exists but user not yet loaded — wait for profile request
  return authService.getProfile().pipe(
    map((u) => {
      if (u && u.role === 'admin') return true;
      // Not admin — navigate away
      router.navigate(['/']);
      return false;
    }),
    catchError((err) => {
      // On error (invalid token, network), redirect to login/home and block
      try {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      } catch (e) {}
      return of(false as boolean | UrlTree);
    })
  );
};
