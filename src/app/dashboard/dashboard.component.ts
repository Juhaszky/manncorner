import { Component, inject, OnInit } from '@angular/core';
import { TradeService } from '../home/trade.service';
import { catchError, map } from 'rxjs';
import { Item } from '../../shared/models/item.model';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ItemContainerComponent } from '../../shared/item/item-container.component';
import { ItemSelectorFacade } from '../../shared/item-selector/item-selector.facade';
import { UserDataService } from '../../shared/user-data.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashboard',
  imports: [
    CardModule,
    CommonModule,
    ItemContainerComponent,
    ToggleButtonModule,
    FormsModule,
    ProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  tradeService = inject(TradeService);
  router = inject(Router);
  userService = inject(UserDataService);
  itemSelectorFacade = inject(ItemSelectorFacade);
  messageService = inject(MessageService);
  trades: {
    itemsToSell: Item[];
    itemsToBuy: Item[];
    id: string;
    status: string;
    username: string;
    createdAt: Date;
    bumpedAt: Date;
  }[] = [];
  checked = false;
  loading = true;
  get inactiveTrade() {
    return this.trades.filter(t => t.status === 'closed');
  }

  ngOnInit(): void {
    this.loadTrades();
  }
  private loadTrades(): void {
    this.loading = true;
    this.tradeService
      //TODO - change the userId input
      .getUserTrades('76561198027857565')
      .pipe(
        map(trades => {
          //this.allPage = trades.totalCount;
          return trades.map(trade => {
            const itemsForSale = trade.items.filter(i => i.isSelling === true);
            const itemsToBuy = trade.items.filter(i => i.isSelling === false);
            return {
              itemsToSell: itemsForSale,
              itemsToBuy: itemsToBuy,
              id: trade.id,
              status: trade.status,
              username: trade.username,
              createdAt: trade.createdAt,
              bumpedAt: trade.bumpDate,
            };
          });
        }),
        catchError(err => {
          console.log(err);
          return [];
        })
      )
      .subscribe(tradesTransformed => {
        this.trades = tradesTransformed;
        this.loading = false;
      });
  }
  selectTrade(tradeId: string): void {
    this.router.navigate(['/trade', tradeId]);
  }
  onBump(tradeId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const userId = this.userService.getUserId();
    if (userId) {
      this.tradeService.bumpTrade(userId, tradeId).subscribe(res => {
        if (res.error == null && res.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Trade bumped successfully`,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${res.error}`,
          });
        }
      });
    }
  }
  onHandleStatus(e: Event, tradeId: string) {
    e.stopPropagation();
    e.preventDefault();
    this.changeStatus(tradeId);
  }
  getStatus(trade: {
    itemsToSell: Item[];
    itemsToBuy: Item[];
    id: string;
    status: string;
    username: string;
    createdAt: Date;
    bumpedAt: Date;
  }): boolean {
    return trade.status === 'open';
  }
  setStatus(
    trade: {
      itemsToSell: Item[];
      itemsToBuy: Item[];
      id: string;
      status: string;
      username: string;
      createdAt: Date;
      bumpedAt: Date;
    },
    value: boolean
  ): void {
    trade.status = value ? 'open' : 'closed';
  }

  changeStatus(tradeId: string) {
    this.tradeService.changeTradeStatus(tradeId).subscribe(res => {
      if (res.status === 200) {
        const trades = this.trades;
        const modifiedTradeIdx = trades.findIndex(t => t.id === tradeId);
        if (modifiedTradeIdx > -1) {
          const modifiedTrade = trades[modifiedTradeIdx];
          modifiedTrade.status = res.trade.status;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Trade status changed.`,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${res.error}`,
        });
      }
    });
  }
}
