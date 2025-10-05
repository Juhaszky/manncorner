import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { first, map } from 'rxjs';

export const authGuardGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkAuth();

  return authService.isAuthenticated$.pipe(
    first(),
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
};
