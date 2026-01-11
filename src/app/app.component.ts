import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
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
import { Paginator } from 'primeng/paginator';
import { catchError, map } from 'rxjs';
import { displayableTrade } from '../shared/models/displayableTrade.model';
import { TradeService } from './home/trade.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { TradesStateService } from '../shared/trades-state.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
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
    ContextMenuModule,
    Paginator,
    LoadingSpinnerComponent
  ],
  providers: [DynamicDialogConfig],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Manncorner';
  isDrawerOpen = false;
  itemService = inject(ItemService);
  tradeService = inject(TradeService);
  tradesState = inject(TradesStateService);
  rows = 10;

  first$ = this.tradesState.first$;
  trades$ = this.tradesState.trades$;
  loading$ = this.tradesState.loading$;
  totalRecords$ = this.tradesState.totalRecords$;

  http = inject(HttpClient);
  facade = inject(ItemSelectorFacade);
  itemFacade = inject(ItemFacade);
  contextMenuItems: MenuItem[] = [];

  activatedRoute = inject(ActivatedRoute);

  cdr = inject(ChangeDetectorRef);

  trades: displayableTrade[] = [];
  loading = false;
  @ViewChild('globalContextMenu') globalContextMenu!: ContextMenu;
  constructor(
    private subject: ItemSelectorFacade,
    @Inject(PLATFORM_ID) private platformId: object,
    public contextMenuService: ContextMenuService
  ) {}
  ngOnInit(): void {
    this.tradesState.page$.subscribe(page => {
      this.loadTrades(page);
    });

    if (isPlatformBrowser(this.platformId)) {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (isMobile) this.itemService.setIsMobileFlag();
      this.contextMenuItems = this.contextMenuService.getContextMenuItems();
    }
  }

  private loadTrades(page: number): void {
    this.loading = true;
    this.tradeService
      .loadTrades(page)
      .pipe(
        map(trades => {
          const transformedTrades = trades.trades.map(trade => {
            const itemsForSale = trade.items.filter(i => i.isSelling === true);
            const itemsToBuy = trade.items.filter(i => i.isSelling === false);
            return {
              itemsToSell: itemsForSale,
              itemsToBuy: itemsToBuy,
              avatarPath: trade.avatarPath,
              id: trade.id,
              username: trade.username,
              createdAt: trade.createdAt,
              bumpedAt: trade.bumpDate,
              description: trade.description,
            };
          });
          this.tradesState.setTrades(transformedTrades, trades.totalCount);
          this.tradesState.setLoading(false);
        }),
        catchError(err => {
          this.loading = false;
          this.cdr.detectChanges();
          console.log(err);
          return [];
        })
      )
      .subscribe(tradesTransformed => {
        this.cdr.detectChanges();
        this.loading = false;
      });
  }

  onPageChange(event: {
    first?: number;
    rows?: number;
    page?: number;
    pageCount?: number;
  }) {
    const page = Math.floor((event.first ?? 0) / this.rows) + 1;
    this.tradesState.setPage(page);
  }
  ngAfterViewInit(): void {
    this.contextMenuService.registerMenu(this.globalContextMenu);
  }
}
