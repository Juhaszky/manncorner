import { Component, Input } from '@angular/core';
import { UserDataComponent } from '../user-data/user-data.component';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
    standalone: true,
    selector: 'app-mobile-nav',
    imports: [UserDataComponent, RouterModule, DrawerModule, CommonModule],
    templateUrl: './mobile-nav.component.html',
    styleUrl: './mobile-nav.component.scss'
})
export class MobileNavComponent {
    @Input() isDrawerOpen = false;
    isLoggedIn = true;
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
    }
    handleLogout() {
      this.authService.logout();
    }
}
