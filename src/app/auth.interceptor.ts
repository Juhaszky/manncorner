import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';

const refreshTokenSubject = new BehaviorSubject<string | null>(null);
let isRefreshing = false;

export function refreshTokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);

  const newReq = req.clone({
    withCredentials: true,
  });

  return next(newReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              refreshTokenSubject.next('refreshed');
              const retryReq = req.clone({ withCredentials: true });
              return next(retryReq);
            }),
            catchError(error => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => error);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(() => {
              const retryReq = req.clone({ withCredentials: true });
              return next(retryReq);
            })
          );
        }
      }
      return throwError(() => err);
    })
  );
}
