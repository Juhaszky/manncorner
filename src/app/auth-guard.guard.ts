import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { first, map, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastMessage } from '../shared/models/enums/error-message.enum';

export const authGuardGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);
  authService.checkAuth();

  return authService.isAuthenticated$.pipe(
    first(),
    tap(isAuth => {
      if (!isAuth) {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: ToastMessage.UNAUTHORIZED,
        });
      }
    }),
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
};
