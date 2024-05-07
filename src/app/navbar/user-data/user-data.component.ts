import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { UserData } from '../../../shared/models/userdata.model';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from '../../../shared/user-data.service';
export interface Response {
  response: Players;
}
export interface Players {
  players: UserData[];
}
@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [HttpClientModule, MatMenuModule, CommonModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit {
  http = inject(HttpClient);
  userDataService = inject(UserDataService);
  dialog = inject(MatDialog);

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  userData!: UserData;
  menus = ['tradeUrl', 'contact'];

  ngOnInit(): void {
    this.userDataService.userData$.subscribe((userData) => {
      if (userData) {
        this.userData = userData;
      } else {
        this.fetchUserData();
      }
    });
  }
  fetchUserSummary(): Observable<Response> {
    return this.http.get<Response>(
      'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=17F30AEE22C8E49C0F2CFD2BB6FE0398&steamids=76561198027857565'
    );
  }

  fetchUserData() {
    if (this.userData !== undefined) {
      return;
    }
    this.fetchUserSummary()
      .pipe(map((info: Response) => info.response.players[0]))
      .subscribe((data) => {
        this.userDataService.setUsername(data.personaname);
        this.userDataService.setUserData(data);
      });
  }
}
