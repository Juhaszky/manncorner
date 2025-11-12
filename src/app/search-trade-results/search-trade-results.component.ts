import { Component, inject, OnInit } from '@angular/core';
import { Trade } from '../../shared/models/trade.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchTradeResultsService } from './search-trade-results.service';
import { Item } from '../../shared/models/item.model';
import { UserDataService } from '../../shared/user-data.service';
import { TradeService } from '../home/trade.service';
import { TooltipModule } from 'primeng/tooltip';
import { ItemContainerComponent } from '../../shared/item/item-container.component';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { PostDatePipe } from '../home/post-date.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-search-results',
  imports: [
    TooltipModule,
    ItemContainerComponent,
    DatePipe,
    PostDatePipe,
    PaginatorModule,
    ProgressSpinnerModule,
    CardModule,
    CommonModule,
    NgOptimizedImage,
    AvatarModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './search-trade-results.component.html',
  styleUrl: './search-trade-results.component.scss',
})
export class SearchTradeResultsComponent implements OnInit {
  searchResults: Trade[] = [];
  router = inject(Router);
  searchTradeResults = inject(SearchTradeResultsService);

  page = 1;
  first = 0;

  rows = 10;
  allPage = 0;
  trades: {
    itemsToSell: Item[];
    itemsToBuy: Item[];
    id: string;
    avatarPath: string;
    username: string;
    createdAt: Date;
    bumpedAt: Date;
  }[] = [];
  loading = false;
  activatedRoute = inject(ActivatedRoute);
  tradeService = inject(TradeService);
  userService = inject(UserDataService);
  canBump = false;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadSearchResults(this.page);
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
    this.loadSearchResults(this.page);
  }

  loadSearchResults(page: number) {
    this.loading = true;

    this.searchTradeResults
      .searchTrades(this.searchTradeResults.searchItems, page)
      .subscribe({
        next: response => {
          this.trades = response.trades.map(trade => ({
            itemsToSell: trade.items.filter(i => i.isSelling === true),
            itemsToBuy: trade.items.filter(i => i.isSelling === false),
            avatarPath: trade.avatarPath,
            id: trade.id,
            username: trade.username,
            createdAt: trade.createdAt,
            bumpedAt: trade.bumpDate,
          }));
          this.allPage = response.totalCount;
          this.page = response.page;
          this.loading = false;
        },
        error: err => {
          console.error('Error loading search results:', err);
          this.loading = false;
        },
      });
  }
  onBump(tradeId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const userId = this.userService.getUserId();
    console.log(userId);
    if (userId) {
      this.tradeService.bumpTrade(userId, tradeId).subscribe(res => {
        console.log(res);
      });
    }
  }
}
