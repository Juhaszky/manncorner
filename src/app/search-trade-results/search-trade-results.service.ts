import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TradeResult } from '../../shared/models/trade.model';
import { Item } from '../../shared/models/item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SearchTradeResultsService {
  private resultsSubject = new BehaviorSubject<TradeResult | null>(null);
  results$ = this.resultsSubject.asObservable();
  public searchItems: Item[] = [];
  http = inject(HttpClient);

  setResults(results: TradeResult) {
    this.resultsSubject.next(results);
  }
  searchTrades(
    items: Item[],
    page = 1,
  ): Observable<TradeResult> {
    return this.http
      .post<TradeResult>(
        `${environment.API_URL}/api/Trade/search?page=${page}`,
        items
      )
      .pipe(tap(response => this.resultsSubject.next(response)));
  }

  clear() {
    this.resultsSubject.next(null);
  }
}
