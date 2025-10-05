import { Component, Input, OnInit } from '@angular/core';
import { UserDataComponent } from '../user-data/user-data.component';
import { Router, RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  standalone: true,
  selector: 'app-mobile-nav',
  imports: [UserDataComponent, RouterModule, DrawerModule, CommonModule],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss',
})
export class MobileNavComponent implements OnInit {
  @Input() isDrawerOpen = false;
  isLoggedIn = true;

  constructor(
    private authService: AuthService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.authService.checkAuth();
    this.authService.isAuthenticated$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  handleLogout() {
    this.authService.logout().subscribe(() => {
      this.authService.checkAuth();
      this.route.navigate(['/home']);
      this.isDrawerOpen = false;
    });
  }
}
