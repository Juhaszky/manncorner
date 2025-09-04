import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostDatePipe } from './post-date.pipe';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TradeService } from './trade.service';
import { catchError } from 'rxjs/operators';
import { ItemContainerComponent } from '../../shared/item/item-container.component';
import { Item } from '../../shared/models/item.model';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserDataService } from '../../shared/user-data.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    PostDatePipe,
    PaginatorModule,
    ProgressSpinnerModule,
    TooltipModule,
    ItemContainerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  page = 1;
  first = 0;

  rows = 10;
  allPage = 0;
  trades: {
    itemsToSell: Item[];
    itemsToBuy: Item[];
    id: string;
    username: string;
    createdAt: Date;
    bumpedAt: Date;
  }[] = [];
  loading = false;
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  tradeService = inject(TradeService);
  userService = inject(UserDataService);
  canBump = false;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.page = params['page'] ? +params['page'] : 1;
      this.first = (this.page - 1) * this.rows;
      this.loadTrades(this.page);
    });
  }

  private loadTrades(page: number): void {
    this.loading = true;
    this.tradeService
      .loadTrades(page)
      .pipe(
        map(trades => {
          this.allPage = trades.totalCount;
          return trades.trades.map(trade => {
            const itemsForSale = trade.items.filter(i => i.isSelling === true);
            const itemsToBuy = trade.items.filter(i => i.isSelling === false);
            return {
              itemsToSell: itemsForSale,
              itemsToBuy: itemsToBuy,
              id: trade.id,
              username: trade.username,
              createdAt: trade.createdAt,
              bumpedAt: trade.bumpDate,
            };
          });
        }),
        catchError(err => {
          this.loading = false;
          this.cdr.detectChanges();
          console.log(err);
          return [];
        })
      )
      .subscribe(tradesTransformed => {
        this.trades = tradesTransformed;
        this.cdr.detectChanges();
        this.loading = false;
      });
  }

  selectTrade(tradeId: string): void {
    this.router.navigate(['/trade', tradeId]);
  }
  onPageChange(event: {
    first?: number;
    rows?: number;
    page?: number;
    pageCount?: number;
  }) {
    this.first = event.first ?? 0;
    const rows = event.rows ?? this.rows;
    this.page = Math.floor((event.first ?? 0) / rows) + 1;
    this.loadTrades((event.page ?? 0) + 1);
  }
  onBump(tradeId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const userId = this.userService.getUserId();
    console.log(userId);
    if (userId) {
      this.tradeService.bumpTrade(userId, +tradeId).subscribe(res => {
        console.log(res);
      });
    }
  }
}
