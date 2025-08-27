import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { TradeResult } from '../../shared/models/trade.model';

@Injectable({
  providedIn: 'root',
})
export class TradeService {

  constructor(private http: HttpClient) {}

  loadTrades(page: number): Observable<TradeResult> {
    const url = `${environment.API_URL}/api/Trade?page=${page}`;
    return this.http.get<TradeResult>(url);
  }

  getTradeById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5268/api/Trade/${id}`)
    
  }
  postTrade(tradeData: any): Observable<any> {
    return this.http.post('http://localhost:5268/api/Trade', tradeData);
  }
}
