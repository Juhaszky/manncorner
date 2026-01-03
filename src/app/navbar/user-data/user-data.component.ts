import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, catchError, map, take, tap, throwError } from 'rxjs';
import { UserData } from '../../../shared/models/userdata.model';

import { UserDataService } from '../../../shared/user-data.service';
import { AuthService } from '../../auth.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { NotificationService } from '../../notification.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from '../notification-list/notification-list.component';
import { PopoverModule } from 'primeng/popover';
export interface Response {
  response: Players;
}
export interface Players {
  players: UserData[];
}
@Component({
  standalone: true,
  selector: 'app-user-data',
  imports: [RouterModule, OverlayBadgeModule, CommonModule, NotificationListComponent, PopoverModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  userDataService = inject(UserDataService);
  notificationService = inject(NotificationService);

  userData!: UserData;
  menus = ['tradeUrl', 'contact'];
  showList = false;
  openListView() {
    this.showList = !this.showList;
  }
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
        this.notificationService.connect(data.steamid);
        this.notificationService.loadUnread();
        this.userDataService.setUserData(data);
      });
  }
}
