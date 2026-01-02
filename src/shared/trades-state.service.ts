import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { displayableTrade } from './models/displayableTrade.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TradesStateService {
  private pageSubject = new BehaviorSubject(1);
  private tradesSubject = new BehaviorSubject<displayableTrade[]>([]);
  private loadingSubject = new BehaviorSubject(false);
  private totalRecordsSubject = new BehaviorSubject(0);
  private firstSubject = new BehaviorSubject(0);

  page$ = this.pageSubject.asObservable();
  trades$ = this.tradesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  totalRecords$ = this.totalRecordsSubject.asObservable();
  first$ = this.firstSubject.asObservable();
  
  router = inject(Router);

  setPage(page: number, updateUrl = true): void {
    this.pageSubject.next(page);
    this.firstSubject.next((page - 1) * 10);

    if (updateUrl) {
      this.router.navigate(['/home'], {
        queryParams: { page },
        queryParamsHandling: 'merge',
      });
    }
  }

  setTrades(trades: displayableTrade[], totalRecords: number) {
    this.tradesSubject.next(trades);
    this.totalRecordsSubject.next(totalRecords);
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }
}
