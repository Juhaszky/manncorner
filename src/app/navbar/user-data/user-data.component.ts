import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, catchError, filter, map, tap, throwError } from 'rxjs';
import { UserData } from '../../../shared/models/userdata.model';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../shared/user-data.service';
import { AuthService } from '../../auth.service';
import { RouterModule } from '@angular/router';
export interface Response {
  response: Players;
}
export interface Players {
  players: UserData[];
}
@Component({
  standalone: true,
  selector: 'app-user-data',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  userDataService = inject(UserDataService);

  userData!: UserData;
  menus = ['tradeUrl', 'contact'];

  ngOnInit(): void {
    this.userDataService.userData$
      .pipe(
        filter(() => this.authService.checkAuth()),
        tap(userData => {
          if (userData) {
            this.userData = userData;
          } else {
            this.fetchUserData();
          }
        })
      )
      .subscribe();
  }

  fetchUserSummary(): Observable<Response> {
    return this.http
      .get<Response>(
        'http://localhost:5268/api/steam/profile/76561198027857565'
      )
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  fetchUserData() {
    if (this.userData !== undefined) {
      return;
    }
    this.fetchUserSummary()
      .pipe(map((info: Response) => info.response.players[0]))
      .subscribe(data => {
        this.userDataService.setUsername(data.personaname);
        this.userDataService.setUserId(data.steamid);
        this.userDataService.setUserData(data);
      });
  }
}
