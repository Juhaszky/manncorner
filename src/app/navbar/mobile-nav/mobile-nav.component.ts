import { Component, Input } from '@angular/core';
import { UserDataComponent } from '../user-data/user-data.component';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';

@Component({
    standalone: true,
    selector: 'app-mobile-nav',
    imports: [UserDataComponent, RouterModule, DrawerModule],
    templateUrl: './mobile-nav.component.html',
    styleUrl: './mobile-nav.component.scss'
})
export class MobileNavComponent {
    @Input() isDrawerOpen = false;
}
