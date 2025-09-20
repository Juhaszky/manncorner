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

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, CommonModule, ItemContainerComponent],
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
    username: string;
    createdAt: Date;
    bumpedAt: Date;
  }[] = [];
  ngOnInit(): void {
    this.loadTrades();
  }
  private loadTrades(): void {
    //this.loading = true;
    this.tradeService
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
        console.log(this.trades);
        //this.cdr.detectChanges();
        //this.loading = false;
      });
  }
  selectTrade(tradeId: string): void {
    this.router.navigate(['/trade', tradeId]);
  }
  onBump(tradeId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const userId = this.userService.getUserId();
    console.log(userId);
    if (userId) {
      this.tradeService.bumpTrade(userId, +tradeId).subscribe(res => {
        if (res.error == null &&res.status === 200) {
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
}
