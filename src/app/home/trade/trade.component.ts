import {
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../trade.service';
import { ResizedImageComponent } from '../../../shared/resized-image/resized-image.component';
import { PostDatePipe } from '../post-date.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { catchError, map, Observable, of, Subject, switchMap } from 'rxjs';
import { ItemComponent } from '../../../shared/item/item.component';
import { DescrpitionComponent } from '../../../shared/descrpition/descrpition.component';
import { ItemContainerComponent } from '../../../shared/item/item-container.component';
import { BuyItemPanelComponent } from '../../add-trade/buy-item-panel/buy-item-panel.component';

@Component({
  standalone: true,
    selector: 'app-trade',
    imports: [
        ResizedImageComponent,
        PostDatePipe,
        DatePipe,
        CommonModule,
        ItemComponent,
        BuyItemPanelComponent,
        ItemContainerComponent,
        DescrpitionComponent,
    ],
    templateUrl: './trade.component.html',
    styleUrl: './trade.component.scss'
})
export class TradeComponent implements OnInit {
  tradeId!: string;
  tradeData: any = {};
  description = '';
  route = inject(ActivatedRoute);
  tradeService = inject(TradeService);
  ngOnInit(): void {
    this.tradeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.tradeId) {
      this.tradeService
        .getTradeById(this.tradeId)
        .pipe(
                switchMap((trade) => {
                  console.log(trade);
                    const itemsForSale = trade.items.filter((i: any) => i.isSelling);
                    const itemsToBuy = trade.items.filter((i: any) => !i.isSelling);
                    const tradeData ={itemsFrom: itemsForSale, itemsTo: itemsToBuy, id: trade.id, username: trade.username, description: trade.description};
                    return of( tradeData)
                  
                }),
                catchError((err) => {
                  console.log(err);
                  return [];
                })
              )
        .subscribe((data) => {
          this.tradeData = data;
          console.log(this.tradeData);
          this.description = this.tradeData.description;
          console.log(this.description);
        });
    }
  }
  getItemBorderStyle(item: any): string {
    if (item?.name?.includes('Unusual')) {
      return 'unusual';
    } else if (item?.name?.includes('Strange')) {
      return 'strange';
    } else if (item?.name?.includes('Vintage')) {
      return 'vintage';
    } else if (
      (item?.descriptions && item?.descriptions[0]?.value?.includes('Elite')) ||
      item?.descriptions?.value?.includes('Elite')
    ) {
      return 'elite';
    } else {
      return 'unique';
    }
  }
}
