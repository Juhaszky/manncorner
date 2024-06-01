import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostDatePipe } from './post-date.pipe';
import { PaginatorComponent } from './paginator/paginator.component';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from './trade.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    MatCardModule,
    CommonModule,
    MatTooltipModule,
    PostDatePipe,
    PaginatorComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  data$: Observable<any> = this.fetchData();
  page = 1;
  inventoryLength: number = 0;
  trades$!: Observable<any[]>;
  totalTrades$!: Observable<number>;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    //this.trades$ = this.http.get('http://localhost:3000/trades');
  }
  activatedRoute = inject(ActivatedRoute);
  tradeService = inject(TradeService);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.page = params.page || 1;
      this.loadTrades(this.page);
    });
    this.trades$ = this.tradeService.getTrades();
    this.totalTrades$ = this.tradeService.getTotalTradesCount();
    //this.totalTrades$ = this.getTotalTradesCount();
  }

  private loadTrades(page: number): void {
    this.tradeService.loadTrades(page).subscribe(() => {
      this.cdr.detectChanges();
    });
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
