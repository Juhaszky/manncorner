import { Injectable } from '@angular/core';
import { UserData } from './models/userdata.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  currentUsername: string = '';
  private userDataSubject: BehaviorSubject<UserData | null> =
    new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();
  constructor() {}
  getUsername(): string {
    return this.currentUsername;
  }
  setUsername(username: string) {
    this.currentUsername = username;
  }
  setUserData(data: UserData) {
    this.userDataSubject.next(data);
  }
}
