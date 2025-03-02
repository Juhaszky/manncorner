import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MobileNavComponent } from './navbar/mobile-nav/mobile-nav.component';
import { DrawerModule } from 'primeng/drawer';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterModule,
        CommonModule,
        NavbarComponent,
        MobileNavComponent,
        DrawerModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Manncorner';
  isDrawerOpen = false; 
  constructor() {}
}
