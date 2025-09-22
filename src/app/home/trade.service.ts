import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Trade, TradeResult } from '../../shared/models/trade.model';
import { Item } from '../../shared/models/item.model';
import { TradeBumpResult } from '../../shared/models/tradeBumpResult.model';
import { TradeStatusResult } from '../../shared/models/Responses/tradeStatusResult.model';
import { TradeDeleteResult } from '../../shared/models/Responses/tradeDeleteResult.model';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  constructor(private http: HttpClient) {}

  loadTrades(page: number): Observable<TradeResult> {
    const url = `${environment.API_URL}/api/Trade?page=${page}`;
    return this.http.get<TradeResult>(url);
  }

  getTradeById(id: string): Observable<Trade> {
    return this.http.get<Trade>(`${environment.API_URL}/api/Trade/${id}`);
  }
  getUserTrades(id: string): Observable<Trade[]> {
    return this.http.get<Trade[]>(
      `${environment.API_URL}/api/Trade/user/${id}`
    );
  }
  postTrade(tradeData: {
    userId: string;
    createdAt: string;
    status: string;
    description: string;
    items: Item[];
    username: string;
  }): Observable<Trade> {
    return this.http.post<Trade>(`${environment.API_URL}/api/Trade`, tradeData);
  }
  bumpTrade(userId: string, tradeId: string): Observable<TradeBumpResult> {
    return this.http.post<TradeBumpResult>(
      `${environment.API_URL}/api/Trade/bump`,
      {
        userId,
        tradeId,
      }
    );
  }
  deleteTrade(tradeId: string): Observable<TradeDeleteResult> {
    return this.http.delete<TradeDeleteResult>(
      `${environment.API_URL}/api/Trade/delete`,
      {
        body: { tradeId },
      }
    );
  }
  changeTradeStatus(tradeId: string): Observable<TradeStatusResult> {
    return this.http.post<TradeStatusResult>(
      `${environment.API_URL}/api/Trade/changeStatus`,
      {
        tradeId,
      }
    );
  }
}
