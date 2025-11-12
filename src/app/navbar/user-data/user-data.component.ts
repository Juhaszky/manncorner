import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { UserData } from '../../../shared/models/userdata.model';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../shared/user-data.service';
import { AuthService } from '../../auth.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
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

  fetchUserSummary(steamId: string): Observable<Response> {
    return this.http
      .get<Response>(
        `${environment.API_URL}/api/steam/profile/${steamId}`
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
    this.fetchUserSummary(this.userDataService.getUserId())
      .pipe(map((info: Response) => info.response.players[0]))
      .subscribe(data => {
        this.userDataService.setUsername(data.personaname);
        this.userDataService.setUserId(data.steamid);
        this.userDataService.setUserData(data);
      });
  }
}
