import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../trade.service';
import { CommonModule } from '@angular/common';
import { catchError, of, switchMap } from 'rxjs';
import { DescrpitionComponent } from '../../../shared/descrpition/descrpition.component';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { Item } from '../../../shared/models/item.model';
import { CommentsComponent } from './comments/comments.component';
import { Comment } from '../../../shared/models/comment.model';

@Component({
  standalone: true,
  selector: 'app-trade',
  imports: [
    CommonModule,
    ItemContainerComponent,
    DescrpitionComponent,
    CommentsComponent
    // InventoryItemsSelectorComponent,
    // OfferItemPanelComponent,
    // OfferItemSelectorComponent
  ],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.scss',
})
export class TradeComponent implements OnInit {
  tradeId!: string;
  tradeData:
    | {
        itemsFrom: Item[];
        itemsTo: Item[];
        id: string;
        username: string;
        description: string;
        comments: Comment[]
      }
    | undefined;
  description = '';
  route = inject(ActivatedRoute);
  tradeService = inject(TradeService);
  ngOnInit(): void {
    this.tradeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.tradeId) {
      this.tradeService
        .getTradeById(this.tradeId)
        .pipe(
          switchMap(trade => {
            console.log(trade);
            const itemsForSale = trade.items.filter((i: Item) => i.isSelling);
            const itemsToBuy = trade.items.filter((i: Item) => !i.isSelling);
            const tradeData = {
              itemsFrom: itemsForSale,
              itemsTo: itemsToBuy,
              id: trade.id,
              username: trade.username,
              description: trade.description,
              comments: trade.comments
            };
            return of(tradeData);
          }),
          catchError(err => {
            console.log(err);
            return [];
          })
        )
        .subscribe(data => {
          if (data) {
            this.tradeData = data;
            this.description = this.tradeData.description;
          }
        });
    }
  }
}
