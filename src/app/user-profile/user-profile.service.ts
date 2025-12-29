import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, pluck } from 'rxjs';
import { ProfileData } from '../../shared/models/ProfileData';
import { environment } from '../../environments/environment.development';
import { Item } from '../../shared/models/item.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  httpClient = inject(HttpClient);
  saveTradeUrl(steamId: string, tradeUrl: string): Observable<string> {
    const url = `${environment.API_URL}/api/user/${steamId}/tradeurl`;
    const params = { tradeUrl };

    return this.httpClient.put(url, null, {
      params,
      responseType: 'text',
    });
  }
  getTradeUrl(steamId: string) {
    const url = `${environment.API_URL}/api/User/${steamId}`;
    return this.httpClient.get<ProfileData>(url);
  }

  saveFavouriteItems(steamId: string, items: Item[]): Observable<string> {
    const url = `${environment.API_URL}/api/user/${steamId}/favouriteItems`;

    return this.httpClient.put<string>(url, items, {
      responseType: 'text' as 'json',
    });
  }
  getFavouriteItems(steamId: string): Observable<Item[]> {
    const url = `${environment.API_URL}/api/user/${steamId}/favouriteItems`;
    return this.httpClient
      .get<{ items: Item[]; count: number }>(url)
      .pipe(
        pluck('items'),
        map(items => items as Item[])
      );
  }
}
