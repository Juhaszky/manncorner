import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MobileNavComponent } from './navbar/mobile-nav/mobile-nav.component';
import { DrawerModule } from 'primeng/drawer';
import { HttpClient } from '@angular/common/http';
import { ItemSelectorFacade } from '../shared/item-selector/item-selector.facade';
import { ItemSelectorService } from '../shared/item-selector.service';
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
export class AppComponent implements OnInit {
  title = 'Manncorner';
  isDrawerOpen = false; 
  http = inject(HttpClient);
  facade = inject(ItemSelectorFacade);
  constructor(private subject: ItemSelectorFacade, private itemService: ItemSelectorService) {}
  ngOnInit(): void {
    //this.facade.loadAllItems();
  }
}
