import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDataComponent } from './user-data/user-data.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule, UserDataComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = true;
  userData: Subject<any> = new Subject();
  userInfo!: any;
  ngOnInit(): void {
    this.userData.subscribe((data) => {
      console.log(data);
      this.userInfo = data
    });
  }
}
