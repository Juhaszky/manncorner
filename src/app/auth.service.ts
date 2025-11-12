import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { UserDataService } from '../shared/user-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  userDataService = inject(UserDataService);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private accessToken: string | null = null;

  checkAuth() {
    this.http
      .get<{
        isAuthenticated: boolean;
        userId: string
      }>(`${environment.API_URL}/Auth/status`, { withCredentials: true })
      .subscribe({
        next: res => {
          if (this.userDataService.getUserId() == "") this.userDataService.setUserId(res.userId);
          this.isAuthenticatedSubject.next(res.isAuthenticated);
        },
        error: () => {
          this.isAuthenticatedSubject.next(false);
        },
      });
  }

  refreshToken() {
    return this.http.post(`${environment.API_URL}/Auth/refresh`, {}, { withCredentials: true });
  }

  logout() {
    return this.http
      .get(`${environment.API_URL}/Auth/logout`, { withCredentials: true })
      .pipe(tap(() => this.isAuthenticatedSubject.next(false)));
  }
}
