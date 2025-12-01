import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MobileNavComponent } from './navbar/mobile-nav/mobile-nav.component';
import { DrawerModule } from 'primeng/drawer';
import { HttpClient } from '@angular/common/http';
import { ItemSelectorFacade } from '../shared/item-selector/item-selector.facade';
import { Toast } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ItemService } from '../shared/item/item.service';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ItemFacade } from '../shared/item/item.facade';
import { ContextMenuService } from './context-menu.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    NavbarComponent,
    MobileNavComponent,
    DrawerModule,
    Toast,
    DialogModule,
    ContextMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Manncorner';
  isDrawerOpen = false;
  itemService = inject(ItemService);
  http = inject(HttpClient);
  facade = inject(ItemSelectorFacade);
  itemFacade = inject(ItemFacade);
  contextMenuItems: MenuItem[] = [];
  @ViewChild('globalContextMenu') globalContextMenu!: ContextMenu;
  constructor(
    private subject: ItemSelectorFacade,
    @Inject(PLATFORM_ID) private platformId: object,
    public contextMenuService: ContextMenuService
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (isMobile) this.itemService.setIsMobileFlag();
      this.contextMenuItems = this.contextMenuService.getContextMenuItems();
    }
  }
  ngAfterViewInit(): void {
    this.contextMenuService.registerMenu(this.globalContextMenu);
  }
}
