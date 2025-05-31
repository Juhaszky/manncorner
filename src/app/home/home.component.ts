import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostDatePipe } from './post-date.pipe';
import { PaginatorComponent } from './paginator/paginator.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeService } from './trade.service';
import { catchError } from 'rxjs/operators';
import { ResizedImageComponent } from '../../shared/resized-image/resized-image.component';
import { ItemComponent } from '../../shared/item/item.component';
import { ItemContainerComponent } from '../../shared/item/item-container.component';


@Component({
  standalone: true,
    selector: 'app-home',
    imports: [
        CommonModule,
        PostDatePipe,
        PaginatorComponent,
        ResizedImageComponent,
        ItemComponent,
        ItemContainerComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  data$: Observable<any> = this.fetchData();
  page = 1;
  inventoryLength: number = 0;
  trades$!: Observable<any[]>;
  loading = false;
  totalTrades$!: Observable<number>;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    //this.trades$ = this.http.get('http://localhost:3000/trades');
  }
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
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
    this.loading = true;
    this.tradeService
      .loadTrades(page)
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.cdr.detectChanges();
          console.log(err);
          return [];
        })
      )
      .subscribe(() => {
        this.cdr.detectChanges();
        this.loading = false;
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
        return data;
      })
    );
  }

  selectTrade(tradeId: string): void {
    this.router.navigate(['/trade', tradeId]);
  }
}
