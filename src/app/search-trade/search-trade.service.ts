import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchTradeService {
  filterText$: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('searchFilterText') || ''
  );

  setFilterText(val: string) {
    localStorage.setItem('searchFilterText', val);
    this.filterText$.next(val);
  }
}
