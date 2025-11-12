import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileData } from '../../shared/models/ProfileData';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
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
}
