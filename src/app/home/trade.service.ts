import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, pipe, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  //trades$!: Observable<any[]>;
  private tradesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  trades$: Observable<any[]> = this.tradesSubject.asObservable();


  constructor(private http: HttpClient) {}

  loadTrades(page: number, pageSize: number = 10): Observable<any[]> {
    const url = `http://localhost:3000/trades?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url).pipe(
      map((trades: any[]) => {
        const parsedTrades = trades.map((trade: any) => {
          if (typeof trade.itemsFrom === 'string') {
            trade.itemsFrom = JSON.parse(trade.itemsFrom);
            trade.itemsTo = JSON.parse(trade.itemsTo);
            trade.owner = JSON.parse(trade.owner);
            trade.postDate = JSON.parse(trade.postDate);
          }
          return trade;
        });
        return parsedTrades.sort((a: any, b: any) => {
          return (
            new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
          );
        });
      }),
      tap(parsedTrades => this.tradesSubject.next(parsedTrades))
    );
  }

  getTradeById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/trades/${id}`)
  }

  getTotalTradesCount(): Observable<number> {
    return this.http.get<number>("http://localhost:3000/trades/amount");
  }

  getTrades(): Observable<any[]> {
    return this.trades$;
  }
  postTrade(tradeData: any): Observable<any> {
    return this.http.post('http://localhost:3000/trades', tradeData);
  }
}
