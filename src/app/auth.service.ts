import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private accessToken: string | null = null;

  checkAuth() {
    this.http
      .get<{
        isAuthenticated: boolean;
      }>(`${environment.API_URL}/Auth/status`, { withCredentials: true })
      .subscribe({
        next: res => {
          this.isAuthenticatedSubject.next(res.isAuthenticated);
        },
        error: () => {
          this.isAuthenticatedSubject.next(false);
        },
      });
  }

  logout() {
    return this.http
      .get(`${environment.API_URL}/Auth/logout`, { withCredentials: true })
      .pipe(tap(() => this.isAuthenticatedSubject.next(false)));
  }
}
