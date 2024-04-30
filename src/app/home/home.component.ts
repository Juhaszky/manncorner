import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostDatePipe } from './post-date.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    MatCardModule,
    CommonModule,
    MatTooltipModule,
    PostDatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  data$: Observable<any> = this.fetchData();
  inventoryLength: number = 0;
  trades$!: Observable<any[]>;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    //this.trades$ = this.http.get('http://localhost:3000/trades');
  }
  ngOnInit(): void {
    this.trades$ = this.http.get('http://localhost:3000/trades').pipe(
      map((trades: any) => {
        return trades
          .map((trade: any) => {
            if (typeof trade.itemsFrom === 'string') {
              trade.itemsFrom = JSON.parse(trade.itemsFrom);
              trade.itemsTo = JSON.parse(trade.itemsTo);
              trade.owner = JSON.parse(trade.owner);
              trade.postDate = JSON.parse(trade.postDate);
            }
            console.log(trade);
            return trade;
          })
          .sort((a: any, b: any) => {
            return (
              new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
            );
          });
      })
    );
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

  fetchData(): Observable<any> {
    return this.http.get<Observable<any>>('http://localhost:3000/alma').pipe(
      map((data: any) => {
        this.inventoryLength = data.total_inventory_count;
        this.cdr.detectChanges();
        return data.descriptions;
      })
    );
  }
}
