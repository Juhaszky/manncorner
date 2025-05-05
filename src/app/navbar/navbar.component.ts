import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDataComponent } from './user-data/user-data.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    UserDataComponent,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Output() toggleDrawer = new EventEmitter<void>();
  isLoggedIn: boolean = true;
  userData: Subject<any> = new Subject();
  userInfo!: any;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isLoggedIn = status;
    })
    this.userData.subscribe((data) => {
      this.userInfo = data;
    });
  }
  handletoggleDrawer(): void {
    this.toggleDrawer.emit();
  }
  handleLogout() {
    this.authService.logout();
  }
}
