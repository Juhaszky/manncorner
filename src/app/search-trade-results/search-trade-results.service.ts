import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TradeResult } from '../../shared/models/trade.model';

@Injectable({
  providedIn: 'root',
})
export class SearchTradeResultsService {
  private resultsSubject = new BehaviorSubject<TradeResult | null>(null);
  results$ = this.resultsSubject.asObservable();

  setResults(results: TradeResult) {
    this.resultsSubject.next(results);
  }

  clear() {
    this.resultsSubject.next(null);
  }
  
}
