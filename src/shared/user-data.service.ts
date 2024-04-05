import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  currentUsername: string = '';
  constructor() {}
  getUsername(): string {
    return this.currentUsername;
  }
  setUsername(username: string) {
    this.currentUsername = username;
  }
}
