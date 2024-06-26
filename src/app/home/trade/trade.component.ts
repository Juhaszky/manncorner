import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from '../trade.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResizedImageComponent } from '../../../shared/resized-image/resized-image.component';
import { PostDatePipe } from '../post-date.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { ItemComponent } from '../../../shared/item/item.component';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [
    MatTooltipModule,
    ResizedImageComponent,
    PostDatePipe,
    DatePipe,
    CommonModule,
    ItemComponent
  ],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.scss',
})
export class TradeComponent implements OnInit {
  tradeId!: string;
  tradeData: any = {};

  route = inject(ActivatedRoute);
  tradeService = inject(TradeService);
  ngOnInit(): void {
    console.log('ran');
    this.tradeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.tradeId) {
      this.tradeService
        .getTradeById(this.tradeId)
        .pipe(map((data) => {
          data.itemsFrom = JSON.parse(data.itemsFrom);
          data.itemsTo = JSON.parse(data.itemsTo);
          data.owner = JSON.parse(data.owner);
          return data;
        }))
        .subscribe((data) => {
          this.tradeData = data;
          console.log(data);
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
