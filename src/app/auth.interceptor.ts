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
import { MessageService } from 'primeng/api';
import { ErrorMessage } from '../shared/models/enums/error-message.enum';

const refreshTokenSubject = new BehaviorSubject<string | null>(null);
let isRefreshing = false;
let messageShown = false;
export function refreshTokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);

  const newReq = req.clone({
    withCredentials: true,
  });

  return next(newReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        if (!messageShown) {
          messageShown = true;
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: ErrorMessage.UNAUTHORIZED,
          });
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              messageShown = false;
              refreshTokenSubject.next('refreshed');
              const retryReq = req.clone({ withCredentials: true });
              return next(retryReq);
            }),
            catchError(error => {
              isRefreshing = false;
              messageShown = false;
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
