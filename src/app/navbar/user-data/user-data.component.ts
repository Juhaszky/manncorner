import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { UserData } from '../../../shared/models/userdata.model';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TradeUrlComponent } from '../trade-url/trade-url.component';

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
  constructor(private http: HttpClient, public dialog: MatDialog) {}
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  userData!: UserData;
  menus = ['tradeUrl', 'contact'];

  ngOnInit(): void {
    this.fetchUserData();
  }
  fetchUserSummary(): Observable<Response> {
    return this.http.get<Response>(
      'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=17F30AEE22C8E49C0F2CFD2BB6FE0398&steamids=76561198027857565'
    );
  }
  fetchUserData() {
    this.fetchUserSummary()
      .pipe(map((info: Response) => info.response.players[0]))
      .subscribe((data) => {
        this.userData = data;
      });
  }
  openTradeUrlDialog() {
    const dialogRef = this.dialog.open(TradeUrlComponent, {
      height: '25vh',
      width: '50vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
