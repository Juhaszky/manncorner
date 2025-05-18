import { inject, Injectable } from '@angular/core';
import { UserData, UserDataResponse } from './models/userdata.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  currentUsername = '';
  private userDataSubject: BehaviorSubject<UserData | null> =
    new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();
  http = inject(HttpClient);
  getUsername(): string {
    return this.currentUsername;
  }
  setUsername(username: string) {
    this.currentUsername = username;
  }
  setUserData(data: UserData) {
    this.userDataSubject.next(data);
  }
  fetchUserSummary(): Observable<UserData> {
    return this.http
      .get<UserDataResponse>(
        'http://localhost:5268/api/steam/profile/76561198027857565'
      )
      .pipe(map(res => res.response.players[0]));
  }
}
