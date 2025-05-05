import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuardGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const token = localStorage.getItem('jwt');
  const isAuthenticated = authService.checkAuth();
  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
