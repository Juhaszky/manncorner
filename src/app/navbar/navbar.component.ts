import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDataComponent } from './user-data/user-data.component';
import { RouterModule } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    UserDataComponent,
    RouterModule,
    MatSidenavModule,
    MatIcon,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = true;
  userData: Subject<any> = new Subject();
  userInfo!: any;
  @Input() drawer!: MatDrawer;

  ngOnInit(): void {
    this.userData.subscribe((data) => {
      console.log(data);
      this.userInfo = data;
    });
  }
}
