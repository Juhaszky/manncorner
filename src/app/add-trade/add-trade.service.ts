import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddTradeService {
  filterText$: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('filterText') || '');

  setFilterText(val: string) {
    localStorage.setItem('filterText', val);
    this.filterText$.next(val);
  }
}
