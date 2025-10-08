import { inject, Injectable } from '@angular/core';
import { UserData } from './models/userdata.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  currentUsername = '';
  currentUserId = '';
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
  getUserId(): string {
    return this.currentUserId;
  }
  setUserId(userId: string) {
    this.currentUserId = userId;
  }
  setUserData(data: UserData) {
    this.userDataSubject.next(data);
  }
}
